import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./ChapterList.module.scss";

const cx = classNames.bind(styles);

interface Lesson {
  id: string;
  title: string;
  duration: number;
  type: "video" | "slide" | "pdf";
  published: boolean;
}

interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

const chapters: Chapter[] = [
  {
    id: "chapter-1",
    title: "Chương 1: Hàm số",
    lessons: [
      {
        id: "lesson-1",
        title: "Bài 1: Khái niệm hàm số",
        duration: 15,
        type: "video",
        published: true,
      },
      {
        id: "lesson-2",
        title: "Bài 2: Đồ thị hàm số",
        duration: 20,
        type: "video",
        published: true,
      },
      {
        id: "lesson-3",
        title: "Bài 3: Hàm đồng biến, nghịch biến",
        duration: 18,
        type: "slide",
        published: false,
      },
    ],
  },
  {
    id: "chapter-2",
    title: "Chương 2: Đạo hàm",
    lessons: [
      {
        id: "lesson-4",
        title: "Bài 1: Định nghĩa đạo hàm",
        duration: 22,
        type: "video",
        published: false,
      },
      {
        id: "lesson-5",
        title: "Bài 2: Quy tắc tính đạo hàm",
        duration: 25,
        type: "pdf",
        published: false,
      },
      {
        id: "lesson-6",
        title: "Bài 3: Ứng dụng đạo hàm",
        duration: 20,
        type: "video",
        published: false,
      },
    ],
  },
];

interface ChapterListProps {
  onEditChapter?: (chapterId: string) => void;
  onEditLesson?: (lessonId: string) => void;
  onDeleteLesson?: (lessonId: string) => void;
}

const typeIcons: Record<Lesson["type"], string> = {
  video: "lucide:video",
  slide: "lucide:chart-column",
  pdf: "lucide:file-text",
};

export default function ChapterList({
  onEditChapter,
  onEditLesson,
  onDeleteLesson,
}: ChapterListProps) {
  return (
    <div className={cx("wrapper")}>
      {chapters.map((chapter) => (
        <div className={cx("stat-card")} key={chapter.id}>
          <div className={cx("chapter-header")}>
            <h4 className={cx("chapter-title")}>{chapter.title}</h4>

            <div className={cx("chapter-actions")}>
              <span className={cx("badge", "badge-gray")}>
                {chapter.lessons.length} bài
              </span>

              <button
                type="button"
                className={cx("chapter-edit-button")}
                onClick={() => onEditChapter?.(chapter.id)}
              >
                <Icon icon="lucide:pencil" aria-hidden="true" />
                Sửa
              </button>
            </div>
          </div>

          <div className={cx("lesson-list")}>
            {chapter.lessons.map((lesson) => (
              <div className={cx("lesson-item")} key={lesson.id}>
                <div
                  className={cx(
                    "lesson-icon",
                    lesson.type === "pdf" && "lesson-icon-pdf",
                    lesson.type === "slide" && "lesson-icon-slide",
                  )}
                >
                  <Icon icon={typeIcons[lesson.type]} aria-hidden="true" />
                </div>

                <div className={cx("lesson-content")}>
                  <div className={cx("lesson-title")}>{lesson.title}</div>

                  <div className={cx("lesson-meta")}>
                    <span className={cx("duration")}>
                      <Icon icon="lucide:timer" aria-hidden="true" />
                      {lesson.duration} phút
                    </span>

                    <span className={cx("lesson-type")}>{lesson.type}</span>
                  </div>
                </div>

                <div className={cx("lesson-actions")}>
                  <span
                    className={cx(
                      "badge",
                      lesson.published ? "badge-success" : "badge-gray",
                    )}
                  >
                    {lesson.published ? "Đã xuất bản" : "Nháp"}
                  </span>

                  <button
                    type="button"
                    className={cx("action-button")}
                    aria-label={`Sửa ${lesson.title}`}
                    onClick={() => onEditLesson?.(lesson.id)}
                  >
                    <Icon icon="lucide:pencil" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    className={cx("action-button", "delete-button")}
                    aria-label={`Xóa ${lesson.title}`}
                    onClick={() => onDeleteLesson?.(lesson.id)}
                  >
                    <Icon icon="lucide:trash-2" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
