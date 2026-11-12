import { useState } from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Select, { type SelectOption } from "@/components/Select";

import type { CourseListItem } from "@/services/course";
import type { ClassStatus } from "@/interfaces/class";

import styles from "./Toolbar.module.scss";

const cx = classNames.bind(styles);

export type ClassSortOption = "newest" | "oldest" | "nameAsc" | "nameDesc";

export type ClassStatusFilter = ClassStatus | "ALL";

interface ToolbarProps {
  search: string;
  sort: ClassSortOption;
  courseId: string;
  status: ClassStatusFilter;

  courses: CourseListItem[];
  courseLoading: boolean;

  onSearchChange: (value: string) => void;
  onSortChange: (value: ClassSortOption) => void;
  onCourseChange: (value: string) => void;
  onStatusChange: (value: ClassStatusFilter) => void;
  onClearFilters: () => void;
  onAddClass: () => void;
}

const sortOptions: SelectOption<ClassSortOption>[] = [
  { label: "Mới nhất", value: "newest" },
  { label: "Cũ nhất", value: "oldest" },
  { label: "Tên A - Z", value: "nameAsc" },
  { label: "Tên Z - A", value: "nameDesc" },
];

const statusOptions: SelectOption<ClassStatusFilter>[] = [
  { label: "Tất cả trạng thái", value: "ALL" },
  { label: "Đang hoạt động", value: "ACTIVE" },
  { label: "Ngừng hoạt động", value: "INACTIVE" },
];

export default function Toolbar({
  search,
  sort,
  courseId,
  status,
  courses,
  courseLoading,
  onSearchChange,
  onSortChange,
  onCourseChange,
  onStatusChange,
  onClearFilters,
  onAddClass,
}: ToolbarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const courseOptions: SelectOption<string>[] = [
    {
      label: "Tất cả khóa học",
      value: "",
    },
    ...courses.map((course) => ({
      label: `${course.title} (${course.code})`,
      value: course.id,
    })),
  ];

  const activeFilterCount = [courseId !== "", status !== "ALL"].filter(
    Boolean,
  ).length;

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
          placeholder="Tìm theo tên hoặc mã lớp..."
          aria-label="Tìm kiếm lớp học"
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
          aria-controls="class-filter-popover"
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
          <div className={cx("filter-popover")} id="class-filter-popover">
            <div className={cx("popover-header")}>
              <div className={cx("popover-title")}>
                <Icon icon="lucide:filter" aria-hidden="true" />
                <span>Bộ lọc lớp học</span>
              </div>

              <button
                className={cx("close-button")}
                type="button"
                aria-label="Đóng bộ lọc"
                onClick={() => setIsFilterOpen(false)}
              >
                <Icon icon="lucide:x" aria-hidden="true" />
              </button>
            </div>

            <div className={cx("popover-body")}>
              {/* COURSE */}
              <div className={cx("filter-field")}>
                <label>Khóa học</label>

                <Select<string>
                  options={courseOptions}
                  value={courseId}
                  onChange={onCourseChange}
                  ariaLabel="Lọc theo khóa học"
                  placeholder={
                    courseLoading ? "Đang tải khóa học..." : "Tất cả khóa học"
                  }
                  leadingIcon="lucide:book-open"
                  disabled={courseLoading}
                  fullWidth
                  menuClassName={cx("course-menu")}
                />
              </div>

              {/* STATUS */}
              <div className={cx("filter-field")}>
                <label>Trạng thái</label>

                <Select<ClassStatusFilter>
                  options={statusOptions}
                  value={status}
                  onChange={onStatusChange}
                  ariaLabel="Lọc theo trạng thái"
                  placeholder="Tất cả trạng thái"
                  leadingIcon="lucide:activity"
                  fullWidth
                />
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
        <Select<ClassSortOption>
          options={sortOptions}
          value={sort}
          onChange={onSortChange}
          ariaLabel="Sắp xếp lớp học"
          placeholder="Sắp xếp"
          leadingIcon="lucide:arrow-up-down"
          fullWidth
        />
      </div>

      {/* ADD CLASS */}
      <button className={cx("add-button")} type="button" onClick={onAddClass}>
        <Icon icon="lucide:plus" aria-hidden="true" />
        <span>Thêm lớp học</span>
      </button>
    </div>
  );
}
