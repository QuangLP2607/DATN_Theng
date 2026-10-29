import Queue from "./components/Queue";
import Detail from "./components/Detail";

import classNames from "classnames/bind";
import styles from "./Grading.module.scss";

const cx = classNames.bind(styles);

export default function Grading() {
  return (
    <main className={cx("wrapper")}>
      <Queue />
      <Detail />
    </main>
  );
}
