import classNames from "classnames/bind";

import styles from "./Header.module.scss";

const cx = classNames.bind(styles);

export default function Header() {
  return (
    <div className={cx("wrapper")}>
      <div>
        <h2 className={cx("title")}>Lớp học của tôi</h2>

        <p className={cx("description")}>
          Chọn một lớp để xem các bài giảng và tiến độ học tập
        </p>
      </div>
    </div>
  );
}
