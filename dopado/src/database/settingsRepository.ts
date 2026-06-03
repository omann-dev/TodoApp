import { getDatabase } from "./database";
import { ThemeName } from "../theme/theme";

const THEME_SETTING_KEY = "themeName";

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDatabase();

  const row = await db.getFirstAsync<{ value: string }>(
    `
    SELECT value
    FROM settings
    WHERE key = ?;
    `,
    [key]
  );

  return row?.value ?? null;
}

export async function saveSetting(key: string, value: string): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
    INSERT OR REPLACE INTO settings (key, value)
    VALUES (?, ?);
    `,
    [key, value]
  );
}

export async function getNumberSetting(key: string): Promise<number | null> {
  const value = await getSetting(key);

  if (value === null) {
    return null;
  }

  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    return null;
  }

  return parsedValue;
}

export async function saveNumberSetting(
  key: string,
  value: number
): Promise<void> {
  await saveSetting(key, String(value));
}

export async function getThemeSetting(): Promise<ThemeName | null> {
  const value = await getSetting(THEME_SETTING_KEY);

  if (value === "dark" || value === "light") {
    return value;
  }

  return null;
}

export async function saveThemeSetting(themeName: ThemeName): Promise<void> {
  await saveSetting(THEME_SETTING_KEY, themeName);
}