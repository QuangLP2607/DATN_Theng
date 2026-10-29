import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./DashboardGreeting.module.scss";

const cx = classNames.bind(styles);

interface DashboardGreetingProps {
  name: string;
  assignmentCount: number;
  examCount: number;
}

export default function DashboardGreeting({
  name,
  assignmentCount,
  examCount,
}: DashboardGreetingProps) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("content")}>
        <div className={cx("subtitle")}>Chào mừng trở lại,</div>

        <h2 className={cx("title")}>{name}</h2>

        <p className={cx("description")}>
          Bạn có{" "}
          <strong className={cx("assignment-count")}>
            {assignmentCount} bài tập{" "}
          </strong>
          chưa nộp và{" "}
          <strong className={cx("exam-count")}>{examCount} bài kiểm tra</strong>{" "}
          sắp tới.
        </p>
      </div>

      <Icon
        className={cx("background-icon")}
        icon="lucide:library-big"
        aria-hidden="true"
      />
    </div>
  );
}
