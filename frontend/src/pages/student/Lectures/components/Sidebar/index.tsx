import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./Sidebar.module.scss";

const cx = classNames.bind(styles);

interface Lesson {
  id: string;
  title: string;
  duration: number;
  icon: string;
  completed: boolean;
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
        icon: "lucide:video",
        completed: true,
      },
      {
        id: "lesson-2",
        title: "Bài 2: Đồ thị hàm số",
        duration: 20,
        icon: "lucide:video",
        completed: true,
      },
      {
        id: "lesson-3",
        title: "Bài 3: Hàm đồng biến, nghịch biến",
        duration: 18,
        icon: "lucide:chart-column",
        completed: false,
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
        icon: "lucide:video",
        completed: false,
      },
      {
        id: "lesson-5",
        title: "Bài 2: Quy tắc tính đạo hàm",
        duration: 25,
        icon: "lucide:file-text",
        completed: false,
      },
      {
        id: "lesson-6",
        title: "Bài 3: Ứng dụng đạo hàm",
        duration: 20,
        icon: "lucide:video",
        completed: false,
      },
    ],
  },
  {
    id: "chapter-3",
    title: "Chương 3: Giới hạn",
    lessons: [
      {
        id: "lesson-7",
        title: "Bài 1: Giới hạn của dãy số",
        duration: 18,
        icon: "lucide:chart-column",
        completed: false,
      },
      {
        id: "lesson-8",
        title: "Bài 2: Giới hạn của hàm số",
        duration: 24,
        icon: "lucide:file-text",
        completed: false,
      },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className={cx("wrapper")}>
      <div className={cx("class-header")}>
        <Icon className={cx("class-icon")} icon="lucide:ruler" />

        <div className={cx("class-info")}>
          <div className={cx("class-name")}>Toán học 11</div>
          <div className={cx("teacher")}>Trần Thị Bình</div>
        </div>
      </div>

      <div className={cx("progress-bar")}>
        <div className={cx("progress-fill")} style={{ width: "25%" }} />
      </div>

      <div className={cx("chapters")}>
        {chapters.map((chapter) => (
          <div key={chapter.id} className={cx("chapter")}>
            <div className={cx("chapter-title")}>{chapter.title}</div>

            <div className={cx("lessons")}>
              {chapter.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={cx("lesson", {
                    active: lesson.id === "lesson-1",
                  })}
                >
                  <button
                    type="button"
                    className={cx("lesson-button")}
                    aria-current={lesson.id === "lesson-1" ? "true" : undefined}
                  >
                    <Icon
                      className={cx("lesson-icon")}
                      icon={lesson.icon}
                      aria-hidden="true"
                    />

                    <span className={cx("lesson-content")}>
                      <span className={cx("lesson-title")}>{lesson.title}</span>

                      <span className={cx("duration")}>
                        {lesson.duration} phút
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    className={cx("complete-button", {
                      completed: lesson.completed,
                    })}
                    aria-label={
                      lesson.completed
                        ? `Bỏ đánh dấu hoàn thành: ${lesson.title}`
                        : `Đánh dấu hoàn thành: ${lesson.title}`
                    }
                  >
                    <Icon
                      icon={
                        lesson.completed
                          ? "lucide:check"
                          : "lucide:circle-question-mark"
                      }
                      aria-hidden="true"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button type="button" className={cx("back-button")}>
        <Icon icon="lucide:arrow-left" aria-hidden="true" />
        Danh sách lớp học
      </button>
    </aside>
  );
}
