import { getDatabase } from "./database";
import { ThemeName } from "../theme/theme";

const THEME_SETTING_KEY = "themeName";

export async function getThemeSetting(): Promise<ThemeName | null> {
  const db = await getDatabase();

  const row = await db.getFirstAsync<{ value: string }>(
    `
    SELECT value
    FROM settings
    WHERE key = ?;
    `,
    [THEME_SETTING_KEY]
  );

  if (row?.value === "dark" || row?.value === "light") {
    return row.value;
  }

  return null;
}

export async function saveThemeSetting(themeName: ThemeName): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
    INSERT OR REPLACE INTO settings (key, value)
    VALUES (?, ?);
    `,
    [THEME_SETTING_KEY, themeName]
  );
}