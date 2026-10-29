import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./CardGrid.module.scss";

const cx = classNames.bind(styles);

interface Assignment {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  icon: string;
  submitted: boolean;
  score?: string;
}

const assignments: Assignment[] = [
  {
    id: "assignment-1",
    title: "Bài tập chương 1 - Hàm số",
    subject: "Toán học 11",
    deadline: "2024-12-20",
    icon: "lucide:clipboard-CardGrid",
    submitted: false,
  },
  {
    id: "assignment-2",
    title: "Bài tập định luật Newton",
    subject: "Vật lý 11",
    deadline: "2024-12-18",
    icon: "lucide:circle-check",
    submitted: true,
    score: "8.5/10 điểm",
  },
  {
    id: "assignment-3",
    title: "Thí nghiệm điện phân",
    subject: "Hóa học 11",
    deadline: "2024-12-22",
    icon: "lucide:clipboard-CardGrid",
    submitted: false,
  },
  {
    id: "assignment-4",
    title: "Bài tập đạo hàm",
    subject: "Toán học 11",
    deadline: "2024-12-25",
    icon: "lucide:circle-check",
    submitted: true,
    score: "9/10 điểm",
  },
  {
    id: "assignment-5",
    title: "Luyện tập đồ thị hàm số",
    subject: "Toán học 11",
    deadline: "2026-10-31",
    icon: "lucide:circle-check",
    submitted: true,
    score: "7/10 điểm",
  },
  {
    id: "assignment-6",
    title: "Bài tập gia tốc và vận tốc",
    subject: "Vật lý 11",
    deadline: "2026-11-01",
    icon: "lucide:clipboard-CardGrid",
    submitted: false,
  },
  {
    id: "assignment-7",
    title: "Cân bằng phản ứng hóa học",
    subject: "Hóa học 11",
    deadline: "2026-11-02",
    icon: "lucide:clipboard-CardGrid",
    submitted: false,
  },
  {
    id: "assignment-8",
    title: "Phân tích nhân vật trong truyện",
    subject: "Ngữ văn 11",
    deadline: "2026-11-03",
    icon: "lucide:clipboard-CardGrid",
    submitted: false,
  },
];

export default function CardGrid() {
  return (
    <div className={cx("wrapper")}>
      {assignments.map((assignment) => (
        <div className={cx("item")} key={assignment.id}>
          <div
            className={cx("icon-wrapper", { submitted: assignment.submitted })}
          >
            <Icon icon={assignment.icon} aria-hidden="true" />
          </div>

          <div className={cx("info")}>
            <div className={cx("title")}>{assignment.title}</div>

            <div className={cx("meta")}>
              {assignment.subject}
              <span>·</span>
              Hạn nộp: {assignment.deadline}
            </div>
          </div>

          <span
            className={cx("badge", {
              warning: !assignment.submitted,
              success: assignment.submitted,
            })}
          >
            {assignment.submitted ? assignment.score : "Chưa nộp"}
          </span>

          <button
            type="button"
            className={cx("action", {
              primary: !assignment.submitted,
              secondary: assignment.submitted,
            })}
          >
            {assignment.submitted ? "Xem bài làm" : "Làm bài"}
            <Icon icon="lucide:arrow-right" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
