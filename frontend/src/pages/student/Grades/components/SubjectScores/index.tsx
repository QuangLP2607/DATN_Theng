import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./SubjectScores.module.scss";

const cx = classNames.bind(styles);

interface SubjectScore {
  id: string;
  name: string;
  score: number | null;
  icon: string;
}

const subjectScores: SubjectScore[] = [
  {
    id: "math",
    name: "Toán học 11",
    score: 8,
    icon: "lucide:ruler",
  },
  {
    id: "physics",
    name: "Vật lý 11",
    score: 8.5,
    icon: "lucide:atom",
  },
  {
    id: "chemistry",
    name: "Hóa học 11",
    score: null,
    icon: "lucide:flask-conical",
  },
  {
    id: "literature",
    name: "Ngữ văn 11",
    score: 7,
    icon: "lucide:book-open",
  },
  {
    id: "history",
    name: "Lịch sử 11",
    score: 8,
    icon: "lucide:landmark",
  },
  {
    id: "geography",
    name: "Địa lý 11",
    score: 9,
    icon: "lucide:earth",
  },
  {
    id: "biology",
    name: "Sinh học 11",
    score: null,
    icon: "lucide:flask-conical",
  },
  {
    id: "english",
    name: "Tiếng Anh 11",
    score: null,
    icon: "lucide:book-open",
  },
  {
    id: "informatics",
    name: "Tin học 11",
    score: null,
    icon: "lucide:clipboard-list",
  },
  {
    id: "economics-law",
    name: "Giáo dục kinh tế và pháp luật 11",
    score: null,
    icon: "lucide:school",
  },
  {
    id: "technology",
    name: "Công nghệ 11",
    score: null,
    icon: "lucide:settings",
  },
  {
    id: "physical-education",
    name: "Giáo dục thể chất 11",
    score: null,
    icon: "lucide:trophy",
  },
];

export default function SubjectScores() {
  return (
    <section className={cx("wrapper")}>
      <h2 className={cx("title")}>Điểm theo môn</h2>

      <div className={cx("grid")}>
        {subjectScores.map((subject) => (
          <div className={cx("item")} key={subject.id}>
            <Icon
              className={cx("icon")}
              icon={subject.icon}
              aria-hidden="true"
            />

            <div className={cx("content")}>
              <div className={cx("subject-name")}>{subject.name}</div>

              <div
                className={cx("score", {
                  success: subject.score !== null && subject.score >= 8,
                  accent: subject.score !== null && subject.score < 8,
                  empty: subject.score === null,
                })}
              >
                {subject.score !== null
                  ? `${subject.score.toFixed(1)}/10`
                  : "Chưa có"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
