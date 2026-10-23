import classNames from "classnames/bind";
import styles from "./ExamScores.module.scss";

const cx = classNames.bind(styles);

export default function ExamScores() {
  return <div className={cx("wrapper")}>ExamScores</div>;
}
