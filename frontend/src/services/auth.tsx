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

export interface SignUpPayload {
  email: string;
  password: string;
  name: string;
  role: Role;
}

export type SignUpResponse = User;

/*
 * ==================== API ====================
 */

const authApi = {
  async signIn(payload: SignInPayload): Promise<SignInResponse> {
    const res = await apiClient.post<ApiResponse<SignInResponse>>(
      "/auth/sign-in",
      payload,
    );

    return res.data.data!;
  },

  async signUp(payload: SignUpPayload): Promise<SignUpResponse> {
    const res = await apiClient.post<ApiResponse<SignUpResponse>>(
      "/auth/sign-up",
      payload,
    );

    return res.data.data!;
  },

  async logout(): Promise<void> {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
  },
};

export default authApi;
