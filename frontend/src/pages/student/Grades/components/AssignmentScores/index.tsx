import { Icon } from "@iconify/react";
import classNames from "classnames/bind";
import { useState } from "react";

import styles from "./AssignmentScores.module.scss";

const cx = classNames.bind(styles);

type AssignmentStatus = "graded" | "not-submitted";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  score: string | null;
  status: AssignmentStatus;
}

const assignments: Assignment[] = [
  {
    id: "assignment-1",
    title: "Bài tập chương 1 - Hàm số",
    subject: "Toán học 11",
    score: null,
    status: "not-submitted",
  },
  {
    id: "assignment-2",
    title: "Bài tập định luật Newton",
    subject: "Vật lý 11",
    score: "8.5/10",
    status: "graded",
  },
  {
    id: "assignment-3",
    title: "Thí nghiệm điện phân",
    subject: "Hóa học 11",
    score: null,
    status: "not-submitted",
  },
  {
    id: "assignment-4",
    title: "Bài tập đạo hàm",
    subject: "Toán học 11",
    score: "9/10",
    status: "graded",
  },
  {
    id: "assignment-5",
    title: "Luyện tập đồ thị hàm số",
    subject: "Toán học 11",
    score: "7/10",
    status: "graded",
  },
  {
    id: "assignment-6",
    title: "Bài tập gia tốc và vận tốc",
    subject: "Vật lý 11",
    score: null,
    status: "not-submitted",
  },
  {
    id: "assignment-7",
    title: "Cân bằng phản ứng hóa học",
    subject: "Hóa học 11",
    score: null,
    status: "not-submitted",
  },
  {
    id: "assignment-8",
    title: "Phân tích nhân vật trong truyện",
    subject: "Ngữ văn 11",
    score: null,
    status: "not-submitted",
  },
];

const totalItems = 22;
const pageSize = 8;
const totalPages = 3;

export default function AssignmentScores() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAssignments = assignments.filter((assignment) => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return true;
    }

    return (
      assignment.title.toLowerCase().includes(keyword) ||
      assignment.subject.toLowerCase().includes(keyword)
    );
  });

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <section className={cx("wrapper")}>
      <div className={cx("header")}>
        <h2 className={cx("title")}>Điểm bài tập</h2>

        <input
          className={cx("search")}
          type="text"
          aria-label="Tìm bài tập trong bảng điểm"
          placeholder="Tìm bài tập hoặc môn học..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className={cx("table-wrapper")}>
        <table className={cx("table")}>
          <thead>
            <tr>
              <th>Bài tập</th>
              <th>Môn</th>
              <th>Điểm</th>
              <th>Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            {filteredAssignments.map((assignment) => (
              <tr key={assignment.id}>
                <td className={cx("assignment-name")}>{assignment.title}</td>

                <td className={cx("subject")}>{assignment.subject}</td>

                <td className={cx("score")}>
                  {assignment.score ? (
                    <span
                      className={cx({
                        "score-success":
                          assignment.score === "8.5/10" ||
                          assignment.score === "9/10",
                        "score-accent": assignment.score === "7/10",
                      })}
                    >
                      {assignment.score}
                    </span>
                  ) : (
                    <span className={cx("score-empty")}>—</span>
                  )}
                </td>

                <td>
                  <span
                    className={cx("badge", {
                      "badge-success": assignment.status === "graded",
                      "badge-warning": assignment.status === "not-submitted",
                    })}
                  >
                    {assignment.status === "graded" ? "Đã chấm" : "Chưa nộp"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={cx("pagination")}>
        <p className={cx("pagination-status")} role="status">
          Hiển thị {startItem}–{endItem} / {totalItems} bài tập
        </p>

        <nav className={cx("pagination-nav")} aria-label="Phân trang bài tập">
          <button
            type="button"
            className={cx("pagination-button")}
            aria-label="Trang trước"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          >
            <Icon icon="lucide:arrow-left" aria-hidden="true" />
          </button>

          <span className={cx("page-number")}>
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            className={cx("pagination-button")}
            aria-label="Trang sau"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
          >
            <Icon icon="lucide:arrow-right" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </section>
  );
}
