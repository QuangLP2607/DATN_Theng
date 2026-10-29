import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./CardGrid.module.scss";

const cx = classNames.bind(styles);

interface CardGridProps {
  subject: string;
  teacher: string;
  students: number;
  chapters: number;
  classes: number;
  progress: number;
  icon: string;
}

export default function CardGrid({
  subject,
  teacher,
  students,
  chapters,
  classes,
  progress,
  icon,
}: CardGridProps) {
  return (
    <div className={cx("card")}>
      <div className={cx("header")}>
        <div className={cx("icon-wrapper")}>
          <Icon icon={icon} aria-hidden="true" />
        </div>

        <div className={cx("info")}>
          <div className={cx("subject")}>{subject}</div>
          <div className={cx("teacher")}>{teacher}</div>
        </div>
      </div>

      <div className={cx("badges")}>
        <span className={cx("badge", "gray")}>
          <Icon icon="lucide:users-round" aria-hidden="true" />
          {students} học sinh
        </span>

        <span className={cx("badge", "primary")}>
          <Icon icon="lucide:library-big" aria-hidden="true" />
          {chapters} chương
        </span>

        <span className={cx("badge", "success")}>
          <Icon icon="lucide:school" aria-hidden="true" />
          {classes} lớp
        </span>
      </div>

      <div className={cx("progress-wrapper")}>
        <div className={cx("progress-header")}>
          <span>Tiến độ mẫu</span>
          <span className={cx("progress-value")}>{progress}%</span>
        </div>

        <div className={cx("progress-bar")}>
          <div
            className={cx("progress-fill")}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
