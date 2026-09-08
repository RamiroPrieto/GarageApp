import * as SecureStore from "expo-secure-store";

import { AppLanguage, LanguagePreference } from "./types";

const LANGUAGE_PREFERENCE_KEY = "language_preference";

function isAppLanguage(value: string | null): value is AppLanguage {
  return value === "es" || value === "it" || value === "en";
}

export async function loadLanguagePreference(): Promise<LanguagePreference> {
  const stored = await SecureStore.getItemAsync(LANGUAGE_PREFERENCE_KEY);

  if (isAppLanguage(stored)) {
    return stored;
  }

  return "system";
}

export async function saveLanguagePreference(
  preference: LanguagePreference,
): Promise<void> {
  if (preference === "system") {
    await SecureStore.deleteItemAsync(LANGUAGE_PREFERENCE_KEY);
    return;
  }

  await SecureStore.setItemAsync(LANGUAGE_PREFERENCE_KEY, preference);
}
