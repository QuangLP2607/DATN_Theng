import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./CardGrid.module.scss";

const cx = classNames.bind(styles);

interface ClassItem {
  id: string;
  name: string;
  teacher: string;
  chapters: number;
  students: number;
  progress: number;
  icon: string;
}

const classes: ClassItem[] = [
  {
    id: "1",
    name: "Toán học 11",
    teacher: "Trần Thị Bình",
    chapters: 8,
    students: 42,
    progress: 65,
    icon: "lucide:ruler",
  },
  {
    id: "2",
    name: "Vật lý 11",
    teacher: "Nguyễn Hữu Đức",
    chapters: 7,
    students: 38,
    progress: 40,
    icon: "lucide:atom",
  },
  {
    id: "3",
    name: "Hóa học 11",
    teacher: "Phạm Thị Lan",
    chapters: 9,
    students: 35,
    progress: 80,
    icon: "lucide:flask-conical",
  },
  {
    id: "4",
    name: "Ngữ văn 11",
    teacher: "Hoàng Văn Minh",
    chapters: 6,
    students: 44,
    progress: 55,
    icon: "lucide:book-open",
  },
];

export default function CardGrid() {
  return (
    <div className={cx("wrapper")}>
      {classes.map((item) => (
        <div key={item.id} className={cx("card")}>
          <div className={cx("class-header")}>
            <div className={cx("icon-wrapper")}>
              <Icon icon={item.icon} aria-hidden="true" />
            </div>

            <div className={cx("class-info")}>
              <div className={cx("class-name")}>{item.name}</div>
              <div className={cx("teacher")}>{item.teacher}</div>
            </div>
          </div>

          <div className={cx("meta")}>
            <span>
              <Icon icon="lucide:library-big" aria-hidden="true" />
              {item.chapters} chương
            </span>

            <span>
              <Icon icon="lucide:users-round" aria-hidden="true" />
              {item.students} học sinh
            </span>
          </div>

          <div className={cx("progress-section")}>
            <div className={cx("progress-header")}>
              <span>Tiến độ mẫu</span>
              <span className={cx("progress-value")}>{item.progress}%</span>
            </div>

            <div className={cx("progress-bar")}>
              <div
                className={cx("progress-fill")}
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>

          <button type="button" className={cx("view-button")}>
            Xem bài giảng
            <Icon icon="lucide:arrow-right" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
