import classNames from "classnames/bind";
import styles from "./DashboardGreeting.module.scss";

const cx = classNames.bind(styles);

export default function DashboardGreeting() {
  return <div className={cx("wrapper")}>DashboardGreeting</div>;
}
