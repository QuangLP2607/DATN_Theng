import type {
  ApiResponse,
  Pagination,
  PaginationParams,
  SortOrder,
} from "@/interfaces/common";

import type { Class, ClassStatus } from "@/interfaces/class";
import type { Subject } from "@/interfaces/subject";
import type { User } from "@/interfaces/user";

import apiClient from "./apiClient";

/*
 * ==================== TYPES ====================
 */

export type ClassSortBy = "name" | "code" | "createdAt" | "updatedAt";

export interface ClassListItem extends Class {
  subject: Pick<Subject, "id" | "title" | "icon">;
  _count: {
    teachers: number;
    students: number;
    assignments: number;
    exams: number;
  };
}

export interface GetClassesParams extends PaginationParams {
  search?: string;
  subjectId?: string;
  status?: ClassStatus;
  sortBy?: ClassSortBy;
  sortOrder?: SortOrder;
}

export interface GetClassesResponse {
  classes: ClassListItem[];
  pagination: Pagination;
}

export interface CreateClassPayload {
  subjectId: string;
  name: string;
  code: string;
  status?: ClassStatus;
}

export interface UpdateClassPayload {
  subjectId?: string;
  name?: string;
  code?: string;
  status?: ClassStatus;
}

export interface AssignTeacherPayload {
  teacherId: string;
}

export interface EnrollStudentPayload {
  studentId: string;
}

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

  async getClassById(id: string): Promise<Class> {
    const response = await apiClient.get<ApiResponse<Class>>(`/classes/${id}`);

    const data = response.data.data;

    if (!data) {
      throw new Error("Không tìm thấy lớp học.");
    }

    return data;
  },

  async createClass(payload: CreateClassPayload): Promise<Class> {
    const response = await apiClient.post<ApiResponse<Class>>(
      "/classes",
      payload,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể tạo lớp học.");
    }

    return data;
  },

  async updateClass(id: string, payload: UpdateClassPayload): Promise<Class> {
    const response = await apiClient.patch<ApiResponse<Class>>(
      `/classes/${id}`,
      payload,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể cập nhật lớp học.");
    }

    return data;
  },

  async deleteClass(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/classes/${id}`);
  },

  async getClassTeachers(classId: string): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>(
      `/classes/${classId}/teachers`,
    );

    const data = response.data.data;

    if (!Array.isArray(data)) {
      throw new Error("Dữ liệu danh sách giáo viên không hợp lệ.");
    }

    return data;
  },

  async assignTeacher(
    classId: string,
    payload: AssignTeacherPayload,
  ): Promise<void> {
    await apiClient.post<ApiResponse<null>>(
      `/classes/${classId}/teachers`,
      payload,
    );
  },

  async removeTeacher(classId: string, teacherId: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(
      `/classes/${classId}/teachers/${teacherId}`,
    );
  },

  async getClassStudents(classId: string): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>(
      `/classes/${classId}/students`,
    );

    const data = response.data.data;

    if (!Array.isArray(data)) {
      throw new Error("Dữ liệu danh sách học sinh không hợp lệ.");
    }

    return data;
  },

  async enrollStudent(
    classId: string,
    payload: EnrollStudentPayload,
  ): Promise<void> {
    await apiClient.post<ApiResponse<null>>(
      `/classes/${classId}/students`,
      payload,
    );
  },

  async removeStudent(classId: string, studentId: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(
      `/classes/${classId}/students/${studentId}`,
    );
  },
};

export default classApi;
