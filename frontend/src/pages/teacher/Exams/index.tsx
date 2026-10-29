import Header from "./components/Header";
import List from "./components/List";
import Pagination from "./components/Pagination";
import Toolbar from "./components/Toolbar";

import classNames from "classnames/bind";
import styles from "./Exams.module.scss";

const cx = classNames.bind(styles);

export default function Exams() {
  return (
    <main className={cx("wrapper")}>
      <Header />
      <Toolbar />
      <List />
      <Pagination currentPage={1} totalPages={2} totalItems={16} pageSize={8} />
    </main>
  );
}
