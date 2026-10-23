import classNames from "classnames/bind";
import styles from "./Summary.module.scss";

const cx = classNames.bind(styles);

export default function Summary() {
  return <div className={cx("wrapper")}>Summary</div>;
}
