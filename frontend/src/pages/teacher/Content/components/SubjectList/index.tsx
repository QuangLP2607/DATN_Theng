import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./SubjectList.module.scss";

const cx = classNames.bind(styles);

interface Subject {
  id: string;
  name: string;
  chapters: number;
  icon: string;
}

const subjects: Subject[] = [
  {
    id: "c1",
    name: "Toán học 11",
    chapters: 8,
    icon: "lucide:ruler",
  },
  {
    id: "c2",
    name: "Vật lý 11",
    chapters: 7,
    icon: "lucide:atom",
  },
  {
    id: "c3",
    name: "Hóa học 11",
    chapters: 9,
    icon: "lucide:flask-conical",
  },
  {
    id: "c4",
    name: "Ngữ văn 11",
    chapters: 6,
    icon: "lucide:book-open",
  },
  {
    id: "c5",
    name: "Lịch sử 11",
    chapters: 5,
    icon: "lucide:landmark",
  },
  {
    id: "c6",
    name: "Địa lý 11",
    chapters: 6,
    icon: "lucide:earth",
  },
  {
    id: "c7",
    name: "Sinh học 11",
    chapters: 8,
    icon: "lucide:flask-conical",
  },
  {
    id: "c8",
    name: "Tiếng Anh 11",
    chapters: 10,
    icon: "lucide:book-open",
  },
  {
    id: "c9",
    name: "Tin học 11",
    chapters: 7,
    icon: "lucide:clipboard-list",
  },
  {
    id: "c10",
    name: "Giáo dục kinh tế và pháp luật 11",
    chapters: 6,
    icon: "lucide:school",
  },
  {
    id: "c11",
    name: "Công nghệ 11",
    chapters: 7,
    icon: "lucide:settings",
  },
  {
    id: "c12",
    name: "Giáo dục thể chất 11",
    chapters: 5,
    icon: "lucide:trophy",
  },
];

interface SubjectListProps {
  selectedSubject?: string;
  onSubjectChange?: (subjectId: string) => void;
  onAddSubject?: () => void;
}

export default function SubjectList({
  selectedSubject = "c1",
  onSubjectChange,
  onAddSubject,
}: SubjectListProps) {
  return (
    <div className={cx("stat-card")}>
      <h3 className={cx("title")}>Môn học</h3>

      <div className={cx("subject-list")}>
        {subjects.map((subject) => {
          const isSelected = subject.id === selectedSubject;

          return (
            <button
              type="button"
              className={cx("subject-item", {
                selected: isSelected,
              })}
              key={subject.id}
              onClick={() => onSubjectChange?.(subject.id)}
            >
              <Icon
                className={cx("subject-icon")}
                icon={subject.icon}
                aria-hidden="true"
              />

              <span className={cx("subject-info")}>
                <span className={cx("subject-name")}>{subject.name}</span>
                <span className={cx("chapter-count")}>
                  {subject.chapters} chương
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className={cx("footer")}>
        <button
          type="button"
          className={cx("add-button")}
          onClick={onAddSubject}
        >
          + Thêm môn học
        </button>
      </div>
    </div>
  );
}
