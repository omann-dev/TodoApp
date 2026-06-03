import { getDatabase } from "./database";
import { Todo } from "../types/todo";
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
  };
}

export async function createTodo(title: string, plannedFor?: string): Promise<Todo> {
  const db = await getDatabase();

  const now = getCurrentTimestamp();

  const todo: Todo = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title,
    description: null,
    plannedFor: plannedFor ?? getTodayDateKey(),
    createdAt: now,
    completedAt: null,
    deletedAt: null,
    isDone: false,
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
      isDone
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
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
    ]
  );

  return todo;
}

export async function getTodosForDay(dateKey: string): Promise<Todo[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<TodoRow>(
    `
    SELECT *
    FROM todos
    WHERE plannedFor = ?
      AND deletedAt IS NULL
    ORDER BY isDone ASC, createdAt DESC;
    `,
    [dateKey]
  );

  return rows.map(mapRowToTodo);
}

export async function getAllActiveTodos(): Promise<Todo[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<TodoRow>(
    `
    SELECT *
    FROM todos
    WHERE deletedAt IS NULL
    ORDER BY plannedFor DESC, createdAt DESC;
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