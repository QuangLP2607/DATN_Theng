import type { ApiResponse } from "@/interfaces/common";
import type { User, Role } from "@/interfaces/user";

import apiClient from "./apiClient";

/*
 * ==================== TYPES ====================
 */

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResponse {
  accessToken: string;
  user: User;
}

export interface CreateAccountPayload {
  email: string;
  name: string;
  role: Role;
}

export type CreateAccountResponse = User;

export interface ActivateAccountPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

/*
 * ==================== API ====================
 */

const authApi = {
  async signIn(payload: SignInPayload): Promise<SignInResponse> {
    const response = await apiClient.post<ApiResponse<SignInResponse>>(
      "/auth/sign-in",
      payload,
    );

    return response.data.data!;
  },

  async createAccount(
    payload: CreateAccountPayload,
  ): Promise<CreateAccountResponse> {
    const response = await apiClient.post<ApiResponse<CreateAccountResponse>>(
      "/auth/sign-up",
      payload,
    );

    return response.data.data!;
  },

  async activateAccount(payload: ActivateAccountPayload): Promise<void> {
    await apiClient.post<ApiResponse<null>>("/auth/activate-account", payload);
  },

  async logout(): Promise<void> {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
  },
};

export default authApi;
