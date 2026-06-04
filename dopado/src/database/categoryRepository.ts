import { getDatabase } from "./database";
import { Category } from "../types/category";
import { getCurrentTimestamp } from "../services/dateService";

type CategoryRow = {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  deletedAt: string | null;
};

function mapRowToCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    createdAt: row.createdAt,
    deletedAt: row.deletedAt,
  };
}

export async function createCategory(
  name: string,
  color: string
): Promise<Category> {
  const db = await getDatabase();

  const category: Category = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: name.trim(),
    color,
    createdAt: getCurrentTimestamp(),
    deletedAt: null,
  };

  await db.runAsync(
    `
    INSERT INTO categories (
      id,
      name,
      color,
      createdAt,
      deletedAt
    )
    VALUES (?, ?, ?, ?, ?);
    `,
    [
      category.id,
      category.name,
      category.color,
      category.createdAt,
      category.deletedAt,
    ]
  );

  return category;
}

export async function getActiveCategories(): Promise<Category[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<CategoryRow>(
    `
    SELECT *
    FROM categories
    WHERE deletedAt IS NULL
    ORDER BY createdAt ASC;
    `
  );

  return rows.map(mapRowToCategory);
}