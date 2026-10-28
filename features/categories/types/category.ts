export type CategoryStatus = "active" | "draft" | "inactive" | "archived";

export type CategoryTreeNode = {
  uuid: string;
  name: string;
  slug: string;
  description?: string | null;
  level: number;
  sortOrder: number;
  parentUuid?: string | null;
  status?: CategoryStatus;
  createdAt?: string;
  updatedAt?: string;
  children?: CategoryTreeNode[];
};

export type Category = CategoryTreeNode;

export type CreateCategoryInput = {
  name: string;
  slug?: string;
  description?: string | null;
  level?: number;
  sortOrder?: number;
  parentUuid?: string | null;
  status?: CategoryStatus;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;
