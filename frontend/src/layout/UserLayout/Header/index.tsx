import { useState, useEffect, type ReactNode } from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import NotificationMenu from "./components/NotificationMenu";
import UserMenu from "./components/UserMenu";

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
}

export default function Header({
  menuItems = [],
  avatarUrl,
  notifications = [],
  extraRight,
}: HeaderProps) {
  const [openMenu, setOpenMenu] = useState<"user" | "notify" | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className={cx("header")}>
      <div className={cx("header__left")}>{/* Logo/title */}</div>

      <div className={cx("header__actions")}>
        {extraRight && <div className={cx("header__extra")}>{extraRight}</div>}

        <NotificationMenu
          notifications={notifications}
          open={openMenu === "notify"}
          onToggle={() =>
            setOpenMenu((prev) => (prev === "notify" ? null : "notify"))
          }
        />

        <UserMenu
          avatarUrl={avatarUrl}
          menuItems={menuItems}
          open={openMenu === "user"}
          onToggle={() =>
            setOpenMenu((prev) => (prev === "user" ? null : "user"))
          }
        />
      </div>
    </div>
  );
}
