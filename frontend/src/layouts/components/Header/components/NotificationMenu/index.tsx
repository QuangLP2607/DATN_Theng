import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./NotificationMenu.module.scss";

const cx = classNames.bind(styles);

export interface NotificationItem {
  id: string | number;
  title: string;
  description?: string;
  href?: string;
}

interface Props {
  notifications?: NotificationItem[];
  open: boolean;
  onToggle: () => void;
}

export default function NotificationMenu({
  notifications = [],
  open,
  onToggle,
}: Props) {
  return (
    <div className={cx("notification")}>
      <button
        type="button"
        className={cx("notification__trigger")}
        aria-label="Thông báo"
        aria-expanded={open}
        onClick={onToggle}
      >
        <Icon className={cx("notification__icon")} icon="iconoir:bell" />

        {notifications.length > 0 && (
          <span className={cx("notification__badge")}>
            {notifications.length > 99 ? "99+" : notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className={cx("notification__dropdown")}>
          <div className={cx("notification__heading")}>
            Thông báo
            {notifications.length > 0 && <span>{notifications.length}</span>}
          </div>

          {notifications.length === 0 ? (
            <div className={cx("notification__empty")}>
              <Icon icon="iconoir:bell-off" width={24} height={24} />
              <span>Không có thông báo</span>
            </div>
          ) : (
            <div className={cx("notification__list")}>
              {notifications.map((notification) => {
                const content = (
                  <>
                    <div className={cx("notification__item-icon")}>
                      <Icon icon="iconoir:bell-notification" />
                    </div>

                    <div className={cx("notification__item-content")}>
                      <div className={cx("notification__item-title")}>
                        {notification.title}
                      </div>

                      {notification.description && (
                        <div className={cx("notification__item-desc")}>
                          {notification.description}
                        </div>
                      )}
                    </div>
                  </>
                );

                return notification.href ? (
                  <a
                    key={notification.id}
                    href={notification.href}
                    className={cx("notification__item")}
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    key={notification.id}
                    className={cx("notification__item")}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
