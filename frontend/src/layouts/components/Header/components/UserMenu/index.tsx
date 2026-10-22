import { useState } from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./UserMenu.module.scss";

const cx = classNames.bind(styles);

export interface MenuItem {
  icon: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface TriggerProps {
  avatarUrl?: string | null;
  open: boolean;
  onToggle: () => void;
}

interface ContentProps {
  menuItems?: MenuItem[];
  onLogout?: () => void;
  close: () => void;
}

function UserAvatar({ avatarUrl, open, onToggle }: TriggerProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      type="button"
      className={cx("user-menu__trigger")}
      aria-label="Menu tài khoản"
      aria-expanded={open}
      onClick={onToggle}
    >
      {!avatarUrl || imgError ? (
        <Icon className={cx("user-menu__fallback")} icon="si:user-fill" />
      ) : (
        <img
          className={cx("user-menu__avatar")}
          src={avatarUrl}
          alt="Avatar"
          draggable={false}
          onError={() => setImgError(true)}
        />
      )}

      <Icon
        className={cx("user-menu__chevron", {
          "user-menu__chevron--open": open,
        })}
        icon="lucide:chevron-down"
      />
    </button>
  );
}

function UserMenuContent({ menuItems = [], onLogout, close }: ContentProps) {
  return (
    <div className={cx("user-menu__dropdown")}>
      {menuItems.map((item, index) => {
        const handleClick = () => {
          item.onClick?.();
          close();
        };

        if (item.href) {
          return (
            <a
              key={`${item.label}-${index}`}
              href={item.href}
              className={cx("user-menu__item")}
              onClick={handleClick}
            >
              <Icon icon={item.icon} />
              <span>{item.label}</span>
            </a>
          );
        }

        return (
          <button
            key={`${item.label}-${index}`}
            type="button"
            className={cx("user-menu__item")}
            onClick={handleClick}
          >
            <Icon icon={item.icon} />
            <span>{item.label}</span>
          </button>
        );
      })}

      {menuItems.length > 0 && <div className={cx("user-menu__divider")} />}

      <button
        type="button"
        className={cx("user-menu__item", "user-menu__item--danger")}
        onClick={() => {
          close();
          onLogout?.();
        }}
      >
        <Icon icon="material-symbols:logout" />
        <span>Đăng xuất</span>
      </button>
    </div>
  );
}

type UserMenuComponent = typeof UserAvatar & {
  Content: typeof UserMenuContent;
};

const UserMenu = UserAvatar as UserMenuComponent;

UserMenu.Content = UserMenuContent;

export default UserMenu;
