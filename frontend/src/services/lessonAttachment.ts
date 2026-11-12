import type { ApiResponse } from "@/interfaces/common";

import type {
  LessonAttachment,
  LessonAttachmentType,
} from "@/interfaces/lessonAttachment";

import apiClient from "./apiClient";

/*
 * ==================== TYPES ====================
 */

export interface GetAttachmentsParams {
  type?: LessonAttachmentType;
}

export interface GetAttachmentsResponse {
  attachments: LessonAttachment[];
}

export interface CreateLinkAttachmentPayload {
  title: string;
  externalUrl: string;
}

export interface UpdateAttachmentPayload {
  title?: string;
  position?: number;
  externalUrl?: string;
}

/*
 * ==================== API ====================
 */

const lessonAttachmentApi = {
  // Get attachments by lesson
  async getAttachments(
    lessonId: string,
    params?: GetAttachmentsParams,
  ): Promise<LessonAttachment[]> {
    const response = await apiClient.get<ApiResponse<GetAttachmentsResponse>>(
      `/lessons/${lessonId}/attachments`,
      { params },
    );

    const data = response.data.data;

    if (!data || !Array.isArray(data.attachments)) {
      throw new Error("Dữ liệu danh sách tài liệu không hợp lệ.");
    }

    return data.attachments;
  },

  // Get attachment detail
  async getAttachmentById(id: string): Promise<LessonAttachment> {
    const response = await apiClient.get<ApiResponse<LessonAttachment>>(
      `/attachments/${id}`,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Dữ liệu tài liệu trả về không hợp lệ.");
    }

    return data;
  },

  // Upload file attachment
  async createFileAttachment(
    lessonId: string,
    file: File,
  ): Promise<LessonAttachment> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<ApiResponse<LessonAttachment>>(
      `/lessons/${lessonId}/attachments/file`,
      formData,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể tải tài liệu lên.");
    }

    return data;
  },

  // Create link attachment
  async createLinkAttachment(
    lessonId: string,
    payload: CreateLinkAttachmentPayload,
  ): Promise<LessonAttachment> {
    const response = await apiClient.post<ApiResponse<LessonAttachment>>(
      `/lessons/${lessonId}/attachments/link`,
      payload,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể tạo liên kết tài liệu.");
    }

    return data;
  },

  // Update attachment
  async updateAttachment(
    id: string,
    payload: UpdateAttachmentPayload,
  ): Promise<LessonAttachment> {
    const response = await apiClient.patch<ApiResponse<LessonAttachment>>(
      `/attachments/${id}`,
      payload,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể cập nhật tài liệu.");
    }

    return data;
  },

  // Replace attachment file
  async replaceAttachmentFile(
    id: string,
    file: File,
  ): Promise<LessonAttachment> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.put<ApiResponse<LessonAttachment>>(
      `/attachments/${id}/file`,
      formData,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể thay thế file tài liệu.");
    }

    return data;
  },

  // Delete attachment
  async deleteAttachment(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/attachments/${id}`);
  },
};

export default lessonAttachmentApi;
