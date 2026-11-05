import { useState, type FormEvent } from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Modal from "@/components/Modal";
import subjectApi, { type SubjectListItem } from "@/services/subject";

import styles from "./AddModal.module.scss";

const cx = classNames.bind(styles);

const DEFAULT_ICON = "solar:book-2-linear";

interface AddModalProps {
  subject: SubjectListItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface SubjectFormData {
  code: string;
  title: string;
  description: string;
  icon: string;
}

const INITIAL_FORM: SubjectFormData = {
  code: "",
  title: "",
  description: "",
  icon: DEFAULT_ICON,
};

export default function AddModal({
  subject,
  onClose,
  onSuccess,
}: AddModalProps) {
  const isEditing = subject !== null;

  const [form, setForm] = useState<SubjectFormData>(() =>
    subject
      ? {
          code: subject.code,
          title: subject.title,
          description: subject.description ?? "",
          icon: subject.icon || DEFAULT_ICON,
        }
      : INITIAL_FORM,
  );

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof SubjectFormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "code" ? value.toUpperCase() : value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const code = form.code.trim().toUpperCase();
    const title = form.title.trim();
    const icon = form.icon.trim() || DEFAULT_ICON;

    if (!code) {
      setError("Vui lòng nhập mã môn học.");
      return;
    }

    if (!title) {
      setError("Vui lòng nhập tên môn học.");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      code,
      title,
      description: form.description.trim() || undefined,
      icon,
    };

    try {
      if (isEditing) {
        await subjectApi.updateSubject(subject.id, payload);
      } else {
        await subjectApi.createSubject(payload);
      }

      setSuccess(true);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isEditing
            ? "Không thể cập nhật môn học. Vui lòng thử lại."
            : "Không thể tạo môn học. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  const modalTitle = isEditing ? "Chỉnh sửa môn học" : "Thêm môn học";

  const modalDescription = isEditing
    ? "Cập nhật thông tin môn học."
    : "Nhập thông tin để tạo môn học mới.";

  const successTitle = isEditing
    ? "Cập nhật môn học thành công"
    : "Tạo môn học thành công";

  const successDescription = isEditing
    ? "Thông tin môn học đã được cập nhật."
    : "Môn học mới đã được thêm vào hệ thống.";

  return (
    <Modal
      title={modalTitle}
      description={modalDescription}
      onClose={onClose}
      loading={loading}
      success={success}
      successTitle={successTitle}
      successDescription={successDescription}
      successContent={
        <div className={cx("success-content")}>
          <div className={cx("success-icon")}>
            <Icon icon="lucide:check" />
          </div>

          <p>
            Môn học <strong>{form.title}</strong> ({form.code}) đã được
            {isEditing ? " cập nhật" : " tạo"} thành công.
          </p>

          <button
            type="button"
            className={cx("success-button")}
            onClick={onClose}
          >
            Hoàn tất
          </button>
        </div>
      }
    >
      <form className={cx("form")} onSubmit={handleSubmit}>
        <div className={cx("field")}>
          <label htmlFor="subject-code">
            Mã môn học <span>*</span>
          </label>

          <input
            id="subject-code"
            type="text"
            placeholder="Ví dụ: MATH101"
            value={form.code}
            onChange={(event) => handleChange("code", event.target.value)}
            maxLength={20}
            required
            autoFocus
            disabled={loading}
          />

          <span className={cx("hint")}>{form.code.length}/20 ký tự</span>
        </div>

        <div className={cx("field")}>
          <label htmlFor="subject-title">
            Tên môn học <span>*</span>
          </label>

          <input
            id="subject-title"
            type="text"
            placeholder="Ví dụ: Lập trình ReactJS cơ bản"
            value={form.title}
            onChange={(event) => handleChange("title", event.target.value)}
            maxLength={100}
            required
            disabled={loading}
          />

          <span className={cx("hint")}>{form.title.length}/100 ký tự</span>
        </div>

        <div className={cx("field")}>
          <label htmlFor="subject-icon">Biểu tượng</label>

          <div className={cx("icon-input")}>
            <input
              id="subject-icon"
              type="text"
              placeholder="solar:calculator-linear"
              value={form.icon}
              onChange={(event) => handleChange("icon", event.target.value)}
              maxLength={100}
              disabled={loading}
            />

            <div className={cx("icon-preview")}>
              <Icon
                icon={form.icon.trim() || DEFAULT_ICON}
                onError={() => undefined}
              />
            </div>
          </div>

          <div className={cx("icon-hint")}>
            <span>Nhập tên icon từ Iconify.</span>
            <a
              href="https://yesicon.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tra cứu icon
              <Icon icon="lucide:external-link" />
            </a>
          </div>
        </div>

        <div className={cx("field")}>
          <label htmlFor="subject-description">Mô tả</label>

          <textarea
            id="subject-description"
            placeholder="Nhập mô tả về môn học..."
            value={form.description}
            onChange={(event) =>
              handleChange("description", event.target.value)
            }
            maxLength={255}
            rows={4}
            disabled={loading}
          />

          <span className={cx("hint")}>
            {form.description.length}/255 ký tự
          </span>
        </div>

        {error && (
          <div className={cx("error")} role="alert">
            <Icon icon="lucide:alert-circle" />
            <span>{error}</span>
          </div>
        )}

        <div className={cx("actions")}>
          <button
            type="button"
            className={cx("cancel-button")}
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </button>

          <button
            type="submit"
            className={cx("submit-button")}
            disabled={loading}
          >
            {loading ? (
              <>
                <Icon
                  icon="lucide:loader-circle"
                  className={cx("loading-icon")}
                />
                {isEditing ? "Đang cập nhật..." : "Đang tạo..."}
              </>
            ) : (
              <>
                <Icon icon={isEditing ? "lucide:save" : "lucide:plus"} />
                {isEditing ? "Cập nhật" : "Tạo môn học"}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
