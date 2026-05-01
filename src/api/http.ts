import axios, { AxiosError, AxiosHeaders } from "axios";

import { tokenStore } from "../auth/tokenStore";
import { getStoredLanguage } from "../i18n";
import type { TokenPair } from "../types/api";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

export const http = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  timeout: 15000,
});

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

const resolveQueue = (token: string | null) => {
  pendingQueue.forEach((cb) => cb(token));
  pendingQueue = [];
};

http.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken();
  const language = getStoredLanguage();

  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["Accept-Language"] = language;
  config.headers["X-Language"] = language;

  if (config.data && typeof config.data === "object" && !(config.data instanceof FormData) && !Array.isArray(config.data)) {
    config.data = {
      ...config.data,
      lang: language,
    };
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (typeof error.config & { _retry?: boolean }) | undefined;

    if (error.response?.status !== 401 || !original || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((token) => {
          if (!token) {
            reject(error);
            return;
          }
          if (!original.headers) {
            original.headers = new AxiosHeaders();
          }
          original.headers.Authorization = `Bearer ${token}`;
          resolve(http(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const refreshResp = await axios.post<TokenPair>(`${apiBaseURL}/auth/refresh`, {
        refresh_token: sessionStorage.getItem("medirator_refresh_token"),
      });

      const newToken = refreshResp.data.access_token;
      tokenStore.setAccessToken(newToken);
      resolveQueue(newToken);

      if (!original.headers) {
        original.headers = new AxiosHeaders();
      }
      original.headers.Authorization = `Bearer ${newToken}`;
      return http(original);
    } catch (refreshErr) {
      tokenStore.clear();
      sessionStorage.removeItem("medirator_refresh_token");
      resolveQueue(null);
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);
