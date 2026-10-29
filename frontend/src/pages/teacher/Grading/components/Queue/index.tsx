import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./Queue.module.scss";

const cx = classNames.bind(styles);

interface QueueItem {
  id: string;
  student: string;
  assignment: string;
  submittedAt: string;
  icon: string;
  active?: boolean;
}

const queueItems: QueueItem[] = [
  {
    id: "1",
    student: "Lê Minh Cường",
    assignment: "Bài tập chương 1",
    submittedAt: "2024-12-17 14:32",
    icon: "lucide:pencil",
    active: true,
  },
  {
    id: "2",
    student: "Phạm Thị Dung",
    assignment: "Thí nghiệm điện phân",
    submittedAt: "2024-12-17 09:15",
    icon: "lucide:paperclip",
  },
  {
    id: "3",
    student: "Hoàng Văn Em",
    assignment: "Bài tập Newton",
    submittedAt: "2024-12-16 20:45",
    icon: "lucide:pencil",
  },
  {
    id: "4",
    student: "Nguyễn Thị Phương",
    assignment: "Bài tập chương 1",
    submittedAt: "2024-12-16 18:00",
    icon: "lucide:paperclip",
  },
];

export default function Queue() {
  return (
    <div className={cx("wrapper", "stat-card")}>
      <div className={cx("header")}>
        <h3 className={cx("title")}>Hàng chờ chấm</h3>

        <span className={cx("badge")}>4 bài</span>
      </div>

      <div className={cx("list")}>
        {queueItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={cx("item", {
              active: item.active,
            })}
          >
            <div className={cx("student")}>
              <Icon icon={item.icon} className={cx("student-icon")} />

              <span>{item.student}</span>
            </div>

            <div className={cx("assignment")}>{item.assignment}</div>

            <div className={cx("time")}>{item.submittedAt}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
