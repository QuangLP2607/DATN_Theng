import Sidebar from "./components/Sidebar";
import Content from "./components/Content";
import Navigation from "./components/Navigation";

import classNames from "classnames/bind";
import styles from "./Lectures.module.scss";

const cx = classNames.bind(styles);

export default function Lectures() {
  return (
    <main className={cx("wrapper")}>
      <Sidebar />
      <div>
        <Content />
        <Navigation />
      </div>
    </main>
  );
}
