import classNames from "classnames/bind";
import styles from "./Toolbar.module.scss";

const cx = classNames.bind(styles);

export default function Toolbar() {
  return <div className={cx("wrapper")}>Toolbar</div>;
}
