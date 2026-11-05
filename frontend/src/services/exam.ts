import type {
  ApiResponse,
  Pagination,
  PaginationParams,
  SortOrder,
} from "@/interfaces/common";

import type { Exam, ExamQuestion, ExamStatus } from "@/interfaces/exam";

import apiClient from "./apiClient";

/*
 * ==================== TYPES ====================
 */

export type ExamSortBy = "createdAt" | "updatedAt" | "scheduledAt" | "title";

export interface GetExamsParams extends PaginationParams {
  classId?: string;
  status?: ExamStatus;
  sortBy?: ExamSortBy;
  sortOrder?: SortOrder;
}

export interface GetExamsResponse {
  exams: Exam[];
  pagination: Pagination;
}

export interface CreateExamPayload {
  classId: string;
  title: string;
  description?: string | null;
  durationMinutes: number;
  scheduledAt?: string | null;
  maxAttempts?: number;
}

export interface UpdateExamPayload {
  title?: string;
  description?: string | null;
  durationMinutes?: number;
  scheduledAt?: string | null;
  maxAttempts?: number;
}

export interface AddExamQuestionItem {
  questionId: string;
  points: number;
  position: number;
}

export interface AddExamQuestionsPayload {
  questions: AddExamQuestionItem[];
}

export interface UpdateExamQuestionPayload {
  points?: number;
  position?: number;
}

/*
 * ==================== API ====================
 */

const examApi = {
  async getExams(params?: GetExamsParams): Promise<GetExamsResponse> {
    const response = await apiClient.get<ApiResponse<GetExamsResponse>>(
      "/exams",
      { params },
    );

    const data = response.data.data;

    if (!data || !Array.isArray(data.exams) || !data.pagination) {
      throw new Error("Dữ liệu danh sách đề thi không hợp lệ.");
    }

    return data;
  },

  async createExam(payload: CreateExamPayload): Promise<Exam> {
    const response = await apiClient.post<ApiResponse<Exam>>("/exams", payload);

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể tạo đề thi.");
    }

    return data;
  },

  async getExamById(id: string): Promise<Exam> {
    const response = await apiClient.get<ApiResponse<Exam>>(`/exams/${id}`);

    const data = response.data.data;

    if (!data) {
      throw new Error("Không tìm thấy đề thi.");
    }

    return data;
  },

  async updateExam(id: string, payload: UpdateExamPayload): Promise<Exam> {
    const response = await apiClient.patch<ApiResponse<Exam>>(
      `/exams/${id}`,
      payload,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể cập nhật đề thi.");
    }

    return data;
  },

  async deleteExam(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/exams/${id}`);
  },

  async addExamQuestions(
    id: string,
    payload: AddExamQuestionsPayload,
  ): Promise<ExamQuestion[]> {
    const response = await apiClient.post<ApiResponse<ExamQuestion[]>>(
      `/exams/${id}/questions`,
      payload,
    );

    const data = response.data.data;

    if (!data || !Array.isArray(data)) {
      throw new Error("Không thể thêm câu hỏi vào đề thi.");
    }

    return data;
  },

  async updateExamQuestion(
    examId: string,
    questionId: string,
    payload: UpdateExamQuestionPayload,
  ): Promise<ExamQuestion> {
    const response = await apiClient.patch<ApiResponse<ExamQuestion>>(
      `/exams/${examId}/questions/${questionId}`,
      payload,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể cập nhật câu hỏi trong đề thi.");
    }

    return data;
  },

  async removeExamQuestion(examId: string, questionId: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(
      `/exams/${examId}/questions/${questionId}`,
    );
  },

  async publishExam(id: string): Promise<Exam> {
    const response = await apiClient.patch<ApiResponse<Exam>>(
      `/exams/${id}/publish`,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể xuất bản đề thi.");
    }

    return data;
  },

  async closeExam(id: string): Promise<Exam> {
    const response = await apiClient.patch<ApiResponse<Exam>>(
      `/exams/${id}/close`,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể đóng đề thi.");
    }

    return data;
  },
};

export default examApi;
