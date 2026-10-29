import classNames from "classnames/bind";

import styles from "./Score.module.scss";

const cx = classNames.bind(styles);

const scoreOptions = [
  "5",
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
];

export default function Score() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("score-field")}>
        <label htmlFor="score" className={cx("label")}>
          Điểm số (0 – 10)
        </label>

        <input
          id="score"
          type="number"
          min="0"
          max="10"
          step="0.1"
          placeholder="Nhập điểm..."
          className={cx("score-input")}
        />

        <div className={cx("quick-scores")}>
          {scoreOptions.map((score) => (
            <button key={score} type="button" className={cx("score-button")}>
              {score}
            </button>
          ))}
        </div>
      </div>

      <div className={cx("comment-field")}>
        <label htmlFor="comment" className={cx("label")}>
          Nhận xét
        </label>

        <textarea
          id="comment"
          rows={4}
          placeholder="Viết nhận xét cho học sinh..."
          className={cx("comment-input")}
        />
      </div>

      <div className={cx("actions")}>
        <button type="button" className={cx("secondary-button")}>
          Lưu nháp
        </button>

        <button type="button" className={cx("primary-button")} disabled>
          Xác nhận chấm điểm
        </button>
      </div>
    </div>
  );
}
