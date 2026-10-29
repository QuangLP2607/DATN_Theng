import type {
  ApiResponse,
  Pagination,
  PaginationParams,
} from "@/interfaces/common";
import type { User, Role, UserStatus } from "@/interfaces/user";

import apiClient from "./apiClient";

export interface UserListItem extends User {
  classCount: number;
}

export interface GetUsersParams extends PaginationParams {
  search?: string;
  role?: Role;
  status?: UserStatus;
}

export interface GetUsersResponse {
  users: UserListItem[];
  pagination: Pagination;
}

const userApi = {
  async getUsers(params?: GetUsersParams): Promise<GetUsersResponse> {
    const response = await apiClient.get<ApiResponse<GetUsersResponse>>(
      "/users",
      { params },
    );

    const data = response.data.data;

    if (!data || !Array.isArray(data.users)) {
      throw new Error("Dữ liệu danh sách người dùng không hợp lệ.");
    }

    return data;
  },
};

export default userApi;
