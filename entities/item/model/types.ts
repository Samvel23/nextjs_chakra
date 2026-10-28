export const SortDirection = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type TSortDirection<
  T extends Record<string, string> = typeof SortDirection,
> = T[keyof T];

export interface IPaginationParams {
  page: number;
  limit: number;
}

export interface IApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface IBaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}
