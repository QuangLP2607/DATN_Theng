import { Icon } from "@iconify/react";
import classNames from "classnames/bind";
import styles from "./AssessmentGrid.module.scss";

const cx = classNames.bind(styles);

const assessments = [
  {
    title: "Kiểm tra 15 phút - Chương 1",
    duration: "15 phút",
    questions: 10,
    status: "upcoming",
  },
  {
    title: "Kiểm tra 1 tiết - Động lực học",
    duration: "45 phút",
    questions: 30,
    status: "completed",
    score: "8/10",
  },
  {
    title: "Kiểm tra giữa kỳ",
    duration: "60 phút",
    questions: 40,
    status: "upcoming",
  },
  {
    title: "Kiểm tra: Ôn tập đạo hàm",
    duration: "15 phút",
    questions: 10,
    status: "completed",
    score: "7/10",
  },
  {
    title: "Kiểm tra: Chuyển động thẳng",
    duration: "45 phút",
    questions: 30,
    status: "upcoming",
  },
  {
    title: "Kiểm tra: Dung dịch và nồng độ",
    duration: "15 phút",
    questions: 10,
    status: "upcoming",
  },
  {
    title: "Kiểm tra: Đọc hiểu văn bản",
    duration: "45 phút",
    questions: 30,
    status: "upcoming",
  },
  {
    title: "Kiểm tra: Lịch sử thế giới hiện đại",
    duration: "15 phút",
    questions: 10,
    status: "completed",
    score: "8/10",
  },
  {
    title: "Kiểm tra: Địa lý tự nhiên Việt Nam",
    duration: "45 phút",
    questions: 30,
    status: "upcoming",
  },
];

export default function AssessmentGrid() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <h3>Bài kiểm tra</h3>

        <button type="button" className={cx("view-all")}>
          Xem tất cả
        </button>
      </div>

      <div className={cx("grid")}>
        {assessments.map((assessment) => {
          const isCompleted = assessment.status === "completed";

          return (
            <div
              className={cx("assessment", {
                completed: isCompleted,
              })}
              key={assessment.title}
            >
              <div className={cx("assessment-header")}>
                <Icon
                  className={cx("assessment-icon")}
                  icon={
                    isCompleted ? "lucide:circle-check" : "lucide:file-pen-line"
                  }
                  aria-hidden="true"
                />

                <span className={cx("badge", assessment.status)}>
                  {isCompleted ? "Đã làm" : "Sắp tới"}
                </span>
              </div>

              <div className={cx("assessment-title")}>{assessment.title}</div>

              <div className={cx("assessment-info")}>
                <Icon icon="lucide:timer" aria-hidden="true" />
                <span>
                  {assessment.duration} · {assessment.questions} câu
                </span>
              </div>

              {isCompleted ? (
                <div className={cx("score")}>{assessment.score}</div>
              ) : (
                <button type="button" className={cx("start-button")}>
                  Bắt đầu làm
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
