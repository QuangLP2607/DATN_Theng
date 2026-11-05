import { useId, useState, type FormEvent } from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Modal from "@/components/Modal";
import SearchableSelect from "@/components/SearchableSelect";

import classApi, { type ClassListItem } from "@/services/class";
import type { SubjectListItem } from "@/services/subject";

import styles from "./AddModal.module.scss";

const cx = classNames.bind(styles);

interface AddModalProps {
  classItem: ClassListItem | null;
  subjects: SubjectListItem[];
  onClose: () => void;
  onSuccess: () => void;
}

interface ClassFormData {
  subjectId: string;
  name: string;
  code: string;
}

const INITIAL_FORM: ClassFormData = {
  subjectId: "",
  name: "",
  code: "",
};

export default function AddModal({
  classItem,
  subjects,
  onClose,
  onSuccess,
}: AddModalProps) {
  const id = useId();

  const nameId = `${id}-name`;
  const codeId = `${id}-code`;

  const isEditing = classItem !== null;

  const subjectOptions = subjects.map((subject) => ({
    label: subject.title,
    value: subject.id,
  }));

  const [form, setForm] = useState<ClassFormData>(() =>
    classItem
      ? {
          subjectId: classItem.subjectId,
          name: classItem.name,
          code: classItem.code,
        }
      : INITIAL_FORM,
  );

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof ClassFormData, value: string) => {
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

    if (loading) return;

    const subjectId = form.subjectId;
    const name = form.name.trim();
    const code = form.code.trim().toUpperCase();

    if (!subjectId) {
      setError("Vui lòng chọn môn học.");
      return;
    }

    if (!name) {
      setError("Vui lòng nhập tên lớp học.");
      return;
    }

    if (!code) {
      setError("Vui lòng nhập mã lớp.");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      subjectId,
      name,
      code,
    };

    try {
      if (isEditing) {
        await classApi.updateClass(classItem.id, payload);
      } else {
        await classApi.createClass(payload);
      }

      setSuccess(true);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isEditing
            ? "Không thể cập nhật lớp học. Vui lòng thử lại."
            : "Không thể tạo lớp học. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  const modalTitle = isEditing ? "Chỉnh sửa lớp học" : "Thêm lớp học";

  const modalDescription = isEditing
    ? "Cập nhật thông tin lớp học."
    : "Nhập thông tin để tạo lớp học mới.";

  const successTitle = isEditing
    ? "Cập nhật lớp học thành công"
    : "Tạo lớp học thành công";

  const successDescription = isEditing
    ? "Thông tin lớp học đã được cập nhật."
    : "Lớp học mới đã được thêm vào hệ thống.";

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
            Lớp học <strong>{form.name}</strong> ({form.code}) đã được
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
          <label>
            Môn học <span>*</span>
          </label>

          <SearchableSelect<string>
            options={subjectOptions}
            value={form.subjectId}
            onChange={(value) => handleChange("subjectId", value)}
            placeholder="Chọn môn học"
            searchPlaceholder="Nhập tên môn học..."
            emptyMessage="Không tìm thấy môn học."
            ariaLabel="Chọn môn học"
            leadingIcon="lucide:book-open"
            disabled={loading || subjects.length === 0}
            fullWidth
          />

          {subjects.length === 0 && (
            <p className={cx("hint")}>
              Chưa có môn học. Hãy tạo môn học trước khi tạo lớp.
            </p>
          )}
        </div>

        <div className={cx("field")}>
          <label htmlFor={nameId}>
            Tên lớp học <span>*</span>
          </label>

          <input
            id={nameId}
            type="text"
            placeholder="Ví dụ: Toán 11A1"
            value={form.name}
            onChange={(event) => handleChange("name", event.target.value)}
            maxLength={100}
            required
            autoFocus
            disabled={loading}
          />

          <span className={cx("hint")}>{form.name.length}/100 ký tự</span>
        </div>

        <div className={cx("field")}>
          <label htmlFor={codeId}>
            Mã lớp <span>*</span>
          </label>

          <input
            id={codeId}
            type="text"
            placeholder="Ví dụ: TOAN11A1"
            value={form.code}
            onChange={(event) => handleChange("code", event.target.value)}
            maxLength={50}
            required
            disabled={loading}
          />

          <span className={cx("hint")}>{form.code.length}/50 ký tự</span>
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
            disabled={loading || subjects.length === 0}
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
                {isEditing ? "Cập nhật" : "Tạo lớp học"}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
