import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./ExamScores.module.scss";

const cx = classNames.bind(styles);

interface Exam {
  id: string;
  title: string;
  subject: string;
  duration: number;
  questions: number;
  score: number | null;
}

const exams: Exam[] = [
  {
    id: "exam-1",
    title: "Kiểm tra 15 phút - Chương 1",
    subject: "Toán học 11",
    duration: 15,
    questions: 5,
    score: null,
  },
  {
    id: "exam-2",
    title: "Kiểm tra 1 tiết - Động lực học",
    subject: "Vật lý 11",
    duration: 45,
    questions: 30,
    score: 8,
  },
  {
    id: "exam-3",
    title: "Kiểm tra giữa kỳ",
    subject: "Hóa học 11",
    duration: 60,
    questions: 40,
    score: null,
  },
  {
    id: "exam-4",
    title: "Kiểm tra: Ôn tập đạo hàm",
    subject: "Toán học 11",
    duration: 15,
    questions: 10,
    score: 7,
  },
];

export default function ExamScores() {
  return (
    <section className={cx("wrapper")}>
      <h2 className={cx("title")}>Điểm kiểm tra</h2>

      <div className={cx("list")}>
        {exams.map((exam) => {
          const isGraded = exam.score !== null;
          const scoreClass =
            exam.score !== null && exam.score < 8
              ? "score-accent"
              : "score-success";

          return (
            <div className={cx("item")} key={exam.id}>
              <div className={cx("icon-wrapper")}>
                <Icon
                  icon={
                    isGraded ? "lucide:circle-check" : "lucide:file-pen-line"
                  }
                  aria-hidden="true"
                />
              </div>

              <div className={cx("content")}>
                <div className={cx("name")}>{exam.title}</div>

                <div className={cx("meta")}>
                  {exam.subject} · {exam.duration} phút · {exam.questions} câu
                </div>
              </div>

              {isGraded ? (
                <div className={cx("score", scoreClass)}>
                  {exam.score}
                  <span>/10</span>
                </div>
              ) : (
                <span className={cx("badge")}>Chưa có điểm</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
