import { getDatabase } from "./database";
import { CreateTodoInput, Todo, UpdateTodoInput } from "../types/todo";
import { getCurrentTimestamp, getTodayDateKey } from "../services/dateService";

type TodoRow = {
  id: string;
  title: string;
  description: string | null;
  plannedFor: string;
  createdAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  isDone: number;
  categoryId: string | null;
  categoryName: string | null;
  categoryColor: string | null;
};

function mapRowToTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    plannedFor: row.plannedFor,
    createdAt: row.createdAt,
    completedAt: row.completedAt,
    deletedAt: row.deletedAt,
    isDone: row.isDone === 1,
    categoryId: row.categoryId,
    categoryName: row.categoryName,
    categoryColor: row.categoryColor,
  };
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const db = await getDatabase();

  const now = getCurrentTimestamp();

  const todo: Todo = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: input.title.trim(),
    description: input.description?.trim() || null,
    plannedFor: input.plannedFor ?? getTodayDateKey(),
    createdAt: now,
    completedAt: null,
    deletedAt: null,
    isDone: false,
    categoryId: input.categoryId ?? null,
    categoryName: null,
    categoryColor: null,
  };

  await db.runAsync(
    `
    INSERT INTO todos (
      id,
      title,
      description,
      plannedFor,
      createdAt,
      completedAt,
      deletedAt,
      isDone,
      categoryId
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      todo.id,
      todo.title,
      todo.description,
      todo.plannedFor,
      todo.createdAt,
      todo.completedAt,
      todo.deletedAt,
      todo.isDone ? 1 : 0,
      todo.categoryId,
    ]
  );

  return todo;
}

export async function getTodosForDay(dateKey: string): Promise<Todo[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<TodoRow>(
    `
    SELECT
      t.id,
      t.title,
      t.description,
      t.plannedFor,
      t.createdAt,
      t.completedAt,
      t.deletedAt,
      t.isDone,
      t.categoryId,
      c.name AS categoryName,
      c.color AS categoryColor
    FROM todos t
    LEFT JOIN categories c
      ON c.id = t.categoryId
      AND c.deletedAt IS NULL
    WHERE t.plannedFor = ?
      AND t.deletedAt IS NULL
    ORDER BY t.isDone ASC, t.createdAt DESC;
    `,
    [dateKey]
  );

  return rows.map(mapRowToTodo);
}

export async function getAllActiveTodos(): Promise<Todo[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<TodoRow>(
    `
    SELECT
      t.id,
      t.title,
      t.description,
      t.plannedFor,
      t.createdAt,
      t.completedAt,
      t.deletedAt,
      t.isDone,
      t.categoryId,
      c.name AS categoryName,
      c.color AS categoryColor
    FROM todos t
    LEFT JOIN categories c
      ON c.id = t.categoryId
      AND c.deletedAt IS NULL
    WHERE t.deletedAt IS NULL
    ORDER BY t.plannedFor DESC, t.createdAt DESC;
    `
  );

  return rows.map(mapRowToTodo);
}

export async function toggleTodo(todo: Todo): Promise<void> {
  const db = await getDatabase();

  const nextIsDone = !todo.isDone;
  const completedAt = nextIsDone ? getCurrentTimestamp() : null;

  await db.runAsync(
    `
    UPDATE todos
    SET isDone = ?,
        completedAt = ?
    WHERE id = ?;
    `,
    [nextIsDone ? 1 : 0, completedAt, todo.id]
  );
}

export async function softDeleteTodo(id: string): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
    UPDATE todos
    SET deletedAt = ?
    WHERE id = ?;
    `,
    [getCurrentTimestamp(), id]
  );
}

export async function updateTodo(input: UpdateTodoInput): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
    UPDATE todos
    SET title = ?,
        description = ?,
        plannedFor = ?,
        categoryId = ?
    WHERE id = ?
      AND deletedAt IS NULL;
    `,
    [
      input.title.trim(),
      input.description?.trim() || null,
      input.plannedFor,
      input.categoryId ?? null,
      input.id,
    ]
  );
}