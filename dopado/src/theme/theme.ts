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
    background: "#001F2F",
    surface: "#003049",
    surfaceLight: "#0A405E",

    primary: "#F77F00",
    primaryDark: "#C86400",
    secondary: "#FCBF49",
    accent: "#EAE2B7",
    reward: "#FCBF49",
    success: "#F77F00",

    text: "#FFF8E1",
    textMuted: "#D8CFA5",
    textDisabled: "#9E9270",
    danger: "#D62828",
    border: "#164761",

    statusBarStyle: "light",
  },

  light: {
    background: "#EAE2B7",
    surface: "#FFF8E1",
    surfaceLight: "#F6D889",

    primary: "#003049",
    primaryDark: "#001F2F",
    secondary: "#F77F00",
    accent: "#FCBF49",
    reward: "#F77F00",
    success: "#003049",

    text: "#003049",
    textMuted: "#5E5A48",
    textDisabled: "#9A9272",
    danger: "#D62828",
    border: "#D8CFA5",

    statusBarStyle: "dark",
  },
};