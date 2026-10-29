import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./List.module.scss";

const cx = classNames.bind(styles);

interface TestItem {
  id: string;
  title: string;
  subject: string;
  dateTime: string;
  duration: number;
  icon: "check" | "schedule";
  result?: string;
}

const tests: TestItem[] = [
  {
    id: "test-1",
    title: "Kiểm tra 15 phút - Chương 1",
    subject: "Toán học 11",
    dateTime: "09:00 15/12/24",
    duration: 15,
    icon: "check",
    result: "7.8/10 điểm TB",
  },
  {
    id: "test-2",
    title: "Kiểm tra giữa kỳ",
    subject: "Vật lý 11",
    dateTime: "08:00 23/12/24",
    duration: 45,
    icon: "schedule",
  },
  {
    id: "test-3",
    title: "Kiểm tra: Khảo sát hàm số và đồ thị",
    subject: "Toán học 11",
    dateTime: "12:26 26/10/26",
    duration: 45,
    icon: "check",
    result: "7/10 điểm TB",
  },
  {
    id: "test-4",
    title: "Kiểm tra: Chuyển động thẳng",
    subject: "Vật lý 11",
    dateTime: "12:26 31/10/26",
    duration: 15,
    icon: "schedule",
  },
  {
    id: "test-5",
    title: "Kiểm tra: Cân bằng phản ứng hóa học",
    subject: "Hóa học 11",
    dateTime: "12:26 1/11/26",
    duration: 15,
    icon: "schedule",
  },
  {
    id: "test-6",
    title: "Kiểm tra: Đọc hiểu văn bản",
    subject: "Ngữ văn 11",
    dateTime: "12:26 23/10/26",
    duration: 45,
    icon: "check",
    result: "8.1/10 điểm TB",
  },
  {
    id: "test-7",
    title: "Kiểm tra: Lịch sử thế giới hiện đại",
    subject: "Lịch sử 11",
    dateTime: "12:26 3/11/26",
    duration: 15,
    icon: "schedule",
  },
  {
    id: "test-8",
    title: "Kiểm tra: Địa lý tự nhiên Việt Nam",
    subject: "Địa lý 11",
    dateTime: "12:26 4/11/26",
    duration: 15,
    icon: "schedule",
  },
];

interface ListProps {
  onDetail?: (testId: string) => void;
}

export default function List({ onDetail }: ListProps) {
  return (
    <div className={cx("wrapper")}>
      {tests.map((test) => {
        const hasResult = Boolean(test.result);

        return (
          <div className={cx("stat-card")} key={test.id}>
            <div className={cx("test-icon")}>
              <Icon
                icon={
                  test.icon === "check"
                    ? "lucide:circle-check"
                    : "lucide:file-pen-line"
                }
                aria-hidden="true"
              />
            </div>

            <div className={cx("test-content")}>
              <div className={cx("test-title")}>{test.title}</div>

              <div className={cx("metadata")}>
                {test.subject} · {test.dateTime} · {test.duration} phút
              </div>
            </div>

            <span
              className={cx(
                "badge",
                hasResult ? "badge-success" : "badge-primary",
              )}
            >
              {test.result ?? "Đã lên lịch"}
            </span>

            <button
              type="button"
              className={cx("detail-button")}
              onClick={() => onDetail?.(test.id)}
            >
              Chi tiết
              <Icon icon="lucide:arrow-right" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
