import { Icon } from "@iconify/react";
import classNames from "classnames/bind";
import styles from "./UpcomingDeadlines.module.scss";

const cx = classNames.bind(styles);

const deadlines = [
  {
    title: "Bài tập chương 1 - Hàm số",
    date: "2024-12-20",
  },
  {
    title: "Thí nghiệm điện phân",
    date: "2024-12-22",
  },
  {
    title: "Bài tập gia tốc và vận tốc",
    date: "2026-10-30",
  },
  {
    title: "Cân bằng phản ứng hóa học",
    date: "2026-10-31",
  },
  {
    title: "Phân tích nhân vật trong truyện",
    date: "2026-11-01",
  },
  {
    title: "Dòng thời gian lịch sử hiện đại",
    date: "2026-11-02",
  },
  {
    title: "Bài tập giới hạn dãy số",
    date: "2026-11-04",
  },
  {
    title: "Lực ma sát trong đời sống",
    date: "2026-11-05",
  },
  {
    title: "Tính nồng độ dung dịch",
    date: "2026-11-06",
  },
  {
    title: "Viết đoạn văn nghị luận",
    date: "2026-11-07",
  },
  {
    title: "Khí hậu và thời tiết",
    date: "2026-11-09",
  },
  {
    title: "Ứng dụng đạo hàm tìm cực trị",
    date: "2026-11-10",
  },
  {
    title: "Các định luật Newton",
    date: "2026-11-11",
  },
  {
    title: "Tốc độ phản ứng",
    date: "2026-11-12",
  },
  {
    title: "Thế giới sau năm 1945",
    date: "2026-11-14",
  },
  {
    title: "Phân bố dân cư Việt Nam",
    date: "2026-11-15",
  },
];

export default function UpcomingDeadlines() {
  return (
    <div className={cx("wrapper")}>
      <h3 className={cx("title")}>Hạn nộp sắp đến</h3>

      <div className={cx("list")}>
        {deadlines.map((deadline) => (
          <div className={cx("deadline")} key={deadline.title}>
            <div className={cx("deadline-title")}>{deadline.title}</div>

            <div className={cx("deadline-date")}>
              <Icon icon="lucide:calendar-days" aria-hidden="true" />
              <span>{deadline.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
