export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  time: string;
  data?: T;
}
