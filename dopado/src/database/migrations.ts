import { getDatabase } from "./database";

type TableColumn = {
  name: string;
};

export async function runMigrations(): Promise<void> {
  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      plannedFor TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      completedAt TEXT,
      deletedAt TEXT,
      isDone INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      deletedAt TEXT
    );
  `);

  const todoColumns = await db.getAllAsync<TableColumn>(`
    PRAGMA table_info(todos);
  `);

  const hasCategoryIdColumn = todoColumns.some(
    (column) => column.name === "categoryId"
  );

  if (!hasCategoryIdColumn) {
    await db.execAsync(`
      ALTER TABLE todos ADD COLUMN categoryId TEXT;
    `);
  }
}