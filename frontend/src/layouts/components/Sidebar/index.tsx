import { Icon } from "@iconify/react";
import { NavLink, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";

import type { Role } from "@/interfaces/user";
import { useAuth } from "@/app/providers/Auth/useAuth";

import LogoIcon from "@/assets/logo_icon.svg";
import LogoText from "@/assets/logo_text.svg";

import styles from "./Sidebar.module.scss";

const cx = classNames.bind(styles);

interface SidebarProps {
  role: Role;
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onNavigate: () => void;
}

interface MenuItem {
  path: string;
  label: string;
  icon: string;
}

const MENUS: Record<Role, MenuItem[]> = {
  STUDENT: [
    {
      path: "/student",
      label: "Tổng quan",
      icon: "lucide:layout-dashboard",
    },
    {
      path: "/student/classes",
      label: "Lớp học",
      icon: "lucide:book-open",
    },
    {
      path: "/student/lectures",
      label: "Bài giảng",
      icon: "lucide:notebook",
    },
    {
      path: "/student/assignments",
      label: "Bài tập",
      icon: "lucide:file-pen-line",
    },
    {
      path: "/student/exams",
      label: "Kiểm tra",
      icon: "lucide:clipboard-check",
    },
    {
      path: "/student/grades",
      label: "Điểm số",
      icon: "lucide:chart-no-axes-column-increasing",
    },
    {
      path: "/student/notifications",
      label: "Thông báo",
      icon: "lucide:bell",
    },
  ],

  TEACHER: [
    {
      path: "/teacher",
      label: "Tổng quan",
      icon: "lucide:layout-dashboard",
    },
    {
      path: "/teacher/classes",
      label: "Lớp học",
      icon: "lucide:users",
    },
    {
      path: "/teacher/content",
      label: "Nội dung",
      icon: "lucide:book-open",
    },
    {
      path: "/teacher/exams",
      label: "Kiểm tra",
      icon: "lucide:clipboard-check",
    },
    {
      path: "/teacher/grading",
      label: "Chấm bài",
      icon: "lucide:file-check",
    },
    {
      path: "/teacher/students",
      label: "Học sinh",
      icon: "lucide:graduation-cap",
    },
    {
      path: "/teacher/notifications",
      label: "Thông báo",
      icon: "lucide:bell",
    },
  ],

  ADMIN: [
    {
      path: "/admin",
      label: "Tổng quan",
      icon: "lucide:layout-dashboard",
    },
    {
      path: "/admin/users",
      label: "Người dùng",
      icon: "lucide:user-round",
    },
    {
      path: "/admin/subjects",
      label: "Môn học",
      icon: "lucide:book-open",
    },
    {
      path: "/admin/classes",
      label: "Lớp học",
      icon: "lucide:users",
    },
    {
      path: "/admin/statistics",
      label: "Thống kê",
      icon: "lucide:chart-no-axes-combined",
    },
    {
      path: "/admin/settings",
      label: "Cài đặt",
      icon: "lucide:settings",
    },
  ],
};

const ROLE_LABELS: Record<Role, string> = {
  STUDENT: "Học sinh",
  TEACHER: "Giáo viên",
  ADMIN: "Quản trị viên",
};

function getInitials(name?: string | null): string {
  if (!name?.trim()) return "U";

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

function Sidebar({
  role,
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onNavigate,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = MENUS[role];
  const homePath = `/${role.toLowerCase()}`;

  // Lấy thông tin người dùng từ AuthProvider
  const displayName = user?.name?.trim() || "Người dùng";
  const displayRole = user?.role ?? role;
  const initials = getInitials(displayName);

  const handleLogout = () => {
    onNavigate();
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={cx("sidebar", {
        collapsed,
        "mobile-open": mobileOpen,
      })}
    >
      {/* Logo */}
      <div className={cx("brand")}>
        <NavLink
          to={homePath}
          className={cx("brand-link")}
          onClick={onNavigate}
          aria-label="EduLearning - Trang chủ"
        >
          <img src={LogoIcon} alt="" className={cx("brand-logo")} />

          <img src={LogoText} alt="EduLearning" className={cx("brand-name")} />
        </NavLink>
      </div>

      {/* Thông tin người dùng */}
      <div className={cx("user-card")}>
        <div className={cx("user-avatar")} aria-hidden="true">
          {initials}
        </div>

        <div className={cx("user-info")}>
          <span className={cx("user-name")} title={displayName}>
            {displayName}
          </span>

          <span className={cx("user-role")}>{ROLE_LABELS[displayRole]}</span>
        </div>
      </div>

      {/* Menu theo role */}
      <nav className={cx("navigation")} aria-label="Menu chính">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === homePath}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) => cx("nav-item", { active: isActive })}
            onClick={onNavigate}
          >
            <span className={cx("nav-icon")} aria-hidden="true">
              <Icon icon={item.icon} width="24" height="24" />
            </span>

            <span className={cx("nav-label")}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Các nút cuối Sidebar */}
      <div className={cx("sidebar-bottom")}>
        <button
          type="button"
          className={cx("logout-button")}
          onClick={handleLogout}
          title={collapsed ? "Đăng xuất" : undefined}
          aria-label="Đăng xuất"
        >
          <span className={cx("nav-icon")} aria-hidden="true">
            <Icon icon="lucide:log-out" width="24" height="24" />
          </span>

          <span>Đăng xuất</span>
        </button>

        <button
          type="button"
          className={cx("collapse-button")}
          onClick={onToggleCollapse}
          title={collapsed ? "Mở rộng menu" : undefined}
          aria-label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
        >
          <span className={cx("nav-icon")} aria-hidden="true">
            <Icon
              icon={
                collapsed ? "lucide:panel-left-open" : "lucide:panel-left-close"
              }
              width="24"
              height="24"
            />
          </span>

          <span>Thu gọn menu</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
