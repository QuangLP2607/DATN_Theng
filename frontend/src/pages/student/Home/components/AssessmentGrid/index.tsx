import classNames from "classnames/bind";
import styles from "./AssessmentGrid.module.scss";

const cx = classNames.bind(styles);

export default function AssessmentGrid() {
  return <div className={cx("wrapper")}>AssessmentGrid</div>;
}
