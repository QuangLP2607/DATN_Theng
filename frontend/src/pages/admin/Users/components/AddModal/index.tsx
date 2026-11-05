import { useId, useState, type FormEvent } from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Modal from "@/components/Modal";
import Select, { type SelectOption } from "@/components/Select";

import type { Role } from "@/interfaces/user";
import authApi from "@/services/auth";

import styles from "./AddModal.module.scss";

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
  const id = useId();

  const nameId = `${id}-name`;
  const emailId = `${id}-email`;
  const roleId = `${id}-role`;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("STUDENT");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

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
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không thể tạo tài khoản. Email có thể đã tồn tại hoặc bạn không có quyền thực hiện.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);

    if (error) setError("");
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (error) setError("");
  };

  const handleRoleChange = (value: Role) => {
    setRole(value);

    if (error) setError("");
  };

  return (
    <Modal
      title={success ? "Đã gửi email kích hoạt" : "Thêm người dùng"}
      description={
        success
          ? "Hướng dẫn kích hoạt đã được gửi đến địa chỉ email."
          : "Tạo tài khoản và gửi liên kết kích hoạt qua email."
      }
      onClose={onClose}
      loading={loading}
    >
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
            <label htmlFor={nameId}>Họ và tên</label>

            <input
              id={nameId}
              type="text"
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="Nhập họ và tên"
              maxLength={100}
              autoComplete="name"
              autoFocus
              required
              disabled={loading}
            />

            <span className={cx("hint")}>{name.length}/100 ký tự</span>
          </div>

          <div className={cx("field")}>
            <label htmlFor={emailId}>Email</label>

            <input
              id={emailId}
              type="email"
              value={email}
              onChange={(event) => handleEmailChange(event.target.value)}
              placeholder="example@email.com"
              maxLength={255}
              autoComplete="email"
              required
              disabled={loading}
            />

            <span className={cx("hint")}>{email.length}/255 ký tự</span>
          </div>

          <div className={cx("field")}>
            <label id={roleId}>Vai trò</label>

            <Select<Role>
              options={roleOptions}
              value={role}
              onChange={handleRoleChange}
              labelId={roleId}
              placeholder="Chọn vai trò"
              disabled={loading}
              fullWidth
            />
          </div>

          <div className={cx("email-note")}>
            <Icon icon="lucide:info" aria-hidden="true" />

            <span>
              Người dùng sẽ nhận được email chứa liên kết kích hoạt có thời hạn
              và tự thiết lập mật khẩu.
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
    </Modal>
  );
}
