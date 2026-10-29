import { useState, type FormEvent } from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Select, { type SelectOption } from "@/components/Select";
import type { Role } from "@/interfaces/user";
import authApi from "@/services/auth";

import styles from "./AddUserModal.module.scss";

const cx = classNames.bind(styles);

interface AddUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const roleOptions: SelectOption<Role>[] = [
  { label: "Học sinh", value: "STUDENT" },
  { label: "Giáo viên", value: "TEACHER" },
  { label: "Quản trị viên", value: "ADMIN" },
];

export default function AddUserModal({
  onClose,
  onSuccess,
}: AddUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      setError("Vui lòng nhập đầy đủ họ tên và email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authApi.createAccount({
        name: trimmedName,
        email: trimmedEmail,
        role,
      });

      setSuccess(true);
      onSuccess();
    } catch {
      setError(
        "Không thể tạo tài khoản. Email có thể đã tồn tại hoặc bạn không có quyền thực hiện.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cx("overlay")}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <section
        className={cx("modal")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-user-title"
      >
        <div className={cx("header")}>
          <div>
            <h2 id="add-user-title">
              {success ? "Đã gửi email kích hoạt" : "Thêm người dùng"}
            </h2>

            <p>
              {success
                ? "Hướng dẫn kích hoạt đã được gửi đến địa chỉ email."
                : "Tạo tài khoản và gửi liên kết kích hoạt qua email."}
            </p>
          </div>

          <button
            className={cx("close-button")}
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            disabled={loading}
          >
            <Icon icon="lucide:x" aria-hidden="true" />
          </button>
        </div>

        {success ? (
          <div className={cx("success-content")} role="status">
            <Icon
              icon="lucide:mail-check"
              className={cx("success-icon")}
              aria-hidden="true"
            />

            <p>
              Tài khoản <strong>{email.trim()}</strong> đã được tạo. Người dùng
              cần mở email để kích hoạt và thiết lập mật khẩu.
            </p>

            <button
              className={cx("submit-button")}
              type="button"
              onClick={onClose}
            >
              Hoàn tất
            </button>
          </div>
        ) : (
          <form className={cx("form")} onSubmit={handleSubmit}>
            <div className={cx("field")}>
              <label htmlFor="user-name">Họ và tên</label>

              <input
                id="user-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nhập họ và tên"
                maxLength={100}
                autoComplete="name"
                autoFocus
                required
                disabled={loading}
              />
            </div>

            <div className={cx("field")}>
              <label htmlFor="user-email">Email</label>

              <input
                id="user-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@email.com"
                maxLength={255}
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>

            <div className={cx("field")}>
              <label id="user-role-label">Vai trò</label>

              <Select<Role>
                options={roleOptions}
                value={role}
                onChange={setRole}
                labelId="user-role-label"
                placeholder="Chọn vai trò"
                disabled={loading}
                fullWidth
              />
            </div>

            <div className={cx("email-note")}>
              <Icon icon="lucide:info" aria-hidden="true" />

              <span>
                Người dùng sẽ nhận được email chứa liên kết kích hoạt có thời
                hạn và tự thiết lập mật khẩu.
              </span>
            </div>

            {error && (
              <p className={cx("error")} role="alert">
                {error}
              </p>
            )}

            <div className={cx("footer")}>
              <button
                className={cx("cancel-button")}
                type="button"
                onClick={onClose}
                disabled={loading}
              >
                Hủy
              </button>

              <button
                className={cx("submit-button")}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Icon
                      className={cx("loading-icon")}
                      icon="lucide:loader-circle"
                      aria-hidden="true"
                    />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Icon icon="lucide:send" aria-hidden="true" />
                    Tạo và gửi email
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
