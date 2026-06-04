import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { CreateTodoInput, Todo } from "../types/todo";
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

  const hasInitializedDatabase = useRef(false);

  const ensureDatabaseIsReady = useCallback(async () => {
    if (hasInitializedDatabase.current) {
      return;
    }

    await runMigrations();
    hasInitializedDatabase.current = true;
  }, []);

  const refreshTodos = useCallback(async () => {
    await ensureDatabaseIsReady();

    const today = getTodayDateKey();

    const [loadedTodayTodos, loadedAllTodos] = await Promise.all([
      getTodosForDay(today),
      getAllActiveTodos(),
    ]);

    setTodayTodos(loadedTodayTodos);
    setAllTodos(loadedAllTodos);
  }, [ensureDatabaseIsReady]);

  const initializeTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      await refreshTodos();
    } catch (error) {
      console.error("Fehler beim Laden der Todos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [refreshTodos]);

  async function addTodo(input: CreateTodoInput) {
    const trimmedTitle = input.title.trim();

    if (trimmedTitle.length === 0) {
      return;
    }

    await ensureDatabaseIsReady();

    await createTodo({
      ...input,
      title: trimmedTitle,
    });

    await refreshTodos();
  }

  async function toggleTodo(todo: Todo) {
    await ensureDatabaseIsReady();
    await toggleTodoInDatabase(todo);
    await refreshTodos();
  }

  async function deleteTodo(id: string) {
    await ensureDatabaseIsReady();
    await softDeleteTodo(id);
    await refreshTodos();
  }

  useEffect(() => {
    void initializeTodos();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        void refreshTodos();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [initializeTodos, refreshTodos]);

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