import { Icon } from "@iconify/react";
import classNames from "classnames/bind";
import type { ReactNode } from "react";

import styles from "./DataTable.module.scss";

const cx = classNames.bind(styles);

export type SortDirection = "asc" | "desc";

export interface DataTableSort {
  key: string;
  direction: SortDirection;
}

export interface DataTableColumn<T> {
  key: string;
  title: string;
  render: (item: T) => ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
  truncate?: boolean;
  copyable?: (item: T) => string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (item: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: string;
  minWidth?: number;
  sort: DataTableSort | null;
  onSortChange: (sort: DataTableSort | null) => void;
}

export default function DataTable<T>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyMessage = "Không có dữ liệu.",
  emptyIcon = "lucide:inbox",
  minWidth = 680,
  sort,
  onSortChange,
}: DataTableProps<T>) {
  const handleSort = (key: string) => {
    if (sort?.key !== key) {
      onSortChange({ key, direction: "asc" });
      return;
    }

    if (sort.direction === "asc") {
      onSortChange({ key, direction: "desc" });
      return;
    }

    onSortChange(null);
  };

  const handleCopy = (value: string) => {
    void navigator.clipboard.writeText(value).catch(() => {
      // Clipboard có thể không khả dụng nếu trình duyệt chặn quyền truy cập.
    });
  };

  const isInitialLoading = loading && data.length === 0;

  return (
    <div className={cx("table-wrapper")}>
      <table className={cx("table")} style={{ minWidth }}>
        <thead>
          <tr>
            {columns.map((column) => {
              const isSorted = sort?.key === column.key;

              return (
                <th
                  key={column.key}
                  scope="col"
                  style={{
                    width: column.width,
                    textAlign: column.align ?? "left",
                  }}
                  aria-sort={
                    column.sortable
                      ? isSorted
                        ? sort.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                      : undefined
                  }
                >
                  {column.sortable ? (
                    <button
                      className={cx("sort-button", {
                        sorted: isSorted,
                      })}
                      type="button"
                      onClick={() => handleSort(column.key)}
                    >
                      <span>{column.title}</span>

                      <Icon
                        icon={
                          !isSorted
                            ? "lucide:arrow-up-down"
                            : sort.direction === "asc"
                              ? "lucide:arrow-up"
                              : "lucide:arrow-down"
                        }
                        className={cx("sort-icon", {
                          sorted: isSorted,
                        })}
                        aria-hidden="true"
                      />
                    </button>
                  ) : (
                    column.title
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {isInitialLoading ? (
            <tr>
              <td className={cx("empty")} colSpan={columns.length}>
                <Icon
                  icon="lucide:loader-circle"
                  className={cx("loading-icon")}
                  aria-hidden="true"
                />
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td className={cx("empty")} colSpan={columns.length}>
                <Icon
                  icon={emptyIcon}
                  className={cx("empty-icon")}
                  aria-hidden="true"
                />
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={rowKey(item)}>
                {columns.map((column) => {
                  const copyValue = column.copyable?.(item);
                  const content = column.render(item);

                  return (
                    <td
                      key={column.key}
                      className={cx({
                        "truncate-cell": column.truncate,
                      })}
                      style={{
                        textAlign: column.align ?? "left",
                      }}
                    >
                      {column.truncate ? (
                        <div className={cx("cell-content")}>
                          <span
                            className={cx("cell-text")}
                            title={
                              typeof content === "string" ? content : copyValue
                            }
                          >
                            {content}
                          </span>

                          {copyValue !== undefined && (
                            <button
                              className={cx("copy-button")}
                              type="button"
                              title="Sao chép"
                              aria-label={`Sao chép ${copyValue}`}
                              onClick={() => handleCopy(copyValue)}
                            >
                              <Icon icon="lucide:copy" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      ) : (
                        content
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
