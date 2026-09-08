import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getDeviceLanguage } from "../i18n/deviceLanguage";
import { saveLanguagePreference, loadLanguagePreference } from "../i18n/storage";
import {
  setRuntimeLanguage,
  translate,
  TranslationKey,
  TranslateParams,
} from "../i18n/translate";
import { AppLanguage, DATE_LOCALES, LanguagePreference } from "../i18n/types";

type I18nContextValue = {
  language: AppLanguage;
  preference: LanguagePreference;
  dateLocale: string;
  t: (key: TranslationKey, params?: TranslateParams) => string;
  setPreference: (preference: LanguagePreference) => Promise<void>;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function resolveLanguage(preference: LanguagePreference): AppLanguage {
  if (preference === "system") {
    return getDeviceLanguage();
  }

  return preference;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] =
    useState<LanguagePreference>("system");
  const [isReady, setIsReady] = useState(false);

  const language = resolveLanguage(preference);

  useEffect(() => {
    const restorePreference = async () => {
      const storedPreference = await loadLanguagePreference();
      setPreferenceState(storedPreference);
      setRuntimeLanguage(resolveLanguage(storedPreference));
      setIsReady(true);
    };

    void restorePreference();
  }, []);

  useEffect(() => {
    setRuntimeLanguage(language);
  }, [language]);

  const setPreference = useCallback(async (nextPreference: LanguagePreference) => {
    await saveLanguagePreference(nextPreference);
    setPreferenceState(nextPreference);
    setRuntimeLanguage(resolveLanguage(nextPreference));
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: TranslateParams) =>
      translate(language, key, params),
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      preference,
      dateLocale: DATE_LOCALES[language],
      t,
      setPreference,
    }),
    [language, preference, t, setPreference],
  );

  if (!isReady) {
    return null;
  }

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n debe utilizarse dentro de I18nProvider");
  }

  return context;
}
