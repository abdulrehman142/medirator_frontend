/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type UserRole = "patient" | "doctor" | "admin";

export const ADMIN_EMAIL = "admin@medirator";
export const ADMIN_PASSWORD = "rehman@16@";
const ADMIN_EMAIL_NORMALIZED = ADMIN_EMAIL.toLowerCase();

interface AuthUser {
  email: string;
  role: UserRole;
}

interface AuthAccount {
  email: string;
  role: Exclude<UserRole, "admin">;
  password: string;
  name: string;
  phone: string;
}

interface RegisterAccountInput {
  email: string;
  role: Exclude<UserRole, "admin">;
  password: string;
  name: string;
  phone: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (nextUser: AuthUser) => void;
  loginWithCredentials: (input: { email: string; password: string; role: UserRole }) => {
    ok: boolean;
    error?: string;
  };
  registerAccount: (input: RegisterAccountInput) => { ok: boolean; error?: string };
  logout: () => void;
}

const AUTH_STORAGE_KEY = "medirator_auth_user";
const ACCOUNT_STORAGE_KEY = "medirator_auth_accounts";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStoredUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (!parsed.email || !parsed.role) {
      return null;
    }

    if (!["patient", "doctor", "admin"].includes(parsed.role)) {
      return null;
    }

    return {
      email: parsed.email,
      role: parsed.role as UserRole,
    };
  } catch {
    return null;
  }
};

const readStoredAccounts = (): AuthAccount[] => {
  try {
    const raw = localStorage.getItem(ACCOUNT_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as AuthAccount[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (account) =>
        typeof account.email === "string" &&
        typeof account.password === "string" &&
        typeof account.name === "string" &&
        typeof account.phone === "string" &&
        (account.role === "patient" || account.role === "doctor"),
    );
  } catch {
    return [];
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [accounts, setAccounts] = useState<AuthAccount[]>(() => readStoredAccounts());

  const login = (nextUser: AuthUser) => {
    setUser(nextUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const loginWithCredentials = (input: { email: string; password: string; role: UserRole }) => {
    const normalizedEmail = input.email.trim().toLowerCase();

    if (input.role === "admin") {
      if (normalizedEmail !== ADMIN_EMAIL_NORMALIZED || input.password !== ADMIN_PASSWORD) {
        return { ok: false, error: "Invalid admin credentials." };
      }

      login({ email: normalizedEmail, role: "admin" });
      return { ok: true };
    }

    const matchedAccount = accounts.find(
      (account) => account.email === normalizedEmail && account.role === input.role,
    );

    if (!matchedAccount) {
      return { ok: false, error: "No account found for this email and role." };
    }

    if (matchedAccount.password !== input.password) {
      return { ok: false, error: "Incorrect password." };
    }

    login({ email: normalizedEmail, role: input.role });
    return { ok: true };
  };

  const registerAccount = (input: RegisterAccountInput) => {
    const normalizedEmail = input.email.trim().toLowerCase();

    if (normalizedEmail === ADMIN_EMAIL_NORMALIZED) {
      return { ok: false, error: "This email is reserved and cannot be registered." };
    }

    const emailAlreadyExists = accounts.some((account) => account.email === normalizedEmail);

    if (emailAlreadyExists) {
      return {
        ok: false,
        error: "This email is already registered with another account. Use a different email.",
      };
    }

    const nextAccounts = [
      ...accounts,
      {
        email: normalizedEmail,
        role: input.role,
        password: input.password,
        name: input.name.trim(),
        phone: input.phone.trim(),
      },
    ];

    setAccounts(nextAccounts);
    localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(nextAccounts));

    return { ok: true };
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      loginWithCredentials,
      registerAccount,
      logout,
    }),
    [accounts, user]
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