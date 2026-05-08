import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export type SupportedLanguageCode = "en" | "ur";

export const LANGUAGE_STORAGE_KEY = "medirator-language";
const DEFAULT_LANGUAGE: SupportedLanguageCode = "en";

const localeLoaders = import.meta.glob("./locales/*/common.json");
const loadedLanguages = new Set<SupportedLanguageCode>();

const isSupportedLanguage = (language: string | null | undefined): language is SupportedLanguageCode =>
  language === "en" || language === "ur";

export const normalizeLanguage = (language: string | null | undefined): SupportedLanguageCode =>
  isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE;

export const getStoredLanguage = (): SupportedLanguageCode => {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
};

const loadLanguageResources = async (language: SupportedLanguageCode) => {
  if (loadedLanguages.has(language)) {
    return;
  }

  const loader = localeLoaders[`./locales/${language}/common.json`];
  if (!loader) {
    return;
  }

  const module = (await loader()) as { default: Record<string, string> };
  i18n.addResourceBundle(language, "common", module.default, true, true);
  loadedLanguages.add(language);
};

export const ensureLanguageResources = async (language: SupportedLanguageCode) => {
  await loadLanguageResources(language);
};

void i18n.use(initReactI18next).init({
  lng: getStoredLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  ns: ["common"],
  defaultNS: "common",
  resources: {},
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

void ensureLanguageResources(getStoredLanguage());

export default i18n;
