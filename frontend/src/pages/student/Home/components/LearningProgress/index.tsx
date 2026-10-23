import classNames from "classnames/bind";
import styles from "./LearningProgress.module.scss";

const cx = classNames.bind(styles);

export default function LearningProgress() {
  return <div className={cx("wrapper")}>LearningProgress</div>;
}
