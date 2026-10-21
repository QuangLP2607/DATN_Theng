import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import classNames from "classnames/bind";

import NotificationMenu from "./components/NotificationMenu";
import UserMenu from "./components/UserMenu";

import { getPageTitle } from "./pageTitles";

import styles from "./Header.module.scss";

const cx = classNames.bind(styles);

export interface MenuItem {
  icon: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface NotificationItem {
  id: string | number;
  title: string;
  description?: string;
  href?: string;
}

export interface HeaderProps {
  menuItems?: MenuItem[];
  avatarUrl?: string | null;
  logout?: () => void;
  notifications?: NotificationItem[];
  extraRight?: ReactNode;
  title?: string;
}

export default function Header({
  menuItems = [],
  avatarUrl,
  logout,
  notifications = [],
  extraRight,
  title,
}: HeaderProps) {
  const { pathname } = useLocation();

  const pageTitle = title ?? getPageTitle(pathname);

  const [openMenu, setOpenMenu] = useState<"user" | "notify" | null>(null);

  const headerRef = useRef<HTMLElement>(null);

  // Đóng menu khi chuyển trang
  useEffect(() => {
    setOpenMenu(null);
  }, [pathname]);

  // Đóng menu khi click bên ngoài Header
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = (menu: "user" | "notify") => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  return (
    <header ref={headerRef} className={cx("header")}>
      <div className={cx("header__left")}>
        <span className={cx("header__title")} title={pageTitle}>
          {pageTitle}
        </span>
      </div>

      <div className={cx("header__actions")}>
        {extraRight && <div className={cx("header__extra")}>{extraRight}</div>}

        <NotificationMenu
          notifications={notifications}
          open={openMenu === "notify"}
          onToggle={() => toggleMenu("notify")}
        />

        <UserMenu
          avatarUrl={avatarUrl}
          menuItems={menuItems}
          open={openMenu === "user"}
          onToggle={() => toggleMenu("user")}
          onLogout={() => {
            setOpenMenu(null);
            logout?.();
          }}
        />
      </div>
    </header>
  );
}
