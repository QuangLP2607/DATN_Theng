import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import type { UserListItem } from "@/services/users";

import styles from "./UserList.module.scss";

const cx = classNames.bind(styles);

interface UserListProps {
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

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("vi-VN").format(parsedDate);
}

export default function UserList({ users, loading = false }: UserListProps) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("table-wrapper")}>
        <table className={cx("table")}>
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tham gia</th>
              <th>Lớp</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className={cx("empty")} colSpan={7}>
                  Đang tải danh sách người dùng...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td className={cx("empty")} colSpan={7}>
                  <Icon
                    icon="lucide:users"
                    aria-hidden="true"
                    className={cx("empty-icon")}
                  />
                  <span>Không có người dùng nào.</span>
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isTeacher = user.role === "TEACHER";
                const isStudent = user.role === "STUDENT";
                const isAdmin = user.role === "ADMIN";
                const isActive = user.status === "ACTIVE";

                return (
                  <tr key={user.id}>
                    <td>
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

                        <span className={cx("name")}>{user.name}</span>
                      </div>
                    </td>

                    <td className={cx("email")}>{user.email}</td>

                    <td>
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

                        {isTeacher
                          ? "Giáo viên"
                          : isStudent
                            ? "Học sinh"
                            : "Quản trị viên"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={cx("status", {
                          active: isActive,
                          inactive: !isActive,
                        })}
                      >
                        <span className={cx("status-dot")} />
                        {isActive ? "Hoạt động" : "Không HĐ"}
                      </span>
                    </td>

                    <td className={cx("date")}>{formatDate(user.createdAt)}</td>

                    <td className={cx("class-count")}>
                      {"classCount" in user &&
                      typeof user.classCount === "number"
                        ? user.classCount
                        : "—"}
                    </td>

                    <td>
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
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
