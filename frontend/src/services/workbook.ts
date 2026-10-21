import type { ApiResponse } from "@/interfaces/common";
import type { Workbook } from "@/interfaces/workbook";

import apiClient from "./apiClient";

export interface CreateWorkbookPayload {
  name: string;
}

export interface UpdateWorkbookPayload {
  name: string;
}

const workbookApi = {
  async getAll(): Promise<Workbook[]> {
    const res = await apiClient.get<ApiResponse<Workbook[]>>("/workbooks");

    return res.data.data!;
  },

  async getById(workbookId: string): Promise<Workbook> {
    const res = await apiClient.get<ApiResponse<Workbook>>(
      `/workbooks/${workbookId}`,
    );

    return res.data.data!;
  },

  async create(payload: CreateWorkbookPayload): Promise<Workbook> {
    const res = await apiClient.post<ApiResponse<Workbook>>(
      "/workbooks",
      payload,
    );

    return res.data.data!;
  },

  async update(
    workbookId: string,
    payload: UpdateWorkbookPayload,
  ): Promise<Workbook> {
    const res = await apiClient.patch<ApiResponse<Workbook>>(
      `/workbooks/${workbookId}`,
      payload,
    );

    return res.data.data!;
  },

  async delete(workbookId: string): Promise<void> {
    await apiClient.delete(`/workbooks/${workbookId}`);
  },
};

export default workbookApi;
