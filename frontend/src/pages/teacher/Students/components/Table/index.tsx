import classNames from "classnames/bind";

import styles from "./Table.module.scss";

const cx = classNames.bind(styles);

interface Student {
  id: string;
  initials: string;
  name: string;
  email: string;
  progress: number;
  average: number;
  status: "Đang học" | "Không HĐ";
}

const students: Student[] = [
  {
    id: "1",
    initials: "LC",
    name: "Lê Minh Cường",
    email: "cuong@edu.vn",
    progress: 65,
    average: 8.2,
    status: "Đang học",
  },
  {
    id: "2",
    initials: "PD",
    name: "Phạm Thị Dung",
    email: "dung@edu.vn",
    progress: 80,
    average: 9.1,
    status: "Đang học",
  },
  {
    id: "3",
    initials: "HE",
    name: "Hoàng Văn Em",
    email: "em@edu.vn",
    progress: 45,
    average: 6.5,
    status: "Đang học",
  },
  {
    id: "4",
    initials: "NP",
    name: "Nguyễn Thị Phương",
    email: "phuong@edu.vn",
    progress: 90,
    average: 9.8,
    status: "Đang học",
  },
  {
    id: "5",
    initials: "TQ",
    name: "Trần Văn Quân",
    email: "quan@edu.vn",
    progress: 30,
    average: 5.5,
    status: "Không HĐ",
  },
  {
    id: "6",
    initials: "VR",
    name: "Vũ Thị Rơi",
    email: "roi@edu.vn",
    progress: 70,
    average: 7.8,
    status: "Đang học",
  },
  {
    id: "7",
    initials: "ML",
    name: "Mai Thị Linh",
    email: "linh@edu.vn",
    progress: 45,
    average: 6.4,
    status: "Đang học",
  },
  {
    id: "8",
    initials: "NB",
    name: "Nguyễn Gia Bảo",
    email: "bao@edu.vn",
    progress: 52,
    average: 6.9,
    status: "Đang học",
  },
  {
    id: "9",
    initials: "DN",
    name: "Đặng Thị Ngọc",
    email: "ngoc@edu.vn",
    progress: 59,
    average: 7.4,
    status: "Đang học",
  },
  {
    id: "10",
    initials: "LP",
    name: "Lê Hoàng Phúc",
    email: "phuc@edu.vn",
    progress: 66,
    average: 7.9,
    status: "Đang học",
  },
  {
    id: "11",
    initials: "BT",
    name: "Bùi Thị Trang",
    email: "trang@edu.vn",
    progress: 73,
    average: 8.4,
    status: "Đang học",
  },
  {
    id: "12",
    initials: "TT",
    name: "Trần Minh Tuấn",
    email: "tuan@edu.vn",
    progress: 80,
    average: 8.9,
    status: "Không HĐ",
  },
  {
    id: "13",
    initials: "PA",
    name: "Phạm Ngọc Anh",
    email: "anh@edu.vn",
    progress: 87,
    average: 6.4,
    status: "Đang học",
  },
  {
    id: "14",
    initials: "VH",
    name: "Võ Thanh Hà",
    email: "ha.vo@edu.vn",
    progress: 94,
    average: 6.9,
    status: "Đang học",
  },
  {
    id: "15",
    initials: "DH",
    name: "Đỗ Quốc Huy",
    email: "huy@edu.vn",
    progress: 51,
    average: 7.4,
    status: "Đang học",
  },
  {
    id: "16",
    initials: "HY",
    name: "Hoàng Thị Yến",
    email: "yen@edu.vn",
    progress: 58,
    average: 7.9,
    status: "Đang học",
  },
];

function getScoreClass(score: number) {
  if (score >= 8) {
    return "high";
  }

  if (score < 7) {
    return "low";
  }

  return "medium";
}

export default function Table() {
  return (
    <div className={cx("wrapper", "stat-card")}>
      <div className={cx("table-wrapper")}>
        <table>
          <thead>
            <tr>
              <th>Học sinh</th>
              <th>Email</th>
              <th>Tiến độ</th>
              <th>Điểm TB</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>
                  <div className={cx("student")}>
                    <div className={cx("avatar")}>{student.initials}</div>

                    <span className={cx("student-name")}>{student.name}</span>
                  </div>
                </td>

                <td>
                  <span className={cx("email")}>{student.email}</span>
                </td>

                <td className={cx("progress-cell")}>
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
                    className={cx("average", getScoreClass(student.average))}
                  >
                    {student.average}
                  </span>
                </td>

                <td>
                  <span
                    className={cx("status", {
                      active: student.status === "Đang học",
                      inactive: student.status === "Không HĐ",
                    })}
                  >
                    {student.status}
                  </span>
                </td>

                <td>
                  <button type="button" className={cx("detail-button")}>
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
