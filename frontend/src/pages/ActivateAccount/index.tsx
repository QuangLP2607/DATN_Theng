import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import classNames from "classnames/bind";

import authApi from "@/services/auth";

import styles from "./ActivateAccount.module.scss";

const cx = classNames.bind(styles);

interface ActivateAccountPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

interface ApiErrorResponse {
  message?: string;
}

type ActivationStatus = "idle" | "success";

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = error.response;

    if (
      typeof response === "object" &&
      response !== null &&
      "data" in response
    ) {
      const data = response.data as ApiErrorResponse;

      if (typeof data.message === "string") {
        return data.message;
      }
    }
  }

  return "Không thể kích hoạt tài khoản. Vui lòng thử lại.";
};

function ActivateAccount() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<ActivationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting) return;

    if (!token) {
      setErrorMessage(
        "Liên kết kích hoạt không hợp lệ. Vui lòng kiểm tra lại email.",
      );
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");

      const payload: ActivateAccountPayload = {
        token,
        password,
        confirmPassword,
      };

      await authApi.activateAccount(payload);

      setStatus("success");
      setPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={cx("page")}>
      <section className={cx("card")}>
        <Link to="/login" className={cx("brand")}>
          EduLearning
        </Link>

        {status === "success" ? (
          <div className={cx("result")}>
            <div className={cx("statusIcon", "successIcon")}>
              <span aria-hidden="true">✓</span>
            </div>

            <h1>Kích hoạt thành công!</h1>

            <p>
              Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập bằng mật
              khẩu vừa tạo.
            </p>

            <Link to="/login" className={cx("submitButton", "linkButton")}>
              Đến trang đăng nhập
            </Link>
          </div>
        ) : (
          <>
            <div className={cx("statusIcon")}>
              <span aria-hidden="true">✉</span>
            </div>

            <h1>Kích hoạt tài khoản</h1>

            <p className={cx("description")}>
              Tạo mật khẩu để hoàn tất việc kích hoạt tài khoản EduLearning của
              bạn.
            </p>

            {!token && (
              <div className={cx("alert", "errorAlert")} role="alert">
                Liên kết không có mã kích hoạt. Vui lòng mở lại đường dẫn trong
                email.
              </div>
            )}

            <form onSubmit={handleSubmit} className={cx("form")}>
              <div className={cx("field")}>
                <label htmlFor="password">Mật khẩu mới</label>

                <div className={cx("passwordWrapper")}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Nhập mật khẩu mới"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={8}
                    required
                    disabled={submitting || !token}
                  />

                  <button
                    type="button"
                    className={cx("togglePassword")}
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>

                <span className={cx("hint")}>Mật khẩu tối thiểu 8 ký tự.</span>
              </div>

              <div className={cx("field")}>
                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>

                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  disabled={submitting || !token}
                />
              </div>

              {errorMessage && (
                <div className={cx("alert", "errorAlert")} role="alert">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className={cx("submitButton")}
                disabled={submitting || !token}
              >
                {submitting ? "Đang kích hoạt..." : "Kích hoạt tài khoản"}
              </button>
            </form>

            <div className={cx("footer")}>
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </div>
          </>
        )}
      </section>

      <p className={cx("copyright")}>
        © {new Date().getFullYear()} EduLearning
      </p>
    </main>
  );
}

export default ActivateAccount;
