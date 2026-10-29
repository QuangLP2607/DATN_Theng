import Table from "./components/Table";

import classNames from "classnames/bind";
import styles from "./Students.module.scss";

const cx = classNames.bind(styles);

export default function Students() {
  return (
    <main className={cx("wrapper")}>
      <Table />
    </main>
  );
}
