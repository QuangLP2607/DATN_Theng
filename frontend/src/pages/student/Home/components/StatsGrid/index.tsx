import classNames from "classnames/bind";
import styles from "./StatsGrid.module.scss";

const cx = classNames.bind(styles);

export default function StatsGrid() {
  return <div className={cx("wrapper")}>StatsGrid</div>;
}
