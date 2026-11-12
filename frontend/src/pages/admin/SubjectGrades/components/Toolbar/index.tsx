import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Select, { type SelectOption } from "@/components/Select";

import styles from "./Toolbar.module.scss";

const cx = classNames.bind(styles);

export type CourseStatusFilter = "ALL" | "DRAFT" | "PUBLISHED" | "ARCHIVED";

interface ToolbarProps {
  search: string;
  status: CourseStatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: CourseStatusFilter) => void;
  onAddCourse: () => void;
}

const statusOptions: SelectOption<CourseStatusFilter>[] = [
  { label: "Tất cả trạng thái", value: "ALL" },
  { label: "Bản nháp", value: "DRAFT" },
  { label: "Đã xuất bản", value: "PUBLISHED" },
  { label: "Đã lưu trữ", value: "ARCHIVED" },
];

export default function Toolbar({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onAddCourse,
}: ToolbarProps) {
  return (
    <div className={cx("wrapper")}>
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

        {search && (
          <button
            className={cx("clear-search")}
            type="button"
            aria-label="Xóa tìm kiếm"
            onClick={() => onSearchChange("")}
          >
            <Icon icon="lucide:x-circle" />
          </button>
        )}
      </div>

      <div className={cx("status-filter")}>
        <Select<CourseStatusFilter>
          options={statusOptions}
          value={status}
          onChange={onStatusChange}
          ariaLabel="Lọc theo trạng thái"
          placeholder="Tất cả trạng thái"
          leadingIcon="lucide:filter"
          fullWidth
        />
      </div>

      <div className={cx("actions")}>
        <button
          className={cx("add-button")}
          type="button"
          onClick={onAddCourse}
        >
          <Icon icon="lucide:plus" />
          <span>Thêm khóa học</span>
        </button>
      </div>
    </div>
  );
}
