import { useState } from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Select, { type SelectOption } from "@/components/Select";

import type { Subject } from "@/interfaces/subject";
import type { GradeLevel } from "@/interfaces/subjectGrade";

import styles from "./Toolbar.module.scss";

const cx = classNames.bind(styles);

export type CourseSortOption = "newest" | "oldest" | "nameAsc" | "nameDesc";

export type CourseStatusFilter = "ALL" | "DRAFT" | "PUBLISHED" | "ARCHIVED";

interface ToolbarProps {
  search: string;
  sort: CourseSortOption;
  subjectGradeId: string;
  status: CourseStatusFilter;
  targetYear: string;

  subjects: Subject[];
  subjectLoading: boolean;

  onSearchChange: (value: string) => void;
  onSortChange: (value: CourseSortOption) => void;
  onSubjectGradeChange: (value: string) => void;
  onStatusChange: (value: CourseStatusFilter) => void;
  onTargetYearChange: (value: string) => void;
  onClearFilters: () => void;
  onAddCourse: () => void;
}

const GRADE_LABELS: Record<GradeLevel, string> = {
  GRADE_10: "Khối 10",
  GRADE_11: "Khối 11",
  GRADE_12: "Khối 12",
};

const sortOptions: SelectOption<CourseSortOption>[] = [
  { label: "Mới nhất", value: "newest" },
  { label: "Cũ nhất", value: "oldest" },
  { label: "Tên A - Z", value: "nameAsc" },
  { label: "Tên Z - A", value: "nameDesc" },
];

const statusOptions: SelectOption<CourseStatusFilter>[] = [
  { label: "Tất cả trạng thái", value: "ALL" },
  { label: "Bản nháp", value: "DRAFT" },
  { label: "Đã xuất bản", value: "PUBLISHED" },
  { label: "Đã lưu trữ", value: "ARCHIVED" },
];

export default function Toolbar({
  search,
  sort,
  subjectGradeId,
  status,
  targetYear,
  subjects,
  subjectLoading,
  onSearchChange,
  onSortChange,
  onSubjectGradeChange,
  onStatusChange,
  onTargetYearChange,
  onClearFilters,
  onAddCourse,
}: ToolbarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const subjectGradeOptions: SelectOption<string>[] = [
    {
      label: "Tất cả môn học / khối lớp",
      value: "",
    },
    ...subjects.flatMap((subject) =>
      subject.subjectGrades.map((subjectGrade) => ({
        label: `${subject.title} - ${GRADE_LABELS[subjectGrade.grade]}`,
        value: subjectGrade.id,
      })),
    ),
  ];

  const activeFilterCount = [
    subjectGradeId !== "",
    status !== "ALL",
    targetYear !== "",
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  const handleClearFilters = () => {
    onClearFilters();
  };

  return (
    <div className={cx("wrapper")}>
      {/* SEARCH */}
      <div className={cx("search-wrapper")}>
        <Icon
          className={cx("search-icon")}
          icon="lucide:search"
          aria-hidden="true"
        />

        <input
          className={cx("search")}
          type="search"
          placeholder="Tìm theo mã hoặc tên khóa học..."
          aria-label="Tìm kiếm khóa học"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      {/* FILTER */}
      <div className={cx("filter-container")}>
        <button
          className={cx("filter-button", {
            "filter-button-active": isFilterOpen || hasActiveFilters,
          })}
          type="button"
          aria-expanded={isFilterOpen}
          onClick={() => setIsFilterOpen((previous) => !previous)}
        >
          <Icon icon="lucide:sliders-horizontal" aria-hidden="true" />

          <span>Bộ lọc</span>

          {hasActiveFilters && (
            <span className={cx("filter-count")}>{activeFilterCount}</span>
          )}

          <Icon
            className={cx("filter-chevron", {
              "filter-chevron-open": isFilterOpen,
            })}
            icon="lucide:chevron-down"
            aria-hidden="true"
          />
        </button>

        {isFilterOpen && (
          <div className={cx("filter-popover")}>
            <div className={cx("popover-header")}>
              <div className={cx("popover-title")}>
                <Icon icon="lucide:filter" aria-hidden="true" />
                <span>Bộ lọc khóa học</span>
              </div>

              <button
                className={cx("close-button")}
                type="button"
                aria-label="Đóng bộ lọc"
                onClick={() => setIsFilterOpen(false)}
              >
                <Icon icon="lucide:x" />
              </button>
            </div>

            <div className={cx("popover-body")}>
              {/* SUBJECT / GRADE */}
              <div className={cx("filter-field")}>
                <label>Môn học và khối lớp</label>

                <Select<string>
                  options={subjectGradeOptions}
                  value={subjectGradeId}
                  onChange={onSubjectGradeChange}
                  ariaLabel="Lọc theo môn học và khối lớp"
                  placeholder={
                    subjectLoading
                      ? "Đang tải môn học..."
                      : "Tất cả môn học / khối"
                  }
                  leadingIcon="lucide:book-open"
                  fullWidth
                  menuClassName={cx("subject-grade-menu")}
                />
              </div>

              {/* STATUS */}
              <div className={cx("filter-field")}>
                <label>Trạng thái</label>

                <Select<CourseStatusFilter>
                  options={statusOptions}
                  value={status}
                  onChange={onStatusChange}
                  ariaLabel="Lọc theo trạng thái"
                  placeholder="Tất cả trạng thái"
                  leadingIcon="lucide:sliders-horizontal"
                  fullWidth
                />
              </div>

              {/* TARGET YEAR */}
              <div className={cx("filter-field")}>
                <label>Năm học</label>

                <div className={cx("year-filter")}>
                  <Icon icon="lucide:calendar-days" aria-hidden="true" />

                  <input
                    type="number"
                    min={1900}
                    max={2100}
                    placeholder="Nhập năm học"
                    aria-label="Lọc theo năm học"
                    value={targetYear}
                    onChange={(event) => onTargetYearChange(event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={cx("popover-footer")}>
              <button
                className={cx("clear-button")}
                type="button"
                onClick={handleClearFilters}
                disabled={!hasActiveFilters}
              >
                <Icon icon="lucide:filter-x" aria-hidden="true" />
                <span>Xóa bộ lọc</span>
              </button>

              <button
                className={cx("done-button")}
                type="button"
                onClick={() => setIsFilterOpen(false)}
              >
                Hoàn tất
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SORT */}
      <div className={cx("sort-wrapper")}>
        <Select<CourseSortOption>
          options={sortOptions}
          value={sort}
          onChange={onSortChange}
          ariaLabel="Sắp xếp khóa học"
          placeholder="Sắp xếp"
          leadingIcon="lucide:arrow-up-down"
          fullWidth
        />
      </div>

      {/* ADD COURSE */}
      <button className={cx("add-button")} type="button" onClick={onAddCourse}>
        <Icon icon="lucide:plus" aria-hidden="true" />
        <span>Thêm khóa học</span>
      </button>
    </div>
  );
}
