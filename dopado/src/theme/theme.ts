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
    // Russian Palette inspired
    background: "#303952",     // Biscay
    surface: "#3A435F",
    surfaceLight: "#596275",   // Pencil Lead

    primary: "#546DE5",        // Cornflower
    primaryDark: "#574B90",    // Purple Corallite
    secondary: "#3DC1D3",      // Blue Curacao
    accent: "#778BEB",         // Soft Blue
    reward: "#F5CD79",         // Summertime
    success: "#63CDDA",        // Squeaky

    text: "#F7F1E3",
    textMuted: "#D8D6D0",
    textDisabled: "#A9A7A2",
    danger: "#E66767",         // Porcelain Rose
    border: "#4A526B",

    statusBarStyle: "light",
  },

  light: {
    // Russian Palette inspired
    background: "#F7F1E3",
    surface: "#FFFFFF",
    surfaceLight: "#F7D794",   // Rosy Highlight

    primary: "#546DE5",        // Cornflower
    primaryDark: "#303952",    // Biscay
    secondary: "#3DC1D3",      // Blue Curacao
    accent: "#F8A5C2",         // Rogue Pink
    reward: "#F5CD79",         // Summertime
    success: "#63CDDA",        // Squeaky

    text: "#303952",
    textMuted: "#596275",
    textDisabled: "#9CA0AD",
    danger: "#C44569",         // Deep Rose
    border: "#E7DCCB",

    statusBarStyle: "dark",
  },
};