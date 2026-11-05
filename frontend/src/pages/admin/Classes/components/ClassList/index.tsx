import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import DataTable, {
  type DataTableColumn,
  type DataTableSort,
} from "@/components/DataTable";

import type { ClassListItem } from "@/services/class";

import styles from "./ClassList.module.scss";

const cx = classNames.bind(styles);

interface ClassListProps {
  classes: ClassListItem[];
  loading?: boolean;
  sort: DataTableSort | null;
  onSortChange: (sort: DataTableSort | null) => void;
  onEdit: (item: ClassListItem) => void;
}

function formatDate(date?: string): string {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return new Intl.DateTimeFormat("vi-VN").format(parsedDate);
}

const columns: DataTableColumn<ClassListItem>[] = [
  {
    key: "class",
    title: "Lớp học",
    render: (item) => (
      <div className={cx("class-info")}>
        <span className={cx("class-name")} title={item.name}>
          {item.name}
        </span>

        <span className={cx("class-code")}>{item.code}</span>
      </div>
    ),
  },
  {
    key: "subject",
    title: "Môn học",
    render: (item) => (
      <div className={cx("subject")}>
        <Icon
          icon={item.subject.icon || "solar:book-2-linear"}
          aria-hidden="true"
        />

        <span title={item.subject.title}>{item.subject.title}</span>
      </div>
    ),
  },
  {
    key: "teachers",
    title: "Giáo viên",
    align: "center",
    render: (item) => (
      <span className={cx("count")}>{item._count.teachers}</span>
    ),
  },
  {
    key: "students",
    title: "Học sinh",
    align: "center",
    render: (item) => (
      <span className={cx("count")}>{item._count.students}</span>
    ),
  },
  {
    key: "assignments",
    title: "Bài tập",
    align: "center",
    render: (item) => (
      <span className={cx("count")}>{item._count.assignments}</span>
    ),
  },
  {
    key: "exams",
    title: "Bài kiểm tra",
    align: "center",
    render: (item) => <span className={cx("count")}>{item._count.exams}</span>,
  },
  {
    key: "status",
    title: "Trạng thái",
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
          {isActive ? "Hoạt động" : "Ngừng hoạt động"}
        </span>
      );
    },
  },
  {
    key: "createdAt",
    title: "Ngày tạo",
    align: "center",
    sortable: true,
    render: (item) => (
      <span className={cx("date")}>{formatDate(item.createdAt)}</span>
    ),
  },
];

export default function ClassList({
  classes,
  loading = false,
  sort,
  onSortChange,
  onEdit,
}: ClassListProps) {
  const tableColumns: DataTableColumn<ClassListItem>[] = [
    ...columns,
    {
      key: "actions",
      title: "Thao tác",
      align: "center",
      render: (item) => (
        <button
          className={cx("edit-button")}
          type="button"
          onClick={() => onEdit(item)}
          aria-label={`Chỉnh sửa ${item.name}`}
          title="Chỉnh sửa"
        >
          <Icon icon="lucide:pencil" aria-hidden="true" />
        </button>
      ),
    },
  ];

  return (
    <div className={cx("wrapper")}>
      <DataTable
        columns={tableColumns}
        data={classes}
        rowKey={(item) => item.id}
        loading={loading}
        emptyMessage="Không tìm thấy lớp học nào."
        emptyIcon="lucide:school"
        minWidth={1050}
        sort={sort}
        onSortChange={onSortChange}
      />
    </div>
  );
}
