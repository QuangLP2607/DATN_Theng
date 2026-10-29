import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./Content.module.scss";

const cx = classNames.bind(styles);

export default function Content() {
  return (
    <div className={cx("wrapper", "stat-card")}>
      <div className={cx("header")}>
        <div>
          <span className={cx("badge")}>Video</span>

          <h2 className={cx("title")}>Bài 1: Khái niệm hàm số</h2>

          <div className={cx("meta")}>
            Chương 1: Hàm số
            <span className={cx("separator")}>·</span>
            <Icon icon="lucide:timer" aria-hidden="true" />
            15 phút
          </div>
        </div>

        <button type="button" className={cx("completed-button")}>
          <Icon icon="lucide:check" aria-hidden="true" />
          Đã hoàn thành
        </button>
      </div>

      <div className={cx("video-placeholder")}>
        <Icon
          className={cx("video-icon")}
          icon="lucide:video"
          aria-hidden="true"
        />

        <div className={cx("video-title")}>Bài 1: Khái niệm hàm số</div>

        <p className={cx("video-description")}>
          Video chỉ là hình minh họa; chưa có tệp bài giảng trong bản demo.
        </p>
      </div>

      <div className={cx("notes")}>
        <div className={cx("notes-title")}>Ghi chú bài học</div>

        <p className={cx("notes-content")}>
          Trong bài này chúng ta sẽ tìm hiểu về bài 1: khái niệm hàm số. Nội
          dung gồm các khái niệm cơ bản, ví dụ minh họa và bài tập thực hành.
          Học sinh cần nắm vững lý thuyết trước khi làm bài tập.
        </p>
      </div>
    </div>
  );
}
