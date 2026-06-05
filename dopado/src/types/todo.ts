export type Todo = {
  id: string;
  title: string;
  description: string | null;
  plannedFor: string;
  createdAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  isDone: boolean;

  categoryId: string | null;
  categoryName: string | null;
  categoryColor: string | null;
};

export type CreateTodoInput = {
  title: string;
  description?: string | null;
  plannedFor?: string;
  categoryId?: string | null;
};

export type UpdateTodoInput = {
  id: string;
  title: string;
  description?: string | null;
  plannedFor: string;
  categoryId?: string | null;
};