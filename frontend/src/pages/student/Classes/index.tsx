import CardGrid from "./components/CardGrid";
import Toolbar from "./components/Toolbar";
import Pagination from "./components/Pagination";
import Header from "./components/Header";

import classNames from "classnames/bind";
import styles from "./Classes.module.scss";

const cx = classNames.bind(styles);

export default function Classes() {
  return (
    <main className={cx("wrapper")}>
      <Header />
      <Toolbar />

      <CardGrid />

      <Pagination currentPage={1} totalPages={2} totalItems={16} pageSize={8} />
    </main>
  );
}
