import List from "./components/List";

import classNames from "classnames/bind";
import styles from "./Notifications.module.scss";

const cx = classNames.bind(styles);

export default function Notifications() {
  return (
    <main className={cx("wrapper")}>
      <div className={cx("content")}>
        <List />
      </div>
    </main>
  );
}
