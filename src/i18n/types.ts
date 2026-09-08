export const APP_LANGUAGES = ["es", "it", "en"] as const;

export type AppLanguage = (typeof APP_LANGUAGES)[number];

export type LanguagePreference = AppLanguage | "system";

export const DATE_LOCALES: Record<AppLanguage, string> = {
  es: "es-ES",
  it: "it-IT",
  en: "en-US",
};
