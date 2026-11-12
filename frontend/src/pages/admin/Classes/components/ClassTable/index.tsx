import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import DataTable, {
  type DataTableColumn,
  type DataTableSort,
} from "@/components/DataTable";

import type { ClassListItem } from "@/services/class";

import styles from "./ClassTable.module.scss";

const cx = classNames.bind(styles);

interface ClassTableProps {
  classes: ClassListItem[];
  loading?: boolean;
  sort: DataTableSort | null;
  onSortChange: (sort: DataTableSort | null) => void;
  onEdit: (item: ClassListItem) => void;
  onDelete: (item: ClassListItem) => void;
}

function formatDate(value: string | null): string {
  if (!value) return "Chưa thiết lập";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Chưa thiết lập";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "Đang hoạt động";
    case "INACTIVE":
      return "Ngừng hoạt động";
    default:
      return status;
  }
}

export default function ClassTable({
  classes,
  loading = false,
  sort,
  onSortChange,
  onEdit,
  onDelete,
}: ClassTableProps) {
  const columns: DataTableColumn<ClassListItem>[] = [
    {
      key: "name",
      title: "Lớp học",
      width: "19%",
      sortable: true,
      render: (item) => (
        <div className={cx("class")}>
          <div className={cx("class-icon")}>
            <Icon icon="lucide:users" aria-hidden="true" />
          </div>

          <div className={cx("class-info")}>
            <span className={cx("class-name")} title={item.name}>
              {item.name}
            </span>
            <span className={cx("class-code")}>{item.code}</span>
          </div>
        </div>
      ),
    },
    {
      key: "course",
      title: "Khóa học",
      width: "19%",
      render: (item) => (
        <div className={cx("course-info")}>
          <span className={cx("course-name")} title={item.course?.title}>
            {item.course?.title ?? "—"}
          </span>
          <span className={cx("course-code")}>{item.course?.code ?? "—"}</span>
        </div>
      ),
    },
    {
      key: "startAt",
      title: "Thời gian",
      width: "21%",
      sortable: true,
      render: (item) => (
        <div className={cx("date-info")}>
          <span>{formatDate(item.startAt)}</span>
          <span className={cx("date-separator")}>-</span>
          <span>{formatDate(item.endAt)}</span>
        </div>
      ),
    },
    {
      key: "teachers",
      title: "Giáo viên",
      width: "10%",
      align: "center",
      render: (item) => (
        <span className={cx("count")}>
          <Icon icon="lucide:graduation-cap" aria-hidden="true" />
          {item._count?.teachers ?? 0}
        </span>
      ),
    },
    {
      key: "enrollments",
      title: "Học viên",
      width: "11%",
      align: "center",
      render: (item) => (
        <span className={cx("count")}>
          <Icon icon="lucide:users" aria-hidden="true" />
          {item._count?.enrollments ?? 0}
          {item.maxStudents !== null && (
            <span className={cx("capacity")}>/ {item.maxStudents}</span>
          )}
        </span>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      width: "12%",
      align: "center",
      render: (item) => {
        const isActive = item.status === "ACTIVE";

        return (
          <span
            className={cx("status", {
              active: isActive,
              inactive: !isActive,
            })}
          >
            <span className={cx("status-dot")} />
            {getStatusLabel(item.status)}
          </span>
        );
      },
    },
    {
      key: "actions",
      title: "Thao tác",
      width: "8%",
      align: "center",
      render: (item) => (
        <div className={cx("actions")}>
          <button
            type="button"
            className={cx("action-button")}
            onClick={() => onEdit(item)}
            aria-label={`Chỉnh sửa ${item.name}`}
            title="Chỉnh sửa"
          >
            <Icon icon="lucide:pencil" aria-hidden="true" />
          </button>

          <button
            type="button"
            className={cx("action-button", "delete-button")}
            onClick={() => onDelete(item)}
            aria-label={`Xóa ${item.name}`}
            title="Xóa lớp học"
          >
            <Icon icon="lucide:trash-2" aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={cx("wrapper")}>
      <DataTable
        columns={columns}
        data={classes}
        rowKey={(item) => item.id}
        loading={loading}
        emptyMessage="Chưa có lớp học nào."
        emptyIcon="lucide:users"
        minWidth={1100}
        sort={sort}
        onSortChange={onSortChange}
      />
    </div>
  );
}
