import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./ClassesOverview.module.scss";

const cx = classNames.bind(styles);

interface ClassItem {
  name: string;
  students: number;
  chapters: number;
  progress: number;
  icon: string;
  progressClass: "primary" | "success" | "accent" | "danger";
}

const classes: ClassItem[] = [
  {
    name: "Toán học 11",
    students: 42,
    chapters: 8,
    progress: 65,
    icon: "lucide:ruler",
    progressClass: "primary",
  },
  {
    name: "Vật lý 11",
    students: 38,
    chapters: 7,
    progress: 40,
    icon: "lucide:atom",
    progressClass: "success",
  },
  {
    name: "Hóa học 11",
    students: 35,
    chapters: 9,
    progress: 80,
    icon: "lucide:flask-conical",
    progressClass: "accent",
  },
  {
    name: "Ngữ văn 11",
    students: 44,
    chapters: 6,
    progress: 55,
    icon: "lucide:book-open",
    progressClass: "danger",
  },
];

export default function ClassesOverview() {
  return (
    <div className={cx("stat-card")}>
      <div className={cx("header")}>
        <h3 className={cx("title")}>Lớp đang dạy</h3>
      </div>

      <div className={cx("class-list")}>
        {classes.map((item) => (
          <div className={cx("class-item")} key={item.name}>
            <div className={cx("class-icon")}>
              <Icon icon={item.icon} aria-hidden="true" />
            </div>

            <div className={cx("class-info")}>
              <div className={cx("class-name")}>{item.name}</div>

              <div className={cx("metadata")}>
                <span>
                  <Icon icon="lucide:users-round" aria-hidden="true" />
                  {item.students} học sinh
                </span>

                <span>
                  <Icon icon="lucide:library-big" aria-hidden="true" />
                  {item.chapters} chương
                </span>
              </div>
            </div>

            <div className={cx("progress")}>
              <div className={cx("progress-value", item.progressClass)}>
                {item.progress}%
              </div>

              <div className={cx("progress-label")}>tiến độ</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
