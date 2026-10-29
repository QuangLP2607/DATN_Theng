import { Icon } from "@iconify/react";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";

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

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("vi-VN").format(parsedDate);
}

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

      <div className={cx("table-wrapper")}>
        <table className={cx("table")}>
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tham gia</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className={cx("empty")} colSpan={5}>
                  <Icon
                    icon="lucide:loader-circle"
                    className={cx("loading-icon")}
                    aria-hidden="true"
                  />
                  Đang tải danh sách người dùng...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td className={cx("empty")} colSpan={5}>
                  <Icon
                    icon="lucide:users"
                    className={cx("empty-icon")}
                    aria-hidden="true"
                  />
                  Không có người dùng nào.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isTeacher = user.role === "TEACHER";
                const isStudent = user.role === "STUDENT";
                const isAdmin = user.role === "ADMIN";
                const isActive = user.status === "ACTIVE";

                return (
                  <tr className={cx("table-row")} key={user.id}>
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

                    <td>
                      <span className={cx("email")}>{user.email}</span>
                    </td>

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

                    <td>
                      <span className={cx("date")}>
                        {formatDate(user.createdAt)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
