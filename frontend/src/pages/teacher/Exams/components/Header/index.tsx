import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./Header.module.scss";

const cx = classNames.bind(styles);

interface HeaderProps {
  testCount?: number;
  onCreate?: () => void;
}

export default function Header({ testCount = 18, onCreate }: HeaderProps) {
  return (
    <div className={cx("wrapper")}>
      <div>
        <h2 className={cx("title")}>Bài kiểm tra</h2>

        <p className={cx("description")}>
          {testCount} lịch kiểm tra · Theo dõi kết quả các lớp
        </p>
      </div>

      <button type="button" className={cx("create-button")} onClick={onCreate}>
        <Icon icon="lucide:file-pen-line" aria-hidden="true" />
        Tạo lịch kiểm tra
      </button>
    </div>
  );
}
