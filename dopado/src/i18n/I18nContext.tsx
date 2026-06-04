import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { runMigrations } from "../database/migrations";
import { getSetting, saveSetting } from "../database/settingsRepository";
import { Language, TranslationKey, translations } from "./translations";

const LANGUAGE_SETTING_KEY = "language";
const DEFAULT_LANGUAGE: Language = "de";

type TranslationParams = Record<string, string | number>;

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  t: (key: TranslationKey, params?: TranslationParams) => string;
  isLanguageLoading: boolean;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

type I18nProviderProps = {
  children: ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
  const [languageState, setLanguageState] =
    useState<Language>(DEFAULT_LANGUAGE);

  const [isLanguageLoading, setIsLanguageLoading] = useState(true);

  useEffect(() => {
    async function loadLanguage() {
      try {
        await runMigrations();

        const savedLanguage = await getSetting(LANGUAGE_SETTING_KEY);

        if (savedLanguage === "de" || savedLanguage === "en") {
          setLanguageState(savedLanguage);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Sprache:", error);
      } finally {
        setIsLanguageLoading(false);
      }
    }

    void loadLanguage();
  }, []);

  async function setLanguage(language: Language) {
    setLanguageState(language);
    await saveSetting(LANGUAGE_SETTING_KEY, language);
  }

  function t(key: TranslationKey, params?: TranslationParams): string {
    let text: string =
      translations[languageState][key] ??
      translations.de[key] ??
      key;

    if (!params) {
      return text;
    }

    Object.entries(params).forEach(([paramKey, value]) => {
      text = text.split(`{${paramKey}}`).join(String(value));
    });

    return text;
  }

  const value = useMemo(
    () => ({
      language: languageState,
      setLanguage,
      t,
      isLanguageLoading,
    }),
    [languageState, isLanguageLoading]
  );

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}