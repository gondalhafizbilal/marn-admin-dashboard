import { API_ENDPOINTS } from "@/constants";

import { api } from "../api";
import { BaseRepository } from "./base.repository";

import type {
  Category,
  CategoryTreeNode,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/features/categories";

export type { Category, CategoryStatus, CategoryTreeNode } from "@/features/categories";
export type CreateCategoryPayload = CreateCategoryInput;
export type UpdateCategoryPayload = UpdateCategoryInput;

class CategoryRepositoryClass extends BaseRepository<
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload
> {
  constructor() {
    super(API_ENDPOINTS.CATEGORIES.ROOT);
  }

  override update(id: string, payload: UpdateCategoryPayload) {
    return api.put<Category, UpdateCategoryPayload>(API_ENDPOINTS.CATEGORIES.BY_ID(id), payload);
  }

  findTree() {
    return api.get<CategoryTreeNode[]>(API_ENDPOINTS.CATEGORIES.ROOT);
  }

  activate(id: string) {
    return api.put<Category, UpdateCategoryPayload>(API_ENDPOINTS.CATEGORIES.BY_ID(id), {
      status: "active",
    });
  }

  archive(id: string) {
    return api.put<Category, UpdateCategoryPayload>(API_ENDPOINTS.CATEGORIES.BY_ID(id), {
      status: "archived",
    });
  }

  reorder(orderedUuids: string[], parentUuid?: string | null) {
    return api.post<CategoryTreeNode[]>(API_ENDPOINTS.CATEGORIES.REORDER, {
      orderedUuids,
      parentUuid,
    });
  }
}

export const CategoryRepository = new CategoryRepositoryClass();
