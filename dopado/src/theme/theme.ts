export type ThemeName = "dark" | "light";

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceLight: string;

  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  reward: string;
  success: string;

  text: string;
  textMuted: string;
  textDisabled: string;
  danger: string;
  border: string;

  statusBarStyle: "light" | "dark";
};

export const themes: Record<ThemeName, ThemeColors> = {
  dark: {
    background: "#071A2F",
    surface: "#0B2545",
    surfaceLight: "#12395F",

    primary: "#2196F3",
    primaryDark: "#1976D2",
    secondary: "#00BCD4",
    accent: "#4DD0E1",
    reward: "#00BCD4",
    success: "#26C6DA",

    text: "#F5FBFF",
    textMuted: "#B8D4E8",
    textDisabled: "#6F8DA3",
    danger: "#EF5350",
    border: "#16496F",

    statusBarStyle: "light",
  },

  light: {
    background: "#E3F2FD",
    surface: "#FFFFFF",
    surfaceLight: "#BBDEFB",

    primary: "#2196F3",
    primaryDark: "#1976D2",
    secondary: "#00BCD4",
    accent: "#0097A7",
    reward: "#00BCD4",
    success: "#0097A7",

    text: "#0D2438",
    textMuted: "#607D8B",
    textDisabled: "#90A4AE",
    danger: "#D32F2F",
    border: "#B3E5FC",

    statusBarStyle: "dark",
  },
};