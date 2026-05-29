import api from "./axios";

import type { Category } from "../types/categories";

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>("/categories");
  return response.data;
};
