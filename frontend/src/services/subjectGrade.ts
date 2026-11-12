import type { ApiResponse } from "@/interfaces/common";

import type {
  SubjectGrade,
  SubjectGradeDetail,
} from "@/interfaces/subjectGrade";

import apiClient from "./apiClient";

/*
 * ==================== TYPES ====================
 */

export interface GetSubjectGradesParams {
  subjectId: string;
}

export interface GetSubjectGradesResponse {
  subjectGrades: SubjectGrade[];
}

/*
 * ==================== API ====================
 */

const subjectGradeApi = {
  async getSubjectGrades(
    params: GetSubjectGradesParams,
  ): Promise<GetSubjectGradesResponse> {
    const response = await apiClient.get<ApiResponse<GetSubjectGradesResponse>>(
      "/subject-grades",
      {
        params,
      },
    );

    const data = response.data.data;

    if (!data || !Array.isArray(data.subjectGrades)) {
      throw new Error("Dữ liệu danh sách khối lớp không hợp lệ.");
    }

    return data;
  },

  async getSubjectGradeById(id: string): Promise<SubjectGradeDetail> {
    const response = await apiClient.get<ApiResponse<SubjectGradeDetail>>(
      `/subject-grades/${id}`,
    );

    const data = response.data.data;

    if (!data) {
      throw new Error("Không tìm thấy khối lớp của môn học.");
    }

    return data;
  },
};

export default subjectGradeApi;
