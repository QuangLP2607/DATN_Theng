import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./List.module.scss";

const cx = classNames.bind(styles);

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  unread: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "Bài kiểm tra mới",
    description: "Giáo viên vừa tạo bài KT 15 phút môn Toán",
    time: "5 phút trước",
    icon: "lucide:file-pen-line",
    unread: true,
  },
  {
    id: "2",
    title: "Bài tập đã được chấm",
    description: "Bài tập định luật Newton: 8.5/10",
    time: "2 giờ trước",
    icon: "lucide:star",
    unread: true,
  },
  {
    id: "3",
    title: "Hạn nộp bài sắp đến",
    description: "Bài tập chương 1 Toán — còn 3 ngày",
    time: "1 ngày trước",
    icon: "lucide:clock-3",
    unread: false,
  },
  {
    id: "4",
    title: "Bài giảng mới",
    description: "Hàm đồng biến, nghịch biến vừa được đăng",
    time: "2 ngày trước",
    icon: "lucide:video",
    unread: false,
  },
];

export default function List() {
  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length;

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <div>
          <span className={cx("badge")}>{unreadCount} chưa đọc</span>
        </div>

        <button type="button" className={cx("mark-button")}>
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      <div className={cx("list")}>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cx("item", {
              unread: notification.unread,
            })}
          >
            <div className={cx("icon-wrapper")}>
              <Icon icon={notification.icon} aria-hidden="true" />
            </div>

            <div className={cx("content")}>
              <div className={cx("title", { unread: notification.unread })}>
                {notification.title}
              </div>

              <div className={cx("description")}>
                {notification.description}
              </div>

              <div className={cx("time")}>{notification.time}</div>
            </div>

            {notification.unread && <div className={cx("unread-dot")} />}
          </div>
        ))}
      </div>
    </div>
  );
}
