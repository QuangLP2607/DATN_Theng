import type { ApiResponse } from "@/interfaces/common";
import type { Sheet } from "@/interfaces/sheet";

import apiClient from "./apiClient";

export interface CreateSheetPayload {
  workbookId: string;
  name: string;
}

export interface UpdateSheetPayload {
  name: string;
}

const sheetApi = {
  async create(payload: CreateSheetPayload): Promise<Sheet> {
    const res = await apiClient.post<ApiResponse<Sheet>>("/sheets", payload);

    return res.data.data!;
  },

  async update(sheetId: string, payload: UpdateSheetPayload): Promise<Sheet> {
    const res = await apiClient.patch<ApiResponse<Sheet>>(
      `/sheets/${sheetId}`,
      payload,
    );

    return res.data.data!;
  },

  async delete(sheetId: string): Promise<void> {
    await apiClient.delete(`/sheets/${sheetId}`);
  },
};

export default sheetApi;
