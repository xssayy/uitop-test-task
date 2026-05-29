import api from "./axios";
import type {
  CreateTodoDto,
  Todo,
  UpdateTodosStatusBulkDto,
  UpdateTodoDto,
} from "../types/todos";

export const createTodo = async (dto: CreateTodoDto): Promise<Todo> => {
  const response = await api.post("/todos", dto);
  return response.data;
};

export const getAllTodosByCategoryId = async (
  categoryId?: number,
): Promise<Todo[]> => {
  const response = await api.get<Todo[]>(
    `/todos${categoryId ? `?categoryId=${categoryId}` : ""}`,
  );
  return response.data;
};

export const updateTodosStatusBulk = async (
  dto: UpdateTodosStatusBulkDto,
): Promise<void> => {
  await api.patch<void>("/todos/bulk/status", dto);
};

export const updateTodo = async (dto: UpdateTodoDto): Promise<Todo> => {
  const { id, ...body } = dto;
  const response = await api.patch<Todo>(`/todos/${id}`, body);
  return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await api.delete(`/todos/${id}`);
};
