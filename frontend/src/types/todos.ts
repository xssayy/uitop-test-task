import type { Category } from "./categories";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  categoryId: number;
  createdAt: string;
  category: Category;
}

export interface CreateTodoDto {
  text: string;
  categoryId: number;
}

export interface UpdateTodosStatusBulkDto {
  ids: number[];
  completed: boolean;
}

export interface UpdateTodoDto {
  id: number;
  text?: string;
  completed?: boolean;
  deletedAt?: null;
}
