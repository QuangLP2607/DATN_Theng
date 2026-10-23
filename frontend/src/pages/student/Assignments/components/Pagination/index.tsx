import classNames from "classnames/bind";
import styles from "./Pagination.module.scss";

const cx = classNames.bind(styles);

export default function Pagination() {
  return <div className={cx("wrapper")}>Pagination</div>;
}
