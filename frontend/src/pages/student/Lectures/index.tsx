import Sidebar from "./components/Sidebar";
import Content from "./components/Content";

import classNames from "classnames/bind";
import styles from "./Lectures.module.scss";

const cx = classNames.bind(styles);

export default function Lectures() {
  return (
    <main className={cx("wrapper")}>
      <Sidebar />
      <Content />
    </main>
  );
}
