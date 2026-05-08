import React, { createContext, useCallback, useContext, useLayoutEffect, useMemo, useSyncExternalStore } from "react";

import i18n, {
  ensureLanguageResources,
  getStoredLanguage,
  LANGUAGE_STORAGE_KEY,
  normalizeLanguage,
  type SupportedLanguageCode,
} from "../i18n";

type TranslationNamespace =
  | "navbar"
  | "footer"
  | "hero"
  | "auth"
  | "whyChooseUs"
  | "reviews"
  | "servicesPage"
  | "services"
  | "complaints"
  | "rating"
  | "legal"
  | "chatbot"
  | "faq"
  | "doctor"
  | "admin";

interface LanguageContextType {
  language: SupportedLanguageCode;
  setLanguage: (language: SupportedLanguageCode) => void;
  t: (namespace: TranslationNamespace, key: string, fallback: string) => string;
}

const applyDocumentLanguage = (language: SupportedLanguageCode) => {
  if (typeof document === "undefined") {
    return;
  }

  const direction = language === "ur" ? "rtl" : "ltr";
  document.documentElement.lang = language;
  document.documentElement.dir = direction;
  document.body.dir = direction;
};

const getCurrentLanguage = () => normalizeLanguage(i18n.language ?? getStoredLanguage());

const subscribeToLanguage = (onStoreChange: () => void) => {
  const handleLanguageChange = () => onStoreChange();

  i18n.on("languageChanged", handleLanguageChange);
  i18n.on("loaded", handleLanguageChange);

  return () => {
    i18n.off("languageChanged", handleLanguageChange);
    i18n.off("loaded", handleLanguageChange);
  };
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const language = useSyncExternalStore(subscribeToLanguage, getCurrentLanguage, getCurrentLanguage);

  useLayoutEffect(() => {
    applyDocumentLanguage(language);
  }, [language]);

  console.log("Active language:", language);

  const t = useCallback((namespace: TranslationNamespace, key: string, fallback: string) => {
    return i18n.t(`${namespace}.${key}`, {
      defaultValue: fallback,
      ns: "common",
    }) as string;
  }, []);

  const setLanguage = useCallback((nextLanguage: SupportedLanguageCode) => {
    const normalizedLanguage = normalizeLanguage(nextLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
    applyDocumentLanguage(normalizedLanguage);
    void (async () => {
      await ensureLanguageResources(normalizedLanguage);
      await i18n.changeLanguage(normalizedLanguage);
    })();
  }, []);

  const value = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
};

export { LANGUAGE_STORAGE_KEY };
