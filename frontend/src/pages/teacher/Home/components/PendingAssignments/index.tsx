import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./PendingAssignments.module.scss";

const cx = classNames.bind(styles);

interface PendingAssignment {
  studentName: string;
  assignment: string;
  subject: string;
  time: string;
  icon: string;
}

const assignments: PendingAssignment[] = [
  {
    studentName: "Lê Minh Cường",
    assignment: "Bài tập chương 1",
    subject: "Toán học 11",
    time: "14:32",
    icon: "lucide:pencil",
  },
  {
    studentName: "Phạm Thị Dung",
    assignment: "Thí nghiệm điện phân",
    subject: "Hóa học 11",
    time: "09:15",
    icon: "lucide:paperclip",
  },
  {
    studentName: "Hoàng Văn Em",
    assignment: "Bài tập Newton",
    subject: "Vật lý 11",
    time: "20:45",
    icon: "lucide:pencil",
  },
  {
    studentName: "Nguyễn Thị Phương",
    assignment: "Bài tập chương 1",
    subject: "Toán học 11",
    time: "18:00",
    icon: "lucide:paperclip",
  },
];

export default function PendingAssignments() {
  return (
    <div className={cx("stat-card")}>
      <div className={cx("header")}>
        <h3 className={cx("title")}>Bài chờ chấm</h3>

        <button className={cx("view-all-button")}>Xem tất cả</button>
      </div>

      <div className={cx("assignment-list")}>
        {assignments.map((item) => (
          <div
            className={cx("assignment-item")}
            key={`${item.studentName}-${item.time}`}
          >
            <div className={cx("assignment-icon")}>
              <Icon icon={item.icon} aria-hidden="true" />
            </div>

            <div className={cx("assignment-info")}>
              <div className={cx("student-name")}>{item.studentName}</div>

              <div className={cx("assignment-name")}>
                {item.assignment} · {item.subject}
              </div>
            </div>

            <div className={cx("time")}>{item.time}</div>

            <button className={cx("grade-button")}>Chấm</button>
          </div>
        ))}
      </div>
    </div>
  );
}
