import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./DashboardGreeting.module.scss";

const cx = classNames.bind(styles);

interface DashboardGreetingProps {
  name: string;
  pendingAssignments: number;
  teachingClasses: number;
}

export default function DashboardGreeting({
  name,
  pendingAssignments,
  teachingClasses,
}: DashboardGreetingProps) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("content")}>
        <div className={cx("subtitle")}>Chào mừng trở lại,</div>

        <h2 className={cx("title")}>
          {name}
          <Icon
            className={cx("title-icon")}
            icon="lucide:book-open"
            aria-hidden="true"
          />
        </h2>

        <p className={cx("description")}>
          <strong className={cx("assignment-count")}>
            {pendingAssignments} bài
          </strong>{" "}
          đang chờ chấm •{" "}
          <strong className={cx("class-count")}>{teachingClasses} lớp</strong>{" "}
          đang dạy
        </p>
      </div>

      <Icon
        className={cx("background-icon")}
        icon="lucide:book-open"
        aria-hidden="true"
      />
    </div>
  );
}
