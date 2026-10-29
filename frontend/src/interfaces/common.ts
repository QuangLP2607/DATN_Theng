export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  time: string;
  data?: T;
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
