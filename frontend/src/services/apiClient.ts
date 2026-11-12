import axios, { type InternalAxiosRequestConfig } from "axios";

interface RefreshTokenResponse {
  data: {
    accessToken: string;
  };
}

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ========================================
// AUTH FAILURE HANDLER
// ========================================

let onAuthFailure: (() => void) | null = null;

export const setAuthFailureHandler = (handler: () => void) => {
  onAuthFailure = handler;

  return () => {
    if (onAuthFailure === handler) {
      onAuthFailure = null;
    }
  };
};

// ========================================
// REFRESH TOKEN
// ========================================

// Dùng chung một Promise cho các request đồng thời.
let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<RefreshTokenResponse>(
        "/auth/refresh-token",
        {},
        {
          baseURL: API_URL,
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      .then(({ data }) => {
        const newAccessToken = data.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        return newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// ========================================
// REQUEST INTERCEPTOR
// ========================================

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // FormData cần để Axios tự thiết lập Content-Type
    // và tự thêm multipart boundary.
    if (config.data instanceof FormData) {
      config.headers.delete("Content-Type");
    }

    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// ========================================
// RESPONSE INTERCEPTOR
// ========================================

apiClient.interceptors.response.use(
  (response) => response,

  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;

    // Không refresh nếu không phải 401.
    // Không refresh nếu request đã retry.
    // Không refresh khi đăng nhập thất bại.
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.startsWith("/auth/login")
    ) {
      return Promise.reject(error);
    }

    // Đánh dấu request đã thực hiện retry.
    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // Gửi lại request ban đầu.
      return apiClient(originalRequest);
    } catch {
      // Refresh thất bại: đồng bộ trạng thái đăng xuất.
      onAuthFailure?.();

      // Giữ AxiosError ban đầu.
      return Promise.reject(error);
    }
  },
);

export default apiClient;
