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

interface TriggerProps {
  notifications?: NotificationItem[];
  open: boolean;
  onToggle: () => void;
}

interface ContentProps {
  notifications?: NotificationItem[];
  close: () => void;
}

function NotificationMenu({
  notifications = [],
  open,
  onToggle,
}: TriggerProps) {
  return (
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
  );
}

function NotificationContent({ notifications = [], close }: ContentProps) {
  return (
    <div className={cx("notification__dropdown")}>
      <div className={cx("notification__heading")}>
        <span>Thông báo</span>

        {notifications.length > 0 && (
          <span className={cx("notification__count")}>
            {notifications.length}
          </span>
        )}
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
                onClick={close}
              >
                {content}
              </a>
            ) : (
              <div key={notification.id} className={cx("notification__item")}>
                {content}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

type NotificationMenuComponent = typeof NotificationMenu & {
  Content: typeof NotificationContent;
};

const NotificationMenuWithContent =
  NotificationMenu as NotificationMenuComponent;

NotificationMenuWithContent.Content = NotificationContent;

export default NotificationMenuWithContent;
