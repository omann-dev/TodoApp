import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeColors, ThemeName, themes } from "./theme";
import { runMigrations } from "../database/migrations";
import {
  getThemeSetting,
  saveThemeSetting,
} from "../database/settingsRepository";

type ThemeContextValue = {
  themeName: ThemeName;
  colors: ThemeColors;
  isThemeLoading: boolean;
  setThemeName: (themeName: ThemeName) => Promise<void>;
  toggleTheme: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeNameState, setThemeNameState] = useState<ThemeName>("dark");
  const [isThemeLoading, setIsThemeLoading] = useState(true);

  useEffect(() => {
    async function loadTheme() {
      try {
        await runMigrations();

        const savedThemeName = await getThemeSetting();

        if (savedThemeName) {
          setThemeNameState(savedThemeName);
        }
      } finally {
        setIsThemeLoading(false);
      }
    }

    loadTheme();
  }, []);

  async function setThemeName(themeName: ThemeName) {
    setThemeNameState(themeName);
    await saveThemeSetting(themeName);
  }

  async function toggleTheme() {
    const nextThemeName = themeNameState === "dark" ? "light" : "dark";
    await setThemeName(nextThemeName);
  }

  const value = useMemo(
    () => ({
      themeName: themeNameState,
      colors: themes[themeNameState],
      isThemeLoading,
      setThemeName,
      toggleTheme,
    }),
    [themeNameState, isThemeLoading]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}