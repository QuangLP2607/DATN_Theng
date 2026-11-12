import { useRef, useState, type FormEvent } from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Modal from "@/components/Modal";
import Select, { type SelectOption } from "@/components/Select";

import classApi, {
  type ClassListItem,
  type CreateClassInput,
} from "@/services/class";
import type { CourseListItem } from "@/services/course";

import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

import styles from "./ClassModal.module.scss";

const cx = classNames.bind(styles);

interface ClassModalProps {
  classItem: ClassListItem | null;
  courses: CourseListItem[];
  onClose: () => void;
  onSuccess: () => void;
}

interface ClassFormData {
  courseId: string;
  name: string;
  code: string;
  maxStudents: string;
  startAt: string;
  endAt: string;
}

const INITIAL_FORM: ClassFormData = {
  courseId: "",
  name: "",
  code: "",
  maxStudents: "",
  startAt: "",
  endAt: "",
};

function toDateTimeLocal(value: string | null): string {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const timezoneOffset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export default function ClassModal({
  classItem,
  courses,
  onClose,
  onSuccess,
}: ClassModalProps) {
  const isEditing = classItem !== null;

  const submittingRef = useRef(false);

  const [form, setForm] = useState<ClassFormData>(() =>
    classItem
      ? {
          courseId: classItem.courseId,
          name: classItem.name,
          code: classItem.code,
          maxStudents: classItem.maxStudents?.toString() ?? "",
          startAt: toDateTimeLocal(classItem.startAt),
          endAt: toDateTimeLocal(classItem.endAt),
        }
      : INITIAL_FORM,
  );

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const courseOptions: SelectOption<string>[] = courses.map((course) => ({
    label: `${course.title} (${course.code})`,
    value: course.id,
  }));

  const handleChange = (field: keyof ClassFormData, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: field === "code" ? value.toUpperCase() : value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submittingRef.current) return;

    const courseId = form.courseId;
    const name = form.name.trim();
    const code = form.code.trim().toUpperCase();
    const maxStudents = form.maxStudents.trim();

    if (!courseId) {
      setError("Vui lòng chọn khóa học.");
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

    if (
      maxStudents &&
      (!Number.isInteger(Number(maxStudents)) || Number(maxStudents) < 1)
    ) {
      setError("Sĩ số tối đa phải là số nguyên lớn hơn 0.");
      return;
    }

    if (form.startAt && form.endAt) {
      const startDate = new Date(form.startAt);
      const endDate = new Date(form.endAt);

      if (startDate >= endDate) {
        setError("Thời gian kết thúc phải sau thời gian bắt đầu.");
        return;
      }
    }

    const payload: CreateClassInput = {
      courseId,
      name,
      code,
      maxStudents: maxStudents ? Number(maxStudents) : null,
      startAt: form.startAt ? new Date(form.startAt).toISOString() : null,
      endAt: form.endAt ? new Date(form.endAt).toISOString() : null,
    };

    submittingRef.current = true;
    setLoading(true);
    setError("");

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
        getApiErrorMessage(err, {
          fallback: isEditing
            ? "Không thể cập nhật lớp học. Vui lòng thử lại."
            : "Không thể tạo lớp học. Vui lòng thử lại.",
        }),
      );
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  const modalTitle = isEditing ? "Chỉnh sửa lớp học" : "Thêm lớp học";

  const modalDescription = isEditing
    ? "Cập nhật thông tin lớp học."
    : "Nhập thông tin để tạo lớp học mới.";

  return (
    <Modal
      title={modalTitle}
      description={modalDescription}
      onClose={onClose}
      loading={loading}
      success={success}
      successTitle={
        isEditing ? "Cập nhật lớp học thành công" : "Tạo lớp học thành công"
      }
      successDescription={
        isEditing
          ? "Thông tin lớp học đã được cập nhật."
          : "Lớp học mới đã được thêm vào hệ thống."
      }
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
        {/* COURSE */}
        <div className={cx("field")}>
          <label>
            Khóa học <span>*</span>
          </label>

          <Select<string>
            options={courseOptions}
            value={form.courseId}
            onChange={(value) => handleChange("courseId", value)}
            ariaLabel="Chọn khóa học"
            placeholder={
              courses.length > 0 ? "Chọn khóa học" : "Chưa có khóa học"
            }
            leadingIcon="lucide:book-open"
            disabled={loading || courses.length === 0}
            fullWidth
            menuClassName={cx("course-menu")}
          />

          {courses.length === 0 && (
            <span className={cx("hint")}>
              Cần tạo khóa học trước khi thêm lớp học.
            </span>
          )}
        </div>

        {/* NAME */}
        <div className={cx("field")}>
          <label htmlFor="class-name">
            Tên lớp học <span>*</span>
          </label>

          <input
            id="class-name"
            type="text"
            placeholder="Ví dụ: Toán 10A1"
            value={form.name}
            onChange={(event) => handleChange("name", event.target.value)}
            maxLength={255}
            required
            disabled={loading}
          />

          <span className={cx("hint")}>{form.name.length}/255 ký tự</span>
        </div>

        {/* CODE */}
        <div className={cx("field")}>
          <label htmlFor="class-code">
            Mã lớp <span>*</span>
          </label>

          <input
            id="class-code"
            type="text"
            placeholder="Ví dụ: TOAN10A1"
            value={form.code}
            onChange={(event) => handleChange("code", event.target.value)}
            maxLength={50}
            required
            disabled={loading}
          />

          <span className={cx("hint")}>{form.code.length}/50 ký tự</span>
        </div>

        {/* MAX STUDENTS */}
        <div className={cx("field")}>
          <label htmlFor="class-capacity">Sĩ số tối đa</label>

          <input
            id="class-capacity"
            type="number"
            min={1}
            step={1}
            placeholder="Không giới hạn"
            value={form.maxStudents}
            onChange={(event) =>
              handleChange("maxStudents", event.target.value)
            }
            disabled={loading}
          />

          <span className={cx("hint")}>
            Để trống nếu lớp học không giới hạn số lượng học viên.
          </span>
        </div>

        {/* SCHEDULE */}
        <div className={cx("date-grid")}>
          <div className={cx("field")}>
            <label htmlFor="class-start">Ngày bắt đầu</label>

            <input
              id="class-start"
              type="datetime-local"
              value={form.startAt}
              onChange={(event) => handleChange("startAt", event.target.value)}
              disabled={loading}
            />
          </div>

          <div className={cx("field")}>
            <label htmlFor="class-end">Ngày kết thúc</label>

            <input
              id="class-end"
              type="datetime-local"
              value={form.endAt}
              onChange={(event) => handleChange("endAt", event.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        {/* ERROR */}
        <div
          className={cx("error-slot", {
            "error-slot--visible": Boolean(error),
          })}
          aria-live="polite"
          aria-atomic="true"
        >
          {error && (
            <div className={cx("error")} role="alert">
              <Icon icon="lucide:alert-circle" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* ACTIONS */}
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
            disabled={loading || courses.length === 0}
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
