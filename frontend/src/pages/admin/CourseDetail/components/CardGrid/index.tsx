import classNames from "classnames/bind";
import { Icon } from "@iconify/react";

import type { CourseListItem } from "@/services/course";
import type { GradeLevel } from "@/interfaces/subjectGrade";

import CardGridLayout from "@/components/CardGrid";
import Dropdown from "@/components/Dropdown";

import styles from "./CardGrid.module.scss";

const cx = classNames.bind(styles);

const GRADE_LABELS: Record<GradeLevel, string> = {
  GRADE_10: "Khối 10",
  GRADE_11: "Khối 11",
  GRADE_12: "Khối 12",
};

interface CardGridProps {
  courses: CourseListItem[];
  onView: (course: CourseListItem) => void;
  onEdit: (course: CourseListItem) => void;
  onTogglePublish: (course: CourseListItem) => void;
}

interface CourseCardProps {
  course: CourseListItem;
  onView: (course: CourseListItem) => void;
  onEdit: (course: CourseListItem) => void;
  onTogglePublish: (course: CourseListItem) => void;
}

function getStatusLabel(status: CourseListItem["status"]) {
  switch (status) {
    case "PUBLISHED":
      return "Đã xuất bản";
    case "ARCHIVED":
      return "Đã lưu trữ";
    case "DRAFT":
    default:
      return "Bản nháp";
  }
}

function CourseCard({
  course,
  onView,
  onEdit,
  onTogglePublish,
}: CourseCardProps) {
  const isPublished = course.status === "PUBLISHED";

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onView(course);
    }
  };

  return (
    <article
      className={cx("course-card")}
      onClick={() => onView(course)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Xem chi tiết khóa học ${course.title}`}
    >
      <div className={cx("course-card__header")}>
        <div className={cx("course-card__icon")}>
          <Icon
            icon={course.subjectGrade.subject.icon || "solar:book-2-linear"}
          />
        </div>

        <div className={cx("course-card__info")}>
          <h3 className={cx("course-card__title")} title={course.title}>
            {course.title}
          </h3>

          <span className={cx("course-card__code")}>{course.code}</span>
        </div>

        <div className={cx("course-card__actions")}>
          <Dropdown
            align="end"
            offset={6}
            trigger={({ toggle, open }) => (
              <button
                type="button"
                className={cx("course-card__menu-trigger")}
                onClick={(event) => {
                  event.stopPropagation();
                  toggle();
                }}
                aria-label="Tùy chọn khóa học"
                aria-expanded={open}
              >
                <Icon icon="solar:menu-dots-bold" />
              </button>
            )}
          >
            {({ close }) => (
              <div
                className={cx("course-card__menu")}
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  className={cx("course-card__menu-item")}
                  onClick={() => {
                    close();
                    onEdit(course);
                  }}
                >
                  <Icon icon="solar:pen-linear" />
                  <span>Chỉnh sửa</span>
                </button>

                {course.status !== "ARCHIVED" && (
                  <button
                    type="button"
                    className={cx("course-card__menu-item")}
                    onClick={() => {
                      close();
                      onTogglePublish(course);
                    }}
                  >
                    <Icon
                      icon={
                        isPublished
                          ? "solar:eye-closed-linear"
                          : "solar:eye-linear"
                      }
                    />
                    <span>{isPublished ? "Gỡ xuất bản" : "Xuất bản"}</span>
                  </button>
                )}
              </div>
            )}
          </Dropdown>
        </div>
      </div>

      <p className={cx("course-card__description")}>
        {course.description || "Chưa có mô tả"}
      </p>

      <div className={cx("course-card__meta")}>
        <div className={cx("course-card__subject")}>
          <Icon icon="solar:book-bookmark-linear" />
          <span>{course.subjectGrade.subject.title}</span>
          <span className={cx("course-card__separator")}>·</span>
          <span>{GRADE_LABELS[course.subjectGrade.grade]}</span>
        </div>

        <div
          className={cx(
            "course-card__status",
            `course-card__status--${course.status.toLowerCase()}`,
          )}
        >
          <span className={cx("course-card__status-dot")} />
          {getStatusLabel(course.status)}
        </div>
      </div>

      <div className={cx("course-card__footer")}>
        <div className={cx("course-card__statistics")}>
          <span>
            <Icon icon="solar:document-text-linear" />
            {course._count.chapters} chương
          </span>

          <span>
            <Icon icon="solar:users-group-rounded-linear" />
            {course._count.classes} lớp
          </span>
        </div>

        <div className={cx("course-card__year")}>
          {course.targetYear ?? "Chưa đặt năm học"}
        </div>
      </div>

      <div className={cx("course-card__creator")}>
        <Icon icon="solar:user-circle-linear" />
        <span title={course.createdBy.name}>{course.createdBy.name}</span>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className={cx("empty")}>
      <Icon icon="solar:folder-open-linear" />
      <h3>Không tìm thấy khóa học</h3>
      <p>Thử thay đổi từ khóa hoặc bộ lọc nhé.</p>
    </div>
  );
}

export default function CardGrid({
  courses,
  onView,
  onEdit,
  onTogglePublish,
}: CardGridProps) {
  if (courses.length === 0) {
    return <EmptyState />;
  }

  return (
    <CardGridLayout>
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onView={onView}
          onEdit={onEdit}
          onTogglePublish={onTogglePublish}
        />
      ))}
    </CardGridLayout>
  );
}
