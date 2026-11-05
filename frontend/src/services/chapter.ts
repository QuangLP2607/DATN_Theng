import type { ApiResponse } from "@/interfaces/common";

import type { Chapter } from "@/interfaces/chapter";

import apiClient from "./apiClient";

/*
 * ==================== TYPES ====================
 */

export interface CreateChapterPayload {
  title: string;
  description?: string | null;
  position: number;
}

export interface UpdateChapterPayload {
  title?: string;
  description?: string | null;
  position?: number;
}

export interface GetChaptersResponse {
  chapters: Chapter[];
}

/*
 * ==================== API ====================
 */

const chapterApi = {
  async getChapters(subjectId: string): Promise<GetChaptersResponse> {
    const response = await apiClient.get<ApiResponse<GetChaptersResponse>>(
      `/subjects/${subjectId}/chapters`,
    );

    const data = response.data.data;

    if (!data || !Array.isArray(data.chapters)) {
      throw new Error("Dữ liệu danh sách chương không hợp lệ.");
    }

    return data;
  },

  async createChapter(
    subjectId: string,
    payload: CreateChapterPayload,
  ): Promise<Chapter> {
    const response = await apiClient.post<ApiResponse<Chapter>>(
      `/subjects/${subjectId}/chapters`,
      payload,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể tạo chương.");
    }

    return data;
  },

  async getChapterById(id: string): Promise<Chapter> {
    const response = await apiClient.get<ApiResponse<Chapter>>(
      `/chapters/${id}`,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không tìm thấy chương học.");
    }

    return data;
  },

  async updateChapter(
    id: string,
    payload: UpdateChapterPayload,
  ): Promise<Chapter> {
    const response = await apiClient.patch<ApiResponse<Chapter>>(
      `/chapters/${id}`,
      payload,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể cập nhật chương.");
    }

    return data;
  },
};

export default chapterApi;
