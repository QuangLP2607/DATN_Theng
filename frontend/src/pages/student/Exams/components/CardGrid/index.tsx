import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./CardGrid.module.scss";

const cx = classNames.bind(styles);

type TestStatus = "available" | "unavailable" | "completed";

interface Test {
  id: string;
  title: string;
  subject: string;
  duration: number;
  questions: number;
  attempts: number;
  scheduledAt: string;
  status: TestStatus;
  score?: string;
}

const tests: Test[] = [
  {
    id: "test-1",
    title: "Kiểm tra 15 phút - Chương 1",
    subject: "Toán học 11",
    duration: 15,
    questions: 5,
    attempts: 1,
    scheduledAt: "2024-12-21 10:00",
    status: "available",
  },
  {
    id: "test-2",
    title: "Kiểm tra 1 tiết - Động lực học",
    subject: "Vật lý 11",
    duration: 45,
    questions: 20,
    attempts: 2,
    scheduledAt: "2026-10-31 09:00",
    status: "unavailable",
  },
  {
    id: "test-3",
    title: "Kiểm tra: Dung dịch và nồng độ",
    subject: "Hóa học 11",
    duration: 15,
    questions: 10,
    attempts: 1,
    scheduledAt: "2026-11-01 09:00",
    status: "unavailable",
  },
  {
    id: "test-4",
    title: "Kiểm tra: Đọc hiểu văn bản",
    subject: "Ngữ văn 11",
    duration: 45,
    questions: 30,
    attempts: 2,
    scheduledAt: "2026-11-02 09:00",
    status: "unavailable",
  },
  {
    id: "test-5",
    title: "Kiểm tra: Lịch sử thế giới hiện đại",
    subject: "Lịch sử 11",
    duration: 15,
    questions: 10,
    attempts: 1,
    scheduledAt: "",
    status: "completed",
    score: "8/10",
  },
];

const statusIcons: Record<TestStatus, string> = {
  available: "lucide:file-pen-line",
  unavailable: "lucide:circle-check",
  completed: "lucide:file-pen-line",
};

export default function CardGrid() {
  return (
    <div className={cx("wrapper")}>
      {tests.map((test) => (
        <div className={cx("item")} key={test.id}>
          <div className={cx("info")}>
            <div
              className={cx("icon-wrapper", {
                success:
                  test.status === "completed" || test.status === "unavailable",
              })}
            >
              <Icon
                className={cx("test-icon")}
                icon={statusIcons[test.status]}
                aria-hidden="true"
              />
            </div>

            <div className={cx("content")}>
              <div className={cx("title")}>{test.title}</div>

              <div className={cx("metadata")}>
                <span>
                  <Icon icon="lucide:library-big" aria-hidden="true" />
                  {test.subject}
                </span>

                <span>
                  <Icon icon="lucide:timer" aria-hidden="true" />
                  {test.duration} phút
                </span>

                <span>
                  <Icon icon="lucide:circle-question-mark" aria-hidden="true" />
                  {test.questions} câu
                </span>

                <span>
                  <Icon icon="lucide:repeat-2" aria-hidden="true" />
                  Tối đa {test.attempts} lần
                </span>
              </div>

              {test.scheduledAt && (
                <div className={cx("schedule")}>
                  <Icon icon="lucide:calendar-days" aria-hidden="true" />
                  {test.scheduledAt}
                </div>
              )}
            </div>
          </div>

          <div className={cx("actions")}>
            {test.status === "available" && (
              <button type="button" className={cx("primary-button")}>
                Bắt đầu làm bài
                <Icon icon="lucide:arrow-right" aria-hidden="true" />
              </button>
            )}

            {test.status === "unavailable" && (
              <span className={cx("badge")}>Chưa có đề thi mẫu</span>
            )}

            {test.status === "completed" && (
              <>
                <span className={cx("score")}>{test.score}</span>

                <button type="button" className={cx("secondary-button")}>
                  Xem kết quả
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
