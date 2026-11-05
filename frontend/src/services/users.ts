import type {
  ApiResponse,
  Pagination,
  PaginationParams,
  SortOrder,
} from "@/interfaces/common";

import type { User, Role, UserStatus } from "@/interfaces/user";

import apiClient from "./apiClient";

/*
 * ==================== TYPES ====================
 */

export type UserSortBy =
  | "name"
  | "email"
  | "role"
  | "status"
  | "createdAt"
  | "updatedAt";

export interface UserListItem extends User {
  classCount: number;
}

export interface GetUsersParams extends PaginationParams {
  search?: string;
  role?: Role;
  status?: UserStatus;
  sortBy?: UserSortBy;
  sortOrder?: SortOrder;
}

export interface GetUsersResponse {
  users: UserListItem[];
  pagination: Pagination;
}

export interface UpdateProfileInput {
  name?: string;
  avatar?: string | null;
}

export interface UpdateUserInput extends UpdateProfileInput {
  role?: Role;
  status?: UserStatus;
}

/*
 * ==================== API ====================
 */

const userApi = {
  // Get users
  async getUsers(params?: GetUsersParams): Promise<GetUsersResponse> {
    const response = await apiClient.get<ApiResponse<GetUsersResponse>>(
      "/users",
      { params },
    );

    const data = response.data.data;

    if (!data || !Array.isArray(data.users) || !data.pagination) {
      throw new Error("Dữ liệu danh sách người dùng không hợp lệ.");
    }

    return data;
  },

  // Get current user
  async updateMe(data: UpdateProfileInput): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>(
      "/users/me",
      data,
    );

    if (!response.data.data) {
      throw new Error("Dữ liệu người dùng trả về không hợp lệ.");
    }

    return response.data.data;
  },

  // Update user (Admin)
  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>(
      `/users/${id}`,
      data,
    );

    if (!response.data.data) {
      throw new Error("Dữ liệu người dùng trả về không hợp lệ.");
    }

    return response.data.data;
  },
};

export default userApi;
