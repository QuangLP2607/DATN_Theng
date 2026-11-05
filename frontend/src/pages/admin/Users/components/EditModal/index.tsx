import { useId, useState, type FormEvent } from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Modal from "@/components/Modal";

import type { UserListItem } from "@/services/users";
import userApi from "@/services/users";

import styles from "./EditModal.module.scss";

const cx = classNames.bind(styles);

interface EditModalProps {
  user: UserListItem;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditModal({
  user,
  onClose,
  onSuccess,
}: EditModalProps) {
  const id = useId();
  const nameId = `${id}-name`;

  const [name, setName] = useState(user.name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Vui lòng nhập họ và tên.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await userApi.updateUser(user.id, {
        name: trimmedName,
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không thể cập nhật thông tin người dùng.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa người dùng"
      description="Cập nhật thông tin người dùng."
      onClose={onClose}
      loading={loading}
    >
      <form className={cx("form")} onSubmit={handleSubmit}>
        <div className={cx("field")}>
          <label htmlFor={nameId}>Họ và tên</label>

          <input
            id={nameId}
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError("");
            }}
            placeholder="Nhập họ và tên"
            maxLength={100}
            autoFocus
            disabled={loading}
            required
          />

          <span className={cx("hint")}>{name.length}/100 ký tự</span>
        </div>

        <div className={cx("field")}>
          <label>Email</label>
          <input type="email" value={user.email} disabled readOnly />
        </div>

        <div className={cx("field")}>
          <label>Vai trò</label>
          <input
            type="text"
            value={
              user.role === "STUDENT"
                ? "Học sinh"
                : user.role === "TEACHER"
                  ? "Giáo viên"
                  : "Quản trị viên"
            }
            disabled
            readOnly
          />
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
            disabled={loading || name.trim() === user.name}
          >
            {loading ? (
              <>
                <Icon
                  icon="lucide:loader-circle"
                  className={cx("loading-icon")}
                />
                Đang lưu...
              </>
            ) : (
              <>
                <Icon icon="lucide:save" />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
