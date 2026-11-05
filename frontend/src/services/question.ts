import type {
  ApiResponse,
  Pagination,
  PaginationParams,
  SortOrder,
} from "@/interfaces/common";

import type { Question, QuestionType } from "@/interfaces/question";

import apiClient from "./apiClient";

/*
 * ==================== TYPES ====================
 */

export type QuestionSortBy = "createdAt" | "updatedAt";

export interface QuestionOptionPayload {
  content: string;
  isCorrect?: boolean;
  position: number;
}

export interface GetQuestionsParams extends PaginationParams {
  type?: QuestionType;
  sortBy?: QuestionSortBy;
  sortOrder?: SortOrder;
}

export interface GetQuestionsResponse {
  questions: Question[];
  pagination: Pagination;
}

export interface CreateQuestionPayload {
  content: string;
  type: QuestionType;
  explanation?: string | null;
  options?: QuestionOptionPayload[];
}

export interface UpdateQuestionPayload {
  content?: string;
  type?: QuestionType;
  explanation?: string | null;
  options?: QuestionOptionPayload[];
}

/*
 * ==================== API ====================
 */

const questionApi = {
  async getQuestions(
    params?: GetQuestionsParams,
  ): Promise<GetQuestionsResponse> {
    const response = await apiClient.get<ApiResponse<GetQuestionsResponse>>(
      "/questions",
      { params },
    );

    const data = response.data.data;

    if (!data || !Array.isArray(data.questions) || !data.pagination) {
      throw new Error("Dữ liệu danh sách câu hỏi không hợp lệ.");
    }

    return data;
  },

  async getQuestionById(id: string): Promise<Question> {
    const response = await apiClient.get<ApiResponse<Question>>(
      `/questions/${id}`,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không tìm thấy câu hỏi.");
    }

    return data;
  },

  async createQuestion(payload: CreateQuestionPayload): Promise<Question> {
    const response = await apiClient.post<ApiResponse<Question>>(
      "/questions",
      payload,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể tạo câu hỏi.");
    }

    return data;
  },

  async updateQuestion(
    id: string,
    payload: UpdateQuestionPayload,
  ): Promise<Question> {
    const response = await apiClient.patch<ApiResponse<Question>>(
      `/questions/${id}`,
      payload,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không thể cập nhật câu hỏi.");
    }

    return data;
  },

  async deleteQuestion(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/questions/${id}`);
  },
};

export default questionApi;
