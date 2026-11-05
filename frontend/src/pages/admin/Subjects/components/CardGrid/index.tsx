import classNames from "classnames/bind";
import { Icon } from "@iconify/react";

import type { SubjectListItem } from "@/services/subject";
import CardGrid from "@/components/CardGrid";
import Dropdown from "@/components/Dropdown";

import styles from "./CardGrid.module.scss";

const cx = classNames.bind(styles);

const DEFAULT_ICON = "solar:book-2-linear";

interface SubjectCardGridProps {
  subjects: SubjectListItem[];
  loading: boolean;
  onEdit: (subject: SubjectListItem) => void;
}

interface SubjectCardProps {
  subject: SubjectListItem;
  onEdit: (subject: SubjectListItem) => void;
}

function SubjectCard({ subject, onEdit }: SubjectCardProps) {
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
      </div>

      <p className={cx("subject-card__description")}>
        {subject.description || "Chưa có mô tả"}
      </p>

      <div className={cx("subject-card__stats")}>
        <div className={cx("stat", "stat--chapters")}>
          <Icon icon="solar:library-linear" />
          <span>{subject._count.chapters} chương</span>
        </div>

        <div className={cx("stat", "stat--classes")}>
          <Icon icon="solar:buildings-2-linear" />
          <span>{subject._count.classes} lớp</span>
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
      </div>

      <div className={cx("skeleton-line", "skeleton-line--description")} />

      <div className={cx("subject-card__stats")}>
        <div className={cx("skeleton-badge")} />
        <div className={cx("skeleton-badge", "skeleton-badge--short")} />
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
        <SubjectCard key={subject.id} subject={subject} onEdit={onEdit} />
      ))}
    </CardGrid>
  );
}
