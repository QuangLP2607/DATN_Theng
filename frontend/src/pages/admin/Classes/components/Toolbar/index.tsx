import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Select, { type SelectOption } from "@/components/Select";
import type { SubjectListItem } from "@/services/subject";
import type { ClassStatus } from "@/interfaces/class";

import styles from "./Toolbar.module.scss";

const cx = classNames.bind(styles);

export type ClassStatusFilter = ClassStatus | "ALL";

interface ToolbarProps {
  search: string;
  subjectId: string;
  status: ClassStatusFilter;
  subjects: SubjectListItem[];

  onSearchChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onStatusChange: (value: ClassStatusFilter) => void;
  onAddClass: () => void;
}

const statusFilters: SelectOption<ClassStatusFilter>[] = [
  { label: "Tất cả trạng thái", value: "ALL" },
  { label: "Đang hoạt động", value: "ACTIVE" },
  { label: "Ngừng hoạt động", value: "INACTIVE" },
];

export default function Toolbar({
  search,
  subjectId,
  status,
  subjects,
  onSearchChange,
  onSubjectChange,
  onStatusChange,
  onAddClass,
}: ToolbarProps) {
  const subjectFilters: SelectOption<string>[] = [
    { label: "Tất cả môn học", value: "ALL" },
    ...subjects.map((subject) => ({
      label: subject.title,
      value: subject.id,
    })),
  ];

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
          placeholder="Tìm theo tên hoặc mã lớp..."
          aria-label="Tìm kiếm lớp học"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className={cx("filter")}>
        <Select<string>
          options={subjectFilters}
          value={subjectId || "ALL"}
          onChange={(value) => onSubjectChange(value === "ALL" ? "" : value)}
          ariaLabel="Lọc theo môn học"
          placeholder="Tất cả môn học"
          leadingIcon="lucide:book-open"
          fullWidth
        />
      </div>

      <div className={cx("filter")}>
        <Select<ClassStatusFilter>
          options={statusFilters}
          value={status || "ALL"}
          onChange={onStatusChange}
          ariaLabel="Lọc theo trạng thái"
          placeholder="Tất cả trạng thái"
          leadingIcon="lucide:sliders-horizontal"
          fullWidth
        />
      </div>

      <div className={cx("actions")}>
        <button className={cx("add-button")} type="button" onClick={onAddClass}>
          <Icon icon="lucide:plus" aria-hidden="true" />
          <span>Thêm lớp học</span>
        </button>
      </div>
    </div>
  );
}
