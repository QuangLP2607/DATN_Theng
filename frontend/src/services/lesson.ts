import type { ApiResponse } from "@/interfaces/common";

import type { Lesson, LessonType } from "@/interfaces/lesson";

import apiClient from "./apiClient";

/*
 * ==================== TYPES ====================
 */

export interface CreateLessonPayload {
  title: string;
  type: LessonType;
  content?: string | null;
  fileUrl?: string | null;
  duration?: number | null;
  position: number;
}

export interface UpdateLessonPayload {
  title?: string;
  type?: LessonType;
  content?: string | null;
  fileUrl?: string | null;
  duration?: number | null;
  position?: number;
}

export interface UpdateLessonProgressPayload {
  progress: number;
}

export interface UpdateLessonProgressResponse {
  progress: number;
}

/*
 * ==================== API ====================
 */

const lessonApi = {
  async getLessons(chapterId: string): Promise<Lesson[]> {
    const response = await apiClient.get<ApiResponse<Lesson[]>>(
      `/chapters/${chapterId}/lessons`,
    );

    const data = response.data.data;

    if (!data || !Array.isArray(data)) {
      throw new Error("Dữ liệu danh sách bài học không hợp lệ.");
    }

    return data;
  },

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

  async getLessonById(id: string): Promise<Lesson> {
    const response = await apiClient.get<ApiResponse<Lesson>>(`/lessons/${id}`);

    const data = response.data.data;

    if (!data) {
      throw new Error("Không tìm thấy bài học.");
    }

    return data;
  },

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

  async updateLessonProgress(
    id: string,
    payload: UpdateLessonProgressPayload,
  ): Promise<UpdateLessonProgressResponse> {
    const response = await apiClient.patch<
      ApiResponse<UpdateLessonProgressResponse>
    >(`/lessons/${id}/progress`, payload);

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể cập nhật tiến độ bài học.");
    }

    return data;
  },
};

export default lessonApi;
