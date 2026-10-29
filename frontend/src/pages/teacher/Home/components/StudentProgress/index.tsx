import classNames from "classnames/bind";

import styles from "./StudentProgress.module.scss";

const cx = classNames.bind(styles);

interface Student {
  initials: string;
  name: string;
  email: string;
  progress: number;
  averageScore: number;
  status: "Đang học" | "Không HĐ";
}

const students: Student[] = [
  {
    initials: "LC",
    name: "Lê Minh Cường",
    email: "cuong@edu.vn",
    progress: 65,
    averageScore: 8.2,
    status: "Đang học",
  },
  {
    initials: "PD",
    name: "Phạm Thị Dung",
    email: "dung@edu.vn",
    progress: 80,
    averageScore: 9.1,
    status: "Đang học",
  },
  {
    initials: "HE",
    name: "Hoàng Văn Em",
    email: "em@edu.vn",
    progress: 45,
    averageScore: 6.5,
    status: "Đang học",
  },
  {
    initials: "NP",
    name: "Nguyễn Thị Phương",
    email: "phuong@edu.vn",
    progress: 90,
    averageScore: 9.8,
    status: "Đang học",
  },
  {
    initials: "TQ",
    name: "Trần Văn Quân",
    email: "quan@edu.vn",
    progress: 30,
    averageScore: 5.5,
    status: "Không HĐ",
  },
  {
    initials: "VR",
    name: "Vũ Thị Rơi",
    email: "roi@edu.vn",
    progress: 70,
    averageScore: 7.8,
    status: "Đang học",
  },
  {
    initials: "ML",
    name: "Mai Thị Linh",
    email: "linh@edu.vn",
    progress: 45,
    averageScore: 6.4,
    status: "Đang học",
  },
];

export default function StudentProgress() {
  return (
    <div className={cx("stat-card")}>
      <div className={cx("header")}>
        <h3 className={cx("title")}>Tiến độ học sinh</h3>

        <div className={cx("header-actions")}>
          <span className={cx("average")}>
            TB lớp: <strong>65%</strong>
          </span>

          <button className={cx("detail-button")}>Chi tiết</button>
        </div>
      </div>

      <div className={cx("table-wrapper")}>
        <table className={cx("table")}>
          <thead>
            <tr>
              <th>Học sinh</th>
              <th>Email</th>
              <th>Tiến độ</th>
              <th>Điểm TB</th>
              <th>Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr className={cx("table-row")} key={student.email}>
                <td>
                  <div className={cx("student")}>
                    <div className={cx("avatar")}>{student.initials}</div>

                    <span className={cx("student-name")}>{student.name}</span>
                  </div>
                </td>

                <td>
                  <span className={cx("email")}>{student.email}</span>
                </td>

                <td>
                  <div className={cx("progress")}>
                    <div className={cx("progress-bar")}>
                      <div
                        className={cx("progress-fill")}
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>

                    <span className={cx("progress-value")}>
                      {student.progress}%
                    </span>
                  </div>
                </td>

                <td>
                  <span
                    className={cx(
                      "score",
                      student.averageScore >= 8
                        ? "score-good"
                        : student.averageScore < 7
                          ? "score-low"
                          : "score-average",
                    )}
                  >
                    {student.averageScore}
                  </span>
                </td>

                <td>
                  <span
                    className={cx(
                      "status",
                      student.status === "Đang học"
                        ? "status-active"
                        : "status-inactive",
                    )}
                  >
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
