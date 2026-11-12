import type { ApiResponse } from "@/interfaces/common";

import type {
  Chapter,
  ChapterDetail,
  ChapterListItem,
} from "@/interfaces/chapter";

import type { ContentStatus } from "@/interfaces/lesson";

import apiClient from "./apiClient";

/*
 * ==================== TYPES ====================
 */

export interface GetChaptersParams {
  status?: ContentStatus;
}

export interface GetChaptersResponse {
  chapters: ChapterListItem[];
}

export interface CreateChapterPayload {
  title: string;
  description?: string | null;
  position: number;
}

export interface UpdateChapterPayload {
  title?: string;
  description?: string | null;
  position?: number;
  status?: ContentStatus;
}

/*
 * ==================== API ====================
 */

const chapterApi = {
  // Get chapters by course
  async getChapters(
    courseId: string,
    params?: GetChaptersParams,
  ): Promise<ChapterListItem[]> {
    const response = await apiClient.get<ApiResponse<GetChaptersResponse>>(
      `/courses/${courseId}/chapters`,
      { params },
    );

    const data = response.data.data;

    if (!data || !Array.isArray(data.chapters)) {
      throw new Error("Dữ liệu danh sách chương không hợp lệ.");
    }

    return data.chapters;
  },

  // Get chapter detail
  async getChapterById(id: string): Promise<ChapterDetail> {
    const response = await apiClient.get<ApiResponse<ChapterDetail>>(
      `/chapters/${id}`,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Dữ liệu chương trả về không hợp lệ.");
    }

    return data;
  },

  // Create chapter
  async createChapter(
    courseId: string,
    payload: CreateChapterPayload,
  ): Promise<Chapter> {
    const response = await apiClient.post<ApiResponse<Chapter>>(
      `/courses/${courseId}/chapters`,
      payload,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể tạo chương.");
    }

    return data;
  },

  // Update chapter
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

  // Delete chapter
  async deleteChapter(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/chapters/${id}`);
  },
};

export default chapterApi;
