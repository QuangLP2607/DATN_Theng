import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./Header.module.scss";

const cx = classNames.bind(styles);

interface HeaderProps {
  subjectCode: string;
  subjectTitle: string;
  subjectIcon?: string | null;
  gradeLabel: string;
  onBack: () => void;
}

const DEFAULT_ICON = "solar:book-2-linear";

export default function Header({
  subjectCode,
  subjectTitle,
  subjectIcon,
  gradeLabel,
  onBack,
}: HeaderProps) {
  return (
    <section className={cx("header")}>
      <div className={cx("header__main")}>
        <div className={cx("header__icon")}>
          <Icon icon={subjectIcon || DEFAULT_ICON} />
        </div>

        <div className={cx("header__info")}>
          <div className={cx("header__eyebrow")}>
            <span>{subjectCode}</span>
            <span className={cx("header__dot")} />
            <span>{gradeLabel}</span>
          </div>

          <h1>{subjectTitle}</h1>

          <p>
            Quản lý các khóa học và nội dung giảng dạy cho{" "}
            {gradeLabel.toLowerCase()}.
          </p>
        </div>
      </div>

      <button type="button" className={cx("back-button")} onClick={onBack}>
        <Icon icon="lucide:arrow-left" />
        <span>Danh sách môn học</span>
      </button>
    </section>
  );
}
