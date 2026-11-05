import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./Toolbar.module.scss";

const cx = classNames.bind(styles);

interface ToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddSubject: () => void;
}

export default function Toolbar({
  search,
  onSearchChange,
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
          placeholder="Tìm theo tên môn học..."
          aria-label="Tìm môn học"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
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
