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
    background: "#1F1914",
    surface: "#2A221B",
    surfaceLight: "#382E25",

    primary: "#A2987A",
    primaryDark: "#7E7358",
    secondary: "#9D9272",
    accent: "#AAAAAA",
    reward: "#C7B98D",
    success: "#A2987A",

    text: "#F7F1E8",
    textMuted: "#C9BFAA",
    textDisabled: "#8D8374",
    danger: "#C46A5A",
    border: "#4F4031",

    statusBarStyle: "light",
  },

  light: {
    background: "#F6F1E8",
    surface: "#FFFFFF",
    surfaceLight: "#E8E0D2",

    primary: "#5E4F3F",
    primaryDark: "#4F4031",
    secondary: "#9D9272",
    accent: "#A2987A",
    reward: "#BCA875",
    success: "#7F8F68",

    text: "#241E18",
    textMuted: "#6F6254",
    textDisabled: "#A9A094",
    danger: "#B85C50",
    border: "#DED5C7",

    statusBarStyle: "dark",
  },
};