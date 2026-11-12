import type {
  ApiResponse,
  Pagination,
  PaginationParams,
  SortOrder,
} from "@/interfaces/common";

import type { Subject } from "@/interfaces/subject";

import apiClient from "./apiClient";

/*
 * ==================== TYPES ====================
 */

export type SubjectSortBy = "code" | "title" | "createdAt" | "updatedAt";

export interface GetSubjectsParams extends PaginationParams {
  search?: string;
  sortBy?: SubjectSortBy;
  sortOrder?: SortOrder;
}

export interface GetSubjectsResponse {
  subjects: Subject[];
  pagination: Pagination;
}

export interface CreateSubjectPayload {
  code: string;
  title: string;
  description?: string | null;
  icon?: string;
}

export interface UpdateSubjectPayload {
  code?: string;
  title?: string;
  description?: string | null;
  icon?: string;
}

/*
 * ==================== API ====================
 */

const subjectApi = {
  async getSubjects(params?: GetSubjectsParams): Promise<GetSubjectsResponse> {
    const response = await apiClient.get<ApiResponse<GetSubjectsResponse>>(
      "/subjects",
      { params },
    );

    const data = response.data.data;

    if (!data || !Array.isArray(data.subjects) || !data.pagination) {
      throw new Error("Dữ liệu danh sách môn học không hợp lệ.");
    }

    return data;
  },

  async getSubjectById(id: string): Promise<Subject> {
    const response = await apiClient.get<ApiResponse<Subject>>(
      `/subjects/${id}`,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không tìm thấy môn học.");
    }

    return data;
  },

  async createSubject(payload: CreateSubjectPayload): Promise<Subject> {
    const response = await apiClient.post<ApiResponse<Subject>>(
      "/subjects",
      payload,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể tạo môn học.");
    }

    return data;
  },

  async updateSubject(
    id: string,
    payload: UpdateSubjectPayload,
  ): Promise<Subject> {
    const response = await apiClient.patch<ApiResponse<Subject>>(
      `/subjects/${id}`,
      payload,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể cập nhật môn học.");
    }

    return data;
  },
};

export default subjectApi;
