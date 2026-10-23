import classNames from "classnames/bind";
import styles from "./Content.module.scss";

const cx = classNames.bind(styles);

export default function Content() {
  return <div className={cx("wrapper")}>Content</div>;
}
