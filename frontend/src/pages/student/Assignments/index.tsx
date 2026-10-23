import CardGrid from "./components/CardGrid";
import Toolbar from "./components/Toolbar";
import Pagination from "./components/Pagination";

import classNames from "classnames/bind";
import styles from "./Assignments.module.scss";

const cx = classNames.bind(styles);

export default function Assignments() {
  return (
    <main className={cx("wrapper")}>
      <Toolbar />

      <CardGrid />

      <Pagination />
    </main>
  );
}
