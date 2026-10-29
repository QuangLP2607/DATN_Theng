import classNames from "classnames/bind";
import styles from "./Notifications.module.scss";

const cx = classNames.bind(styles);

const notifications = [
  {
    title: "Bài kiểm tra mới",
    time: "5 phút trước",
    isNew: true,
  },
  {
    title: "Bài tập đã được chấm",
    time: "2 giờ trước",
    isNew: true,
  },
  {
    title: "Hạn nộp bài sắp đến",
    time: "1 ngày trước",
    isNew: false,
  },
];

export default function Notifications() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <h3>Thông báo</h3>

        <span className={cx("badge")}>2 mới</span>
      </div>

      <div className={cx("list")}>
        {notifications.map((notification) => (
          <div
            className={cx("notification", {
              new: notification.isNew,
            })}
            key={notification.title}
          >
            <div className={cx("notification-title")}>{notification.title}</div>

            <div className={cx("notification-time")}>{notification.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
