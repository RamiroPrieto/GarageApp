import { NativeModules, Platform } from "react-native";

import { APP_LANGUAGES, AppLanguage } from "./types";

function isAppLanguage(value: string): value is AppLanguage {
  return (APP_LANGUAGES as readonly string[]).includes(value);
}

function getDeviceLocaleTag(): string {
  try {
    const intlLocale = Intl.DateTimeFormat().resolvedOptions().locale;
    if (intlLocale) {
      return intlLocale;
    }
  } catch {
    // Fall through to native modules.
  }

  if (Platform.OS === "ios") {
    const settings = NativeModules.SettingsManager?.settings as
      | { AppleLocale?: string; AppleLanguages?: string[] }
      | undefined;
    return settings?.AppleLocale ?? settings?.AppleLanguages?.[0] ?? "es";
  }

  const localeIdentifier = NativeModules.I18nManager?.localeIdentifier as
    | string
    | undefined;
  return localeIdentifier ?? "es";
}

export function getDeviceLanguage(): AppLanguage {
  const tag = getDeviceLocaleTag();
  const code = tag.split(/[-_]/)[0]?.toLowerCase() ?? "es";

  if (isAppLanguage(code)) {
    return code;
  }

  return "es";
}
