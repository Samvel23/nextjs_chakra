export const SortDirection = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type TSortDirection = (typeof SortDirection)[keyof typeof SortDirection];

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