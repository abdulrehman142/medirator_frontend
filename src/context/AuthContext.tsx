/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import axios from "axios";
import { authApi } from "../api/authApi";
import { tokenStore } from "../auth/tokenStore";

export type UserRole = "patient" | "doctor" | "admin";

interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

interface RegisterAccountInput {
  email: string;
  role: Exclude<UserRole, "admin">;
  password: string;
  name: string;
  phone: string;
}

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  authReady: boolean;
  login: (nextUser: AuthUser) => void;
  loginWithCredentials: (input: { email: string; password: string; role: UserRole }) => Promise<AuthResult>;
  registerAccount: (input: RegisterAccountInput) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const AUTH_STORAGE_KEY = "medirator_auth_user";
const REFRESH_TOKEN_KEY = "medirator_refresh_token";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStoredUser = (): AuthUser | null => {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (!parsed.id || !parsed.email || !parsed.role) {
      return null;
    }

    if (!["patient", "doctor", "admin"].includes(parsed.role)) {
      return null;
    }

    return {
      id: parsed.id,
      email: parsed.email,
      role: parsed.role as UserRole,
    };
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [authReady, setAuthReady] = useState(false);

  const login = (nextUser: AuthUser) => {
    setUser(nextUser);
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
  };

  const logout = async () => {
    const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY) ?? undefined;

    try {
      await authApi.logout(refreshToken);
    } catch {
      // Keep client logout reliable even if server logout fails.
    }

    setUser(null);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    tokenStore.clear();
  };

  const loginWithCredentials = async (input: { email: string; password: string; role: UserRole }): Promise<AuthResult> => {
    try {
      await authApi.login({
        email: input.email.trim().toLowerCase(),
        password: input.password,
      });

      const currentUser = await authApi.me();

      if (currentUser.role !== input.role) {
        await logout();
        return { ok: false, error: "Selected role does not match this account." };
      }

      login({ id: currentUser.id, email: currentUser.email, role: currentUser.role });
      return { ok: true };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        if (typeof detail === "string" && detail.trim()) {
          return { ok: false, error: detail };
        }
      }
      return { ok: false, error: "Invalid credentials or server unavailable." };
    }
  };

  const registerAccount = async (input: RegisterAccountInput): Promise<AuthResult> => {
    try {
      await authApi.register({
        email: input.email.trim().toLowerCase(),
        password: input.password,
        full_name: input.name.trim(),
        role: input.role,
      });

      return { ok: true };
    } catch {
      return { ok: false, error: "Registration failed. Please try a different email." };
    }
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = tokenStore.getAccessToken();

      if (!token) {
        setAuthReady(true);
        return;
      }

      try {
        const currentUser = await authApi.me();
        login({ id: currentUser.id, email: currentUser.email, role: currentUser.role });
      } catch {
        await logout();
      } finally {
        setAuthReady(true);
      }
    };

    void bootstrapAuth();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      authReady,
      login,
      loginWithCredentials,
      registerAccount,
      logout,
    }),
    [authReady, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};