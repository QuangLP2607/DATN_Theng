import apiClient from "@/services/apiClient";
import type { ApiResponse } from "@/interfaces/common";

export interface UserStats {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
}

const statsApi = {
  async getUserStats(): Promise<UserStats> {
    const response =
      await apiClient.get<ApiResponse<UserStats>>("/stats/users");

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể tải thống kê người dùng.");
    }

    return data;
  },
};

export default statsApi;
