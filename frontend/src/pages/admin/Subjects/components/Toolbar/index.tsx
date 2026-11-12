import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Select, { type SelectOption } from "@/components/Select";

import styles from "./Toolbar.module.scss";

const cx = classNames.bind(styles);

export type SubjectSortOption = "newest" | "oldest" | "nameAsc" | "nameDesc";

interface ToolbarProps {
  search: string;
  sort: SubjectSortOption;

  onSearchChange: (value: string) => void;
  onSortChange: (value: SubjectSortOption) => void;
  onAddSubject: () => void;
}

const sortOptions: SelectOption<SubjectSortOption>[] = [
  { label: "Mới nhất", value: "newest" },
  { label: "Cũ nhất", value: "oldest" },
  { label: "Tên A - Z", value: "nameAsc" },
  { label: "Tên Z - A", value: "nameDesc" },
];

export default function Toolbar({
  search,
  sort,
  onSearchChange,
  onSortChange,
  onAddSubject,
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
          placeholder="Tìm theo mã hoặc tên môn học..."
          aria-label="Tìm kiếm môn học"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className={cx("filter")}>
        <Select<SubjectSortOption>
          options={sortOptions}
          value={sort}
          onChange={onSortChange}
          ariaLabel="Sắp xếp môn học"
          placeholder="Sắp xếp"
          leadingIcon="lucide:arrow-up-down"
          fullWidth
        />
      </div>

      <div className={cx("actions")}>
        <button
          className={cx("add-button")}
          type="button"
          onClick={onAddSubject}
        >
          <Icon icon="lucide:plus" aria-hidden="true" />
          <span>Thêm môn học</span>
        </button>
      </div>
    </div>
  );
}
