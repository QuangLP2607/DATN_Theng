import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./LearningProgress.module.scss";

const cx = classNames.bind(styles);

const learningProgress = [
  {
    name: "Toán học 11",
    progress: 65,
    icon: "lucide:ruler",
    color: "primary",
  },
  {
    name: "Vật lý 11",
    progress: 40,
    icon: "lucide:atom",
    color: "success",
  },
  {
    name: "Hóa học 11",
    progress: 80,
    icon: "lucide:flask-conical",
    color: "accent",
  },
  {
    name: "Ngữ văn 11",
    progress: 55,
    icon: "lucide:book-open",
    color: "danger",
  },
  {
    name: "Lịch sử 11",
    progress: 30,
    icon: "lucide:landmark",
    color: "primary-dark",
  },
  {
    name: "Địa lý 11",
    progress: 70,
    icon: "lucide:earth",
    color: "primary",
  },
  {
    name: "Sinh học 11",
    progress: 48,
    icon: "lucide:flask-conical",
    color: "success",
  },
  {
    name: "Tiếng Anh 11",
    progress: 72,
    icon: "lucide:book-open",
    color: "primary",
  },
  {
    name: "Tin học 11",
    progress: 57,
    icon: "lucide:clipboard-list",
    color: "accent",
  },
  {
    name: "Giáo dục kinh tế và pháp luật 11",
    progress: 35,
    icon: "lucide:school",
    color: "primary-dark",
  },
  {
    name: "Công nghệ 11",
    progress: 63,
    icon: "lucide:settings",
    color: "danger",
  },
  {
    name: "Giáo dục thể chất 11",
    progress: 82,
    icon: "lucide:trophy",
    color: "success",
  },
];

export default function LearningProgress() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <h3>Tiến độ học tập</h3>

        <button type="button" className={cx("view-all")}>
          Xem tất cả
        </button>
      </div>

      <div className={cx("list")}>
        {learningProgress.map((subject) => (
          <div className={cx("subject")} key={subject.name}>
            <div className={cx("subject-header")}>
              <div className={cx("subject-name")}>
                <Icon
                  className={cx("subject-icon")}
                  icon={subject.icon}
                  aria-hidden="true"
                />

                <span>{subject.name}</span>
              </div>

              <span className={cx("percentage")}>{subject.progress}%</span>
            </div>

            <div className={cx("progress-bar")}>
              <div
                className={cx("progress-fill", subject.color)}
                style={{ width: `${subject.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
