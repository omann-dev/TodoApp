export type ThemeName = "dark" | "light";

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceLight: string;
  primary: string;
  primaryDark: string;
  text: string;
  textMuted: string;
  textDisabled: string;
  danger: string;
  border: string;
  statusBarStyle: "light" | "dark";
};

export const themes: Record<ThemeName, ThemeColors> = {
  dark: {
    background: "#121212",
    surface: "#1e1e1e",
    surfaceLight: "#2a2a2a",
    primary: "#7c3aed",
    primaryDark: "#5b21b6",
    text: "#ffffff",
    textMuted: "#a1a1a1",
    textDisabled: "#777777",
    danger: "#ef4444",
    border: "#2f2f2f",
    statusBarStyle: "light",
  },
  light: {
    background: "#f4f4f7",
    surface: "#ffffff",
    surfaceLight: "#ececf1",
    primary: "#7c3aed",
    primaryDark: "#5b21b6",
    text: "#18181b",
    textMuted: "#71717a",
    textDisabled: "#a1a1aa",
    danger: "#dc2626",
    border: "#e4e4e7",
    statusBarStyle: "dark",
  },
};