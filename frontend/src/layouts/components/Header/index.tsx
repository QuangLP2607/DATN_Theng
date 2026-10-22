import { useLocation } from "react-router-dom";
import classNames from "classnames/bind";

import Dropdown from "@/components/Dropdown";

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
  extraRight?: React.ReactNode;
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

  return (
    <header className={cx("header")}>
      <div className={cx("header__left")}>
        <span className={cx("header__title")} title={pageTitle}>
          {pageTitle}
        </span>
      </div>

      <div className={cx("header__actions")}>
        {extraRight && <div className={cx("header__extra")}>{extraRight}</div>}

        <Dropdown
          align="end"
          offset={8}
          trigger={({ open, toggle }) => (
            <NotificationMenu
              notifications={notifications}
              open={open}
              onToggle={toggle}
            />
          )}
        >
          {({ close }) => (
            <NotificationMenu.Content
              notifications={notifications}
              close={close}
            />
          )}
        </Dropdown>

        <Dropdown
          align="end"
          offset={8}
          trigger={({ open, toggle }) => (
            <UserMenu avatarUrl={avatarUrl} open={open} onToggle={toggle} />
          )}
        >
          {({ close }) => (
            <UserMenu.Content
              menuItems={menuItems}
              close={close}
              onLogout={() => {
                close();
                logout?.();
              }}
            />
          )}
        </Dropdown>
      </div>
    </header>
  );
}
