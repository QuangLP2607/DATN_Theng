import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./ClassesGrid.module.scss";

const cx = classNames.bind(styles);

interface ClassItem {
  name: string;
  students: number;
  code: string;
  teacher: string;
  icon: string;
  status: "active" | "ended";
}

const classes: ClassItem[] = [
  {
    name: "Toán học 11A",
    students: 42,
    code: "TOAN11A",
    teacher: "Trần Thị Bình",
    icon: "lucide:ruler",
    status: "active",
  },
  {
    name: "Toán học 11B",
    students: 38,
    code: "TOAN11B",
    teacher: "Trần Thị Bình",
    icon: "lucide:ruler",
    status: "active",
  },
  {
    name: "Hóa học 11",
    students: 35,
    code: "HOA11",
    teacher: "Phạm Thị Lan",
    icon: "lucide:flask-conical",
    status: "ended",
  },
  {
    name: "Vật lý 11A",
    students: 38,
    code: "LY11A",
    teacher: "Nguyễn Hữu Đức",
    icon: "lucide:atom",
    status: "active",
  },
  {
    name: "Vật lý 11B",
    students: 37,
    code: "LY11B",
    teacher: "Nguyễn Hữu Đức",
    icon: "lucide:atom",
    status: "active",
  },
  {
    name: "Hóa học 11B",
    students: 33,
    code: "HOA11B",
    teacher: "Phạm Thị Lan",
    icon: "lucide:flask-conical",
    status: "active",
  },
  {
    name: "Ngữ văn 11A",
    students: 44,
    code: "VAN11A",
    teacher: "Hoàng Văn Minh",
    icon: "lucide:book-open",
    status: "active",
  },
  {
    name: "Lịch sử 11A",
    students: 30,
    code: "SU11A",
    teacher: "Vũ Thị Thu",
    icon: "lucide:landmark",
    status: "active",
  },
];

export default function ClassesGrid() {
  return (
    <div className={cx("wrapper")}>
      {classes.map((item) => (
        <div className={cx("stat-card")} key={item.code}>
          <div className={cx("class-icon")}>
            <Icon icon={item.icon} aria-hidden="true" />
          </div>

          <div className={cx("class-info")}>
            <div className={cx("class-name")}>{item.name}</div>

            <div className={cx("metadata")}>
              <span className={cx("student-count")}>
                <Icon icon="lucide:users-round" aria-hidden="true" />
                {item.students} học sinh
              </span>

              <span className={cx("code")}>Mã: {item.code}</span>

              <span>{item.teacher}</span>
            </div>
          </div>

          <div className={cx("actions")}>
            <span
              className={cx(
                "badge",
                item.status === "active" ? "badge-success" : "badge-gray",
              )}
            >
              {item.status === "active" ? "Đang học" : "Kết thúc"}
            </span>

            <button type="button" className={cx("manage-button")}>
              Quản lý
              <Icon icon="lucide:arrow-right" aria-hidden="true" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
