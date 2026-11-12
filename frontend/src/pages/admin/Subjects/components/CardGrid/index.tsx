import classNames from "classnames/bind";
import { Icon } from "@iconify/react";

import type { Subject } from "@/interfaces/subject";
import type { GradeLevel } from "@/interfaces/subjectGrade";

import CardGrid from "@/components/CardGrid";
import Dropdown from "@/components/Dropdown";

import styles from "./CardGrid.module.scss";

const cx = classNames.bind(styles);

const DEFAULT_ICON = "solar:book-2-linear";

const GRADE_LABELS: Record<GradeLevel, string> = {
  GRADE_10: "Khối 10",
  GRADE_11: "Khối 11",
  GRADE_12: "Khối 12",
};

const GRADE_ORDER: GradeLevel[] = ["GRADE_10", "GRADE_11", "GRADE_12"];

interface SubjectCardGridProps {
  subjects: Subject[];
  loading: boolean;
  onEdit: (subject: Subject) => void;
  onSelectGrade: (subjectGradeId: string) => void;
}

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onSelectGrade: (subjectGradeId: string) => void;
}

function SubjectCard({ subject, onEdit, onSelectGrade }: SubjectCardProps) {
  return (
    <article className={cx("subject-card")}>
      <div className={cx("subject-card__header")}>
        <div className={cx("subject-card__icon")}>
          <Icon icon={subject.icon || DEFAULT_ICON} />
        </div>

        <div className={cx("subject-card__info")}>
          <h3 className={cx("subject-card__title")} title={subject.title}>
            {subject.title}
          </h3>

          <span className={cx("subject-card__code")}>{subject.code}</span>
        </div>

        <div className={cx("subject-card__actions")}>
          <Dropdown
            align="end"
            offset={6}
            trigger={({ toggle, open }) => (
              <button
                type="button"
                className={cx("subject-card__menu-trigger")}
                onClick={toggle}
                aria-label="Tùy chọn môn học"
                aria-expanded={open}
              >
                <Icon icon="solar:menu-dots-bold" />
              </button>
            )}
          >
            {({ close }) => (
              <div className={cx("subject-card__menu")}>
                <button
                  type="button"
                  className={cx("subject-card__menu-item")}
                  onClick={() => {
                    close();
                    onEdit(subject);
                  }}
                >
                  <Icon icon="solar:pen-linear" />
                  <span>Chỉnh sửa</span>
                </button>
              </div>
            )}
          </Dropdown>
        </div>
      </div>

      <p className={cx("subject-card__description")}>
        {subject.description || "Chưa có mô tả"}
      </p>

      <div className={cx("subject-card__grades")}>
        <span className={cx("subject-card__grades-label")}>Khối lớp</span>

        <div className={cx("subject-card__grade-list")}>
          {GRADE_ORDER.map((grade) => {
            const subjectGrade = subject.subjectGrades.find(
              (item) => item.grade === grade,
            );

            if (!subjectGrade) {
              return (
                <div
                  key={grade}
                  className={cx(
                    "subject-card__grade",
                    "subject-card__grade--missing",
                  )}
                  aria-disabled="true"
                >
                  <span>{GRADE_LABELS[grade]}</span>
                  <Icon icon="solar:lock-keyhole-linear" />
                </div>
              );
            }

            return (
              <button
                key={subjectGrade.id}
                type="button"
                className={cx("subject-card__grade")}
                onClick={() => onSelectGrade(subjectGrade.id)}
                title={`Quản lý ${GRADE_LABELS[grade]}`}
              >
                <span>{GRADE_LABELS[grade]}</span>
                <Icon icon="solar:arrow-right-up-linear" />
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className={cx("subject-card", "subject-card--skeleton")}>
      <div className={cx("subject-card__header")}>
        <div className={cx("skeleton-icon")} />

        <div className={cx("skeleton-info")}>
          <div className={cx("skeleton-line", "skeleton-line--title")} />
          <div className={cx("skeleton-line", "skeleton-line--code")} />
        </div>

        <div className={cx("subject-card__actions")}>
          <div className={cx("subject-card__menu-trigger")}>
            <Icon icon="solar:menu-dots-bold" />
          </div>
        </div>
      </div>

      <div className={cx("skeleton-line", "skeleton-line--description")} />

      <div className={cx("skeleton-grades")}>
        <div className={cx("skeleton-line", "skeleton-line--grade-label")} />

        <div className={cx("skeleton-grade-list")}>
          {GRADE_ORDER.map((grade) => (
            <div key={grade} className={cx("skeleton-grade")} />
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className={cx("empty")}>
      <Icon icon="solar:book-open-linear" />
      <h3>Không tìm thấy môn học</h3>
      <p>Thử tìm kiếm với từ khóa khác nhé.</p>
    </div>
  );
}

export default function SubjectCardGrid({
  subjects,
  loading,
  onEdit,
  onSelectGrade,
}: SubjectCardGridProps) {
  if (loading) {
    return (
      <CardGrid>
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </CardGrid>
    );
  }

  if (subjects.length === 0) {
    return <EmptyState />;
  }

  return (
    <CardGrid>
      {subjects.map((subject) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          onEdit={onEdit}
          onSelectGrade={onSelectGrade}
        />
      ))}
    </CardGrid>
  );
}
