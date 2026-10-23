import classNames from "classnames/bind";
import styles from "./Notifications.module.scss";

const cx = classNames.bind(styles);

export default function Notifications() {
  return <div className={cx("wrapper")}>Notifications</div>;
}
