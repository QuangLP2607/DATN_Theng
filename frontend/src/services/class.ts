import type {
  ApiResponse,
  Pagination,
  PaginationParams,
  SortOrder,
} from "@/interfaces/common";

import type { Class, ClassStatus } from "@/interfaces/class";

import apiClient from "./apiClient";

/*
 * ==================== TYPES ====================
 */

export type ClassSortBy =
  | "name"
  | "code"
  | "startAt"
  | "createdAt"
  | "updatedAt";

export interface ClassCourse {
  id: string;
  title: string;
  code: string;
  status: string;
}

export interface ClassListItem extends Class {
  course: ClassCourse;
  _count: {
    teachers: number;
    enrollments: number;
  };
}

export type ClassDetail = ClassListItem;

export interface GetClassesParams extends PaginationParams {
  search?: string;
  courseId?: string;
  status?: ClassStatus;
  sortBy?: ClassSortBy;
  order?: SortOrder;
}

export interface GetClassesResponse {
  classes: ClassListItem[];
  pagination: Pagination;
}

export interface CreateClassInput {
  courseId: string;
  name: string;
  code: string;
  maxStudents?: number | null;
  startAt?: string | null;
  endAt?: string | null;
}

export type UpdateClassInput = Partial<CreateClassInput>;

/*
 * ==================== API ====================
 */

const classApi = {
  async getClasses(params?: GetClassesParams): Promise<GetClassesResponse> {
    const response = await apiClient.get<ApiResponse<GetClassesResponse>>(
      "/classes",
      { params },
    );

    const data = response.data.data;

    if (!data || !Array.isArray(data.classes) || !data.pagination) {
      throw new Error("Dữ liệu danh sách lớp học không hợp lệ.");
    }

    return data;
  },

  async getClassById(id: string): Promise<ClassDetail> {
    const response = await apiClient.get<ApiResponse<ClassDetail>>(
      `/classes/${id}`,
    );

    if (!response.data.data) {
      throw new Error("Dữ liệu lớp học trả về không hợp lệ.");
    }

    return response.data.data;
  },

  async createClass(data: CreateClassInput): Promise<Class> {
    const response = await apiClient.post<ApiResponse<Class>>("/classes", data);

    if (!response.data.data) {
      throw new Error("Dữ liệu lớp học trả về không hợp lệ.");
    }

    return response.data.data;
  },

  async updateClass(id: string, data: UpdateClassInput): Promise<Class> {
    const response = await apiClient.patch<ApiResponse<Class>>(
      `/classes/${id}`,
      data,
    );

    if (!response.data.data) {
      throw new Error("Dữ liệu lớp học trả về không hợp lệ.");
    }

    return response.data.data;
  },

  async deleteClass(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/classes/${id}`);
  },
};

export default classApi;
