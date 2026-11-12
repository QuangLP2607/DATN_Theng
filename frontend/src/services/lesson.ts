import type { ApiResponse } from "@/interfaces/common";

import type {
  Lesson,
  LessonDetail,
  LessonListItem,
  ContentStatus,
  LessonType,
} from "@/interfaces/lesson";

import apiClient from "./apiClient";

/*
 * ==================== TYPES ====================
 */

export interface GetLessonsParams {
  status?: ContentStatus;
}

export interface GetLessonsResponse {
  lessons: LessonListItem[];
}

export interface CreateLessonPayload {
  title: string;
  type: LessonType;
  content?: string | null;
  duration?: number | null;
  position: number;
}

export interface UpdateLessonPayload {
  title?: string;
  type?: LessonType;
  content?: string | null;
  duration?: number | null;
  position?: number;
  status?: ContentStatus;
}

/*
 * ==================== API ====================
 */

const lessonApi = {
  // Get lessons by chapter
  async getLessons(
    chapterId: string,
    params?: GetLessonsParams,
  ): Promise<LessonListItem[]> {
    const response = await apiClient.get<ApiResponse<GetLessonsResponse>>(
      `/chapters/${chapterId}/lessons`,
      { params },
    );

    const data = response.data.data;

    if (!data || !Array.isArray(data.lessons)) {
      throw new Error("Dữ liệu danh sách bài học không hợp lệ.");
    }

    return data.lessons;
  },

  // Get lesson detail
  async getLessonById(id: string): Promise<LessonDetail> {
    const response = await apiClient.get<ApiResponse<LessonDetail>>(
      `/lessons/${id}`,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Dữ liệu bài học trả về không hợp lệ.");
    }

    return data;
  },

  // Create lesson
  async createLesson(
    chapterId: string,
    payload: CreateLessonPayload,
  ): Promise<Lesson> {
    const response = await apiClient.post<ApiResponse<Lesson>>(
      `/chapters/${chapterId}/lessons`,
      payload,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể tạo bài học.");
    }

    return data;
  },

  // Update lesson
  async updateLesson(
    id: string,
    payload: UpdateLessonPayload,
  ): Promise<Lesson> {
    const response = await apiClient.patch<ApiResponse<Lesson>>(
      `/lessons/${id}`,
      payload,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể cập nhật bài học.");
    }

    return data;
  },

  // Delete lesson
  async deleteLesson(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/lessons/${id}`);
  },
};

export default lessonApi;
