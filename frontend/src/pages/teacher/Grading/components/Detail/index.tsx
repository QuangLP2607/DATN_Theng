import classNames from "classnames/bind";

import Score from "../Score";
import styles from "./Detail.module.scss";

const cx = classNames.bind(styles);

export default function Detail() {
  return (
    <div className={cx("wrapper", "stat-card")}>
      <div className={cx("header")}>
        <div>
          <h2 className={cx("title")}>Bài tập chương 1</h2>

          <div className={cx("meta")}>
            Lê Minh Cường · Toán học 11 · Nộp lúc 2024-12-17 14:32
          </div>
        </div>

        <span className={cx("badge")}>Chờ chấm</span>
      </div>

      <div className={cx("answer")}>
        <div className={cx("answer-label")}>NỘI DUNG BÀI LÀM</div>

        <div className={cx("answer-content")}>
          <p>
            Để giải bài toán này, em áp dụng công thức đạo hàm cơ bản: f'(x) =
            lim[f(x+h)-f(x)]/h khi h→0.
          </p>

          <p>Với f(x) = x² + 3x – 5, ta có:</p>

          <p>f'(x) = 2x + 3</p>

          <p>Tại x = 2: f'(2) = 2(2) + 3 = 7</p>

          <p>
            Vậy đạo hàm của hàm số tại x = 2 là <strong>7</strong>.
          </p>
        </div>
      </div>

      <Score />
    </div>
  );
}
