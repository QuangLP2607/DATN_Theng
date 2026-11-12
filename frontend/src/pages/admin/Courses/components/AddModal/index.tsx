import { useRef, useState, type FormEvent } from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Modal from "@/components/Modal";
import Select, { type SelectOption } from "@/components/Select";

import courseApi, { type CreateCourseInput } from "@/services/course";
import type { CourseListItem } from "@/services/course";
import type { Subject } from "@/interfaces/subject";
import type { GradeLevel } from "@/interfaces/subjectGrade";

import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

import styles from "./AddModal.module.scss";

const cx = classNames.bind(styles);

const GRADE_LABELS: Record<GradeLevel, string> = {
  GRADE_10: "Khối 10",
  GRADE_11: "Khối 11",
  GRADE_12: "Khối 12",
};

interface AddModalProps {
  course: CourseListItem | null;
  subjects: Subject[];
  onClose: () => void;
  onSuccess: () => void;
}

interface CourseFormData {
  subjectId: string;
  subjectGradeId: string;
  title: string;
  code: string;
  description: string;
  targetYear: string;
}

const INITIAL_FORM: CourseFormData = {
  subjectId: "",
  subjectGradeId: "",
  title: "",
  code: "",
  description: "",
  targetYear: "",
};

export default function AddModal({
  course,
  subjects,
  onClose,
  onSuccess,
}: AddModalProps) {
  const isEditing = course !== null;

  const submittingRef = useRef(false);

  const [form, setForm] = useState<CourseFormData>(() =>
    course
      ? {
          subjectId: course.subjectGrade.subject.id,
          subjectGradeId: course.subjectGradeId,
          title: course.title,
          code: course.code,
          description: course.description ?? "",
          targetYear: course.targetYear?.toString() ?? "",
        }
      : INITIAL_FORM,
  );

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const selectedSubject = subjects.find(
    (subject) => subject.id === form.subjectId,
  );

  const subjectOptions: SelectOption<string>[] = subjects.map((subject) => ({
    label: `${subject.title} (${subject.code})`,
    value: subject.id,
  }));

  const gradeOptions: SelectOption<string>[] =
    selectedSubject?.subjectGrades.map((subjectGrade) => ({
      label: GRADE_LABELS[subjectGrade.grade],
      value: subjectGrade.id,
    })) ?? [];

  /*
   * ==================== FORM CHANGE ====================
   */

  const handleChange = (field: keyof CourseFormData, value: string) => {
    setForm((previous) => {
      if (field === "subjectId") {
        return {
          ...previous,
          subjectId: value,
          subjectGradeId: "",
        };
      }

      return {
        ...previous,
        [field]: field === "code" ? value.toUpperCase() : value,
      };
    });

    if (error) {
      setError("");
    }
  };

  /*
   * ==================== FORM SUBMIT ====================
   */

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submittingRef.current) return;

    const subjectGradeId = form.subjectGradeId;
    const title = form.title.trim();
    const code = form.code.trim().toUpperCase();
    const description = form.description.trim();
    const targetYear = form.targetYear.trim();

    if (!subjectGradeId) {
      setError("Vui lòng chọn môn học và khối lớp.");
      return;
    }

    if (!title) {
      setError("Vui lòng nhập tên khóa học.");
      return;
    }

    if (!code) {
      setError("Vui lòng nhập mã khóa học.");
      return;
    }

    if (
      targetYear &&
      (!Number.isInteger(Number(targetYear)) ||
        Number(targetYear) < 1900 ||
        Number(targetYear) > 2100)
    ) {
      setError("Năm học phải nằm trong khoảng từ 1900 đến 2100.");
      return;
    }

    const payload: CreateCourseInput = {
      subjectGradeId,
      title,
      code,
      description: description || null,
      targetYear: targetYear ? Number(targetYear) : null,
    };

    submittingRef.current = true;
    setLoading(true);
    setError("");

    try {
      if (isEditing) {
        await courseApi.updateCourse(course.id, payload);
      } else {
        await courseApi.createCourse(payload);
      }

      setSuccess(true);
      onSuccess();
    } catch (err) {
      setError(
        getApiErrorMessage(err, {
          fallback: isEditing
            ? "Không thể cập nhật khóa học. Vui lòng thử lại."
            : "Không thể tạo khóa học. Vui lòng thử lại.",
        }),
      );
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  const modalTitle = isEditing ? "Chỉnh sửa khóa học" : "Thêm khóa học";

  const modalDescription = isEditing
    ? "Cập nhật thông tin khóa học."
    : "Nhập thông tin để tạo khóa học mới.";

  return (
    <Modal
      title={modalTitle}
      description={modalDescription}
      onClose={onClose}
      loading={loading}
      success={success}
      successTitle={
        isEditing ? "Cập nhật khóa học thành công" : "Tạo khóa học thành công"
      }
      successDescription={
        isEditing
          ? "Thông tin khóa học đã được cập nhật."
          : "Khóa học mới đã được thêm vào hệ thống."
      }
      successContent={
        <div className={cx("success-content")}>
          <div className={cx("success-icon")}>
            <Icon icon="lucide:check" />
          </div>

          <p>
            Khóa học <strong>{form.title}</strong> ({form.code}) đã được
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
        {/* SUBJECT */}
        <div className={cx("field")}>
          <label htmlFor="course-subject">
            Môn học <span>*</span>
          </label>

          <Select<string>
            options={subjectOptions}
            value={form.subjectId}
            onChange={(value) => handleChange("subjectId", value)}
            ariaLabel="Chọn môn học"
            placeholder="Chọn môn học"
            leadingIcon="lucide:book-open"
            fullWidth
            menuClassName={cx("subject-menu")}
          />
        </div>

        {/* GRADE */}
        <div className={cx("field")}>
          <label htmlFor="course-grade">
            Khối lớp <span>*</span>
          </label>

          <Select<string>
            options={gradeOptions}
            value={form.subjectGradeId}
            onChange={(value) => handleChange("subjectGradeId", value)}
            ariaLabel="Chọn khối lớp"
            placeholder={
              form.subjectId ? "Chọn khối lớp" : "Chọn môn học trước"
            }
            leadingIcon="lucide:graduation-cap"
            fullWidth
          />

          {form.subjectId && gradeOptions.length === 0 && (
            <span className={cx("hint")}>
              Môn học này chưa có khối lớp tương ứng.
            </span>
          )}
        </div>

        {/* CODE */}
        <div className={cx("field")}>
          <label htmlFor="course-code">
            Mã khóa học <span>*</span>
          </label>

          <input
            id="course-code"
            type="text"
            placeholder="Ví dụ: MATH10-2026"
            value={form.code}
            onChange={(event) => handleChange("code", event.target.value)}
            maxLength={50}
            required
            disabled={loading}
          />

          <span className={cx("hint")}>{form.code.length}/50 ký tự</span>
        </div>

        {/* TITLE */}
        <div className={cx("field")}>
          <label htmlFor="course-title">
            Tên khóa học <span>*</span>
          </label>

          <input
            id="course-title"
            type="text"
            placeholder="Nhập tên khóa học..."
            value={form.title}
            onChange={(event) => handleChange("title", event.target.value)}
            maxLength={255}
            required
            disabled={loading}
          />

          <span className={cx("hint")}>{form.title.length}/255 ký tự</span>
        </div>

        {/* YEAR */}
        <div className={cx("field")}>
          <label htmlFor="course-year">Năm học</label>

          <input
            id="course-year"
            type="number"
            min={1900}
            max={2100}
            placeholder="Ví dụ: 2026"
            value={form.targetYear}
            onChange={(event) => handleChange("targetYear", event.target.value)}
            disabled={loading}
          />
        </div>

        {/* DESCRIPTION */}
        <div className={cx("field")}>
          <label htmlFor="course-description">Mô tả</label>

          <textarea
            id="course-description"
            placeholder="Nhập mô tả về khóa học..."
            value={form.description}
            onChange={(event) =>
              handleChange("description", event.target.value)
            }
            rows={4}
            disabled={loading}
          />
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
                {isEditing ? "Cập nhật" : "Tạo khóa học"}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
