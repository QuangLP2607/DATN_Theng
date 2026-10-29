import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./Pagination.module.scss";

const cx = classNames.bind(styles);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className={cx("wrapper")}>
      <p className={cx("status")} role="status">
        Hiển thị {startItem}–{endItem} / {totalItems} lớp học
      </p>

      <nav className={cx("pagination")} aria-label="Phân trang lớp học">
        <button
          type="button"
          className={cx("button")}
          aria-label="Trang trước"
          disabled={!canGoPrevious}
          onClick={() => onPageChange?.(currentPage - 1)}
        >
          <Icon icon="lucide:arrow-left" aria-hidden="true" />
        </button>

        <span className={cx("page-info")}>
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          className={cx("button")}
          aria-label="Trang sau"
          disabled={!canGoNext}
          onClick={() => onPageChange?.(currentPage + 1)}
        >
          <Icon icon="lucide:arrow-right" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}
