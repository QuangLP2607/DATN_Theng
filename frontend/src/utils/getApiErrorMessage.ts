import axios from "axios";

import type { ApiErrorResponse } from "@/interfaces/common";

interface ErrorOptions {
  fallback: string;
  conflict?: string;
}

export const getApiErrorMessage = (
  error: unknown,
  options: ErrorOptions,
): string => {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return options.fallback;
  }

  const { response } = error;

  if (!response) {
    return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
  }

  const { status, data } = response;
  const message =
    typeof data?.message === "string" && data.message.trim()
      ? data.message
      : undefined;

  switch (status) {
    case 401:
      return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";

    case 403:
      return "Bạn không có quyền thực hiện thao tác này.";

    case 404:
      return message ?? "Không tìm thấy dữ liệu.";

    case 409:
      return message ?? options.conflict ?? "Dữ liệu đã tồn tại.";

    default:
      if (status >= 500) {
        return "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
      }

      return message ?? options.fallback;
  }
};
