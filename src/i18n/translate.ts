import es from "../locales/es.json";
import en from "../locales/en.json";
import it from "../locales/it.json";

import { AppLanguage } from "./types";

export type TranslationMessages = typeof es;
export type TranslationKey = NestedKeyOf<TranslationMessages>;
export type TranslateParams = Record<string, string | number>;

type NestedKeyOf<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T & string]: T[K] extends Record<string, unknown>
        ? `${K}.${NestedKeyOf<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

const dictionaries: Record<AppLanguage, TranslationMessages> = {
  es,
  it,
  en,
};

function lookup(
  messages: TranslationMessages,
  key: TranslationKey,
): string | undefined {
  const parts = key.split(".");
  let current: unknown = messages;

  for (const part of parts) {
    if (typeof current !== "object" || current === null || !(part in current)) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : undefined;
}

function interpolate(template: string, params?: TranslateParams): string {
  if (!params) {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
    const value = params[name];
    return value === undefined ? `{{${name}}}` : String(value);
  });
}

export function translate(
  language: AppLanguage,
  key: TranslationKey,
  params?: TranslateParams,
): string {
  const message =
    lookup(dictionaries[language], key) ??
    lookup(dictionaries.es, key) ??
    key;

  return interpolate(message, params);
}

let currentLanguage: AppLanguage = "es";

export function setRuntimeLanguage(language: AppLanguage) {
  currentLanguage = language;
}

export function t(key: TranslationKey, params?: TranslateParams): string {
  return translate(currentLanguage, key, params);
}
