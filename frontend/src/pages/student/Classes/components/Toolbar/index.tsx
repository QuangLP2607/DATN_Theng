import classNames from "classnames/bind";

import styles from "./Toolbar.module.scss";

const cx = classNames.bind(styles);

interface ToolbarProps {
  searchValue?: string;
  subjectValue?: string;
  resultValue?: string;
  onSearchChange?: (value: string) => void;
  onSubjectChange?: (value: string) => void;
  onResultChange?: (value: string) => void;
}

const subjects = [
  { value: "all", label: "Tất cả môn học" },
  { value: "c1", label: "Toán học 11" },
  { value: "c2", label: "Vật lý 11" },
  { value: "c3", label: "Hóa học 11" },
  { value: "c4", label: "Ngữ văn 11" },
  { value: "c5", label: "Lịch sử 11" },
  { value: "c6", label: "Địa lý 11" },
  { value: "c7", label: "Sinh học 11" },
  { value: "c8", label: "Tiếng Anh 11" },
  { value: "c9", label: "Tin học 11" },
  { value: "c10", label: "Giáo dục kinh tế và pháp luật 11" },
  { value: "c11", label: "Công nghệ 11" },
  { value: "c12", label: "Giáo dục thể chất 11" },
];

export default function Toolbar({
  searchValue = "",
  subjectValue = "all",
  resultValue = "all",
  onSearchChange,
  onSubjectChange,
  onResultChange,
}: ToolbarProps) {
  return (
    <div className={cx("wrapper")}>
      <input
        type="text"
        className={cx("search-input")}
        aria-label="Tìm bài kiểm tra"
        placeholder="Tìm theo tên bài hoặc môn học..."
        value={searchValue}
        onChange={(event) => onSearchChange?.(event.target.value)}
      />

      <select
        className={cx("select")}
        aria-label="Lọc môn học"
        value={subjectValue}
        onChange={(event) => onSubjectChange?.(event.target.value)}
      >
        {subjects.map((subject) => (
          <option key={subject.value} value={subject.value}>
            {subject.label}
          </option>
        ))}
      </select>

      <select
        className={cx("select")}
        aria-label="Lọc kết quả"
        value={resultValue}
        onChange={(event) => onResultChange?.(event.target.value)}
      >
        <option value="all">Mọi kết quả</option>
        <option value="graded">Đã có điểm</option>
        <option value="pending">Chưa có điểm</option>
      </select>
    </div>
  );
}
