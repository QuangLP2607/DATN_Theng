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
  loading: boolean;
  onEdit: (course: CourseListItem) => void;
  onTogglePublish: (course: CourseListItem) => void;
  onOpen: (course: CourseListItem) => void;
}

interface CourseCardProps {
  course: CourseListItem;
  onEdit: (course: CourseListItem) => void;
  onTogglePublish: (course: CourseListItem) => void;
  onOpen: (course: CourseListItem) => void;
}

function getStatusLabel(status: CourseListItem["status"]): string {
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
  onEdit,
  onTogglePublish,
  onOpen,
}: CourseCardProps) {
  const isPublished = course.status === "PUBLISHED";

  return (
    <article className={cx("course-card")}>
      <div className={cx("course-card__header")}>
        <div className={cx("course-card__icon")}>
          <Icon
            icon={course.subjectGrade.subject.icon || "solar:book-2-linear"}
          />
        </div>

        <div className={cx("course-card__info")}>
          <button
            type="button"
            className={cx("course-card__title")}
            title={course.title}
            onClick={() => onOpen(course)}
          >
            {course.title}
          </button>

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
                onClick={toggle}
                aria-label="Tùy chọn khóa học"
                aria-expanded={open}
              >
                <Icon icon="solar:menu-dots-bold" />
              </button>
            )}
          >
            {({ close }) => (
              <div className={cx("course-card__menu")}>
                <button
                  type="button"
                  className={cx("course-card__menu-item")}
                  onClick={() => {
                    close();
                    onOpen(course);
                  }}
                >
                  <Icon icon="solar:folder-open-linear" />
                  <span>Quản lý nội dung</span>
                </button>

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

function SkeletonCard() {
  return (
    <div className={cx("course-card", "course-card--skeleton")}>
      <div className={cx("course-card__header")}>
        <div className={cx("skeleton-icon")} />

        <div className={cx("skeleton-info")}>
          <div className={cx("skeleton-line", "skeleton-line--title")} />
          <div className={cx("skeleton-line", "skeleton-line--code")} />
        </div>

        <div className={cx("course-card__actions")}>
          <div className={cx("course-card__menu-trigger")}>
            <Icon icon="solar:menu-dots-bold" />
          </div>
        </div>
      </div>

      <div className={cx("skeleton-line", "skeleton-line--description")} />

      <div className={cx("skeleton-line", "skeleton-line--meta")} />

      <div className={cx("skeleton-footer")}>
        <div className={cx("skeleton-line", "skeleton-line--statistics")} />
        <div className={cx("skeleton-line", "skeleton-line--year")} />
      </div>

      <div className={cx("skeleton-line", "skeleton-line--creator")} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className={cx("empty")}>
      <Icon icon="solar:book-open-linear" />
      <h3>Chưa có khóa học</h3>
      <p>Chưa có khóa học nào thuộc môn học và khối lớp này.</p>
    </div>
  );
}

export default function CardGrid({
  courses,
  loading,
  onEdit,
  onTogglePublish,
  onOpen,
}: CardGridProps) {
  if (loading) {
    return (
      <CardGridLayout>
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </CardGridLayout>
    );
  }

  if (courses.length === 0) {
    return <EmptyState />;
  }

  return (
    <CardGridLayout>
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onEdit={onEdit}
          onTogglePublish={onTogglePublish}
          onOpen={onOpen}
        />
      ))}
    </CardGridLayout>
  );
}
