export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  time: string;
  data?: T;
}

export interface ApiErrorResponse {
  code: number;
  success: false;
  message: string;
  time: string;
  details?: unknown;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type SortOrder = "asc" | "desc";
