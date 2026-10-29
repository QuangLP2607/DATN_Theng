import { Icon } from "@iconify/react";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";

import DataTable, { type DataTableColumn } from "@/components/DataTable";
import type { UserListItem } from "@/services/users";

import styles from "./RecentUsers.module.scss";

const cx = classNames.bind(styles);

interface RecentUsersProps {
  users: UserListItem[];
  loading?: boolean;
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

function renderUser(user: UserListItem) {
  const isTeacher = user.role === "TEACHER";
  const isStudent = user.role === "STUDENT";

  return (
    <div className={cx("user")}>
      <div
        className={cx("avatar", {
          teacher: isTeacher,
          student: isStudent,
          admin: !isTeacher && !isStudent,
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
}

const columns: DataTableColumn<UserListItem>[] = [
  {
    key: "user",
    title: "Người dùng",
    render: renderUser,
  },
  {
    key: "email",
    title: "Email",
    render: (user) => <span className={cx("email")}>{user.email}</span>,
  },
  {
    key: "role",
    title: "Vai trò",
    align: "center",
    render: (user) => {
      const isTeacher = user.role === "TEACHER";
      const isStudent = user.role === "STUDENT";

      return (
        <span
          className={cx("badge", {
            teacher: isTeacher,
            student: isStudent,
            admin: !isTeacher && !isStudent,
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
    render: (user) => (
      <span className={cx("date")}>{formatDate(user.createdAt)}</span>
    ),
  },
];

export default function RecentUsers({
  users,
  loading = false,
}: RecentUsersProps) {
  const navigate = useNavigate();

  return (
    <section className={cx("wrapper")}>
      <div className={cx("header")}>
        <div className={cx("heading")}>
          <h3 className={cx("title")}>Người dùng gần đây</h3>
          <p className={cx("description")}>
            Danh sách tài khoản mới tham gia hệ thống
          </p>
        </div>

        <button
          className={cx("manage-button")}
          type="button"
          onClick={() => navigate("/admin/users")}
        >
          Quản lý
          <Icon icon="lucide:arrow-up-right" aria-hidden="true" />
        </button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        rowKey={(user) => user.id}
        loading={loading}
        emptyMessage="Không có người dùng nào."
        emptyIcon="lucide:users"
        minWidth={680}
        sort={null}
        onSortChange={() => {}}
      />
    </section>
  );
}
