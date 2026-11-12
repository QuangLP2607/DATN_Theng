import type {
  ApiResponse,
  Pagination,
  PaginationParams,
  SortOrder,
} from "@/interfaces/common";

import type {
  Course,
  CourseCreator,
  CourseStatus,
  CourseSubjectGrade,
} from "@/interfaces/course";

import apiClient from "./apiClient";

/*
 * ==================== TYPES ====================
 */

export type CourseSortBy =
  | "title"
  | "code"
  | "targetYear"
  | "createdAt"
  | "updatedAt";

export interface CourseListItem extends Course {
  subjectGrade: CourseSubjectGrade;
  createdBy: CourseCreator;
  _count: {
    chapters: number;
    classes: number;
  };
}

export type CourseDetail = CourseListItem;

export interface GetCoursesParams extends PaginationParams {
  search?: string;
  subjectGradeId?: string;
  status?: CourseStatus;
  targetYear?: number;
  sortBy?: CourseSortBy;
  order?: SortOrder;
}

export interface GetCoursesResponse {
  courses: CourseListItem[];
  pagination: Pagination;
}

export interface CreateCourseInput {
  subjectGradeId: string;
  title: string;
  code: string;
  description?: string | null;
  thumbnailKey?: string | null;
  targetYear?: number | null;
}

export interface UpdateCourseInput {
  subjectGradeId?: string;
  title?: string;
  code?: string;
  description?: string | null;
  thumbnailKey?: string | null;
  targetYear?: number | null;
}

/*
 * ==================== API ====================
 */

const courseApi = {
  // Get courses
  async getCourses(params?: GetCoursesParams): Promise<GetCoursesResponse> {
    const response = await apiClient.get<ApiResponse<GetCoursesResponse>>(
      "/courses",
      { params },
    );

    const data = response.data.data;

    if (!data || !Array.isArray(data.courses) || !data.pagination) {
      throw new Error("Dữ liệu danh sách khóa học không hợp lệ.");
    }

    return data;
  },

  // Get course detail
  async getCourseById(id: string): Promise<CourseDetail> {
    const response = await apiClient.get<ApiResponse<CourseDetail>>(
      `/courses/${id}`,
    );

    if (!response.data.data) {
      throw new Error("Dữ liệu khóa học trả về không hợp lệ.");
    }

    return response.data.data;
  },

  // Create course
  async createCourse(data: CreateCourseInput): Promise<Course> {
    const response = await apiClient.post<ApiResponse<Course>>(
      "/courses",
      data,
    );

    if (!response.data.data) {
      throw new Error("Dữ liệu khóa học trả về không hợp lệ.");
    }

    return response.data.data;
  },

  // Update course
  async updateCourse(id: string, data: UpdateCourseInput): Promise<Course> {
    const response = await apiClient.patch<ApiResponse<Course>>(
      `/courses/${id}`,
      data,
    );

    if (!response.data.data) {
      throw new Error("Dữ liệu khóa học trả về không hợp lệ.");
    }

    return response.data.data;
  },

  // Delete course
  async deleteCourse(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/courses/${id}`);
  },

  // Publish course
  async publishCourse(id: string): Promise<Course> {
    const response = await apiClient.post<ApiResponse<Course>>(
      `/courses/${id}/publish`,
    );

    if (!response.data.data) {
      throw new Error("Dữ liệu khóa học trả về không hợp lệ.");
    }

    return response.data.data;
  },

  // Unpublish course
  async unpublishCourse(id: string): Promise<Course> {
    const response = await apiClient.post<ApiResponse<Course>>(
      `/courses/${id}/unpublish`,
    );

    if (!response.data.data) {
      throw new Error("Dữ liệu khóa học trả về không hợp lệ.");
    }

    return response.data.data;
  },
};

export default courseApi;
