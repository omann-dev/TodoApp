
export type Todo = {
    id: string;
    title: string;
    description: string | null;
    plannedFor: string;
    createdAt: string;
    completedAt: string | null;
    deletedAt: string | null;
    isDone: boolean;
};