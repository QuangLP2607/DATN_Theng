import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./DashboardGreeting.module.scss";

const cx = classNames.bind(styles);

interface DashboardGreetingProps {
  name: string;
}

export default function DashboardGreeting({ name }: DashboardGreetingProps) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("content")}>
        <div className={cx("subtitle")}>Chào mừng bạn trở lại,</div>

        <h2 className={cx("title")}>{name}</h2>

        <p className={cx("description")}>
          Theo dõi và quản lý toàn bộ hoạt động của hệ thống tại đây.
        </p>
      </div>

      <Icon
        className={cx("background-icon")}
        icon="lucide:shield-check"
        aria-hidden="true"
      />
    </div>
  );
}
