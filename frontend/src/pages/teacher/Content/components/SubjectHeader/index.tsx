import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./SubjectHeader.module.scss";

const cx = classNames.bind(styles);

interface SubjectHeaderProps {
  name: string;
  studentCount: number;
  chapterCount: number;
  onAddChapter?: () => void;
  onAddLesson?: () => void;
}

export default function SubjectHeader({
  name,
  studentCount,
  chapterCount,
  onAddChapter,
  onAddLesson,
}: SubjectHeaderProps) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("subject-info")}>
        <Icon
          className={cx("subject-icon")}
          icon="lucide:ruler"
          aria-hidden="true"
        />

        <div className={cx("content")}>
          <h2 className={cx("title")}>{name}</h2>

          <div className={cx("metadata")}>
            <span className={cx("metadata-item")}>
              <Icon icon="lucide:users-round" aria-hidden="true" />
              {studentCount} HS
            </span>

            <span aria-hidden="true">·</span>

            <span className={cx("metadata-item")}>
              <Icon icon="lucide:library-big" aria-hidden="true" />
              {chapterCount} chương
            </span>
          </div>
        </div>
      </div>

      <div className={cx("actions")}>
        <button
          type="button"
          className={cx("secondary-button")}
          onClick={onAddChapter}
        >
          + Thêm chương
        </button>

        <button
          type="button"
          className={cx("primary-button")}
          onClick={onAddLesson}
        >
          + Thêm bài giảng
        </button>
      </div>
    </div>
  );
}
