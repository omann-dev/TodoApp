import { useEffect, useState } from "react";
import { Todo } from "../types/todo";
import { runMigrations } from "../database/migrations";
import {
  createTodo,
  getAllActiveTodos,
  getTodosForDay,
  softDeleteTodo,
  toggleTodo as toggleTodoInDatabase,
} from "../database/todoRepository";
import { getTodayDateKey } from "../services/dateService";

export function useTodos() {
  const [todayTodos, setTodayTodos] = useState<Todo[]>([]);
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshTodos() {
    const today = getTodayDateKey();

    const [loadedTodayTodos, loadedAllTodos] = await Promise.all([
      getTodosForDay(today),
      getAllActiveTodos(),
    ]);

    setTodayTodos(loadedTodayTodos);
    setAllTodos(loadedAllTodos);
  }

  async function initializeTodos() {
    try {
      setIsLoading(true);
      await runMigrations();
      await refreshTodos();
    } finally {
      setIsLoading(false);
    }
  }

  async function addTodo(title: string) {
    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0) {
      return;
    }

    await createTodo(trimmedTitle);
    await refreshTodos();
  }

  async function toggleTodo(todo: Todo) {
    await toggleTodoInDatabase(todo);
    await refreshTodos();
  }

  async function deleteTodo(id: string) {
    await softDeleteTodo(id);
    await refreshTodos();
  }

  useEffect(() => {
    initializeTodos();
  }, []);

  const completedTodayTodos = todayTodos.filter((todo) => todo.isDone).length;
  const completedAllTodos = allTodos.filter((todo) => todo.isDone).length;

  return {
    todayTodos,
    allTodos,
    isLoading,
    completedTodayTodos,
    completedAllTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    refreshTodos,
  };
}

export type UseTodosResult = ReturnType<typeof useTodos>;