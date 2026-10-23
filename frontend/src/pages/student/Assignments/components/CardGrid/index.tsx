import classNames from "classnames/bind";
import styles from "./CardGrid.module.scss";

const cx = classNames.bind(styles);

export default function CardGrid() {
  return <div className={cx("wrapper")}>CardGrid</div>;
}
