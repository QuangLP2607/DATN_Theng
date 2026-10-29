import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import DataTable, {
  type DataTableColumn,
  type DataTableSort,
} from "@/components/DataTable";
import type { UserListItem } from "@/services/users";

import styles from "./UserList.module.scss";

const cx = classNames.bind(styles);

interface UserListProps {
  users: UserListItem[];
  loading?: boolean;
  sort: DataTableSort | null;
  onSortChange: (sort: DataTableSort | null) => void;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function formatDate(date?: string): string {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return new Intl.DateTimeFormat("vi-VN").format(parsedDate);
}

const columns: DataTableColumn<UserListItem>[] = [
  {
    key: "user",
    title: "Người dùng",
    render: (user) => {
      const isTeacher = user.role === "TEACHER";
      const isStudent = user.role === "STUDENT";
      const isAdmin = user.role === "ADMIN";

      return (
        <div className={cx("user")}>
          <div
            className={cx("avatar", {
              teacher: isTeacher,
              student: isStudent,
              admin: isAdmin,
            })}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              getInitials(user.name)
            )}
          </div>

          <span className={cx("name")} title={user.name}>
            {user.name}
          </span>
        </div>
      );
    },
  },
  {
    key: "email",
    title: "Email",
    width: "250px",
    truncate: true,
    copyable: (user) => user.email,
    render: (user) => user.email,
  },
  {
    key: "role",
    title: "Vai trò",
    align: "center",
    render: (user) => {
      const isTeacher = user.role === "TEACHER";
      const isStudent = user.role === "STUDENT";
      const isAdmin = user.role === "ADMIN";

      return (
        <span
          className={cx("badge", {
            teacher: isTeacher,
            student: isStudent,
            admin: isAdmin,
          })}
        >
          <Icon
            icon={
              isTeacher
                ? "lucide:book-open"
                : isStudent
                  ? "lucide:graduation-cap"
                  : "lucide:shield-check"
            }
            aria-hidden="true"
          />

          {isTeacher ? "Giáo viên" : isStudent ? "Học sinh" : "Quản trị viên"}
        </span>
      );
    },
  },
  {
    key: "status",
    title: "Trạng thái",
    align: "center",
    render: (user) => {
      const isActive = user.status === "ACTIVE";

      return (
        <span
          className={cx("status", {
            active: isActive,
            inactive: !isActive,
          })}
        >
          <span className={cx("status-dot")} />
          {isActive ? "Hoạt động" : "Không HĐ"}
        </span>
      );
    },
  },
  {
    key: "createdAt",
    title: "Ngày tham gia",
    align: "center",
    sortable: true,
    render: (user) => (
      <span className={cx("date")}>{formatDate(user.createdAt)}</span>
    ),
  },
  {
    key: "classCount",
    title: "Lớp",
    align: "center",
    render: (user) =>
      typeof user.classCount === "number" ? (
        <span className={cx("class-count")}>{user.classCount}</span>
      ) : (
        "—"
      ),
  },
  {
    key: "actions",
    title: "Thao tác",
    align: "center",
    render: (user) => {
      const isActive = user.status === "ACTIVE";

      return (
        <div className={cx("actions")}>
          <button
            className={cx("edit")}
            type="button"
            onClick={() => {
              // TODO: Mở form chỉnh sửa người dùng.
            }}
          >
            <Icon icon="lucide:pencil" aria-hidden="true" />
            Sửa
          </button>

          <button
            className={cx(isActive ? "lock" : "unlock")}
            type="button"
            onClick={() => {
              // TODO: Gọi API khóa hoặc mở tài khoản.
            }}
          >
            <Icon
              icon={isActive ? "lucide:lock" : "lucide:lock-open"}
              aria-hidden="true"
            />
            {isActive ? "Khóa" : "Mở"}
          </button>
        </div>
      );
    },
  },
];

export default function UserList({
  users,
  loading = false,
  sort,
  onSortChange,
}: UserListProps) {
  return (
    <div className={cx("wrapper")}>
      <DataTable
        columns={columns}
        data={users}
        rowKey={(user) => user.id}
        loading={loading}
        emptyMessage="Không có người dùng nào."
        emptyIcon="lucide:users"
        minWidth={900}
        sort={sort}
        onSortChange={onSortChange}
      />
    </div>
  );
}
