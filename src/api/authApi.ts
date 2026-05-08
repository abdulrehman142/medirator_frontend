import { http } from "./http";
import type { TokenPair, UserPublic } from "../types/api";
import { tokenStore } from "../auth/tokenStore";

const REFRESH_TOKEN_KEY = "medirator_refresh_token";

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  role: "patient" | "doctor";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<TokenPair> {
    const { data } = await http.post<TokenPair>("/auth/register", payload);
    tokenStore.setAccessToken(data.access_token);
    if (data.refresh_token) {
      sessionStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
    }
    return data;
  },

  async login(payload: LoginPayload): Promise<TokenPair> {
    const { data } = await http.post<TokenPair>("/auth/login", payload);
    tokenStore.setAccessToken(data.access_token);
    if (data.refresh_token) {
      sessionStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
    }
    return data;
  },

  async logout(refreshToken?: string): Promise<void> {
    if (refreshToken) {
      await http.post("/auth/logout", { refresh_token: refreshToken });
    }
    tokenStore.clear();
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const { data } = await http.post<{ message: string }>("/auth/forgot-password", { email });
    return data;
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const { data } = await http.post<{ message: string }>("/auth/reset-password", {
      token,
      new_password: newPassword,
    });
    return data;
  },

  async me(): Promise<UserPublic> {
    const { data } = await http.get<UserPublic>("/users/me");
    return data;
  },
};
