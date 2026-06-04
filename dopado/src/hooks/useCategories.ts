import { useCallback, useEffect, useState } from "react";
import { Category } from "../types/category";
import { runMigrations } from "../database/migrations";
import {
  createCategory,
  getActiveCategories,
} from "../database/categoryRepository";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const refreshCategories = useCallback(async () => {
    await runMigrations();

    const loadedCategories = await getActiveCategories();
    setCategories(loadedCategories);
  }, []);

  async function addCategory(name: string, color: string): Promise<Category | null> {
    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      return null;
    }

    await runMigrations();

    const category = await createCategory(trimmedName, color);
    await refreshCategories();

    return category;
  }

  useEffect(() => {
    async function initializeCategories() {
      try {
        setIsLoadingCategories(true);
        await refreshCategories();
      } finally {
        setIsLoadingCategories(false);
      }
    }

    void initializeCategories();
  }, [refreshCategories]);

  return {
    categories,
    isLoadingCategories,
    addCategory,
    refreshCategories,
  };
}