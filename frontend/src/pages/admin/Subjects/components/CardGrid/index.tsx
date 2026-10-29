import classNames from "classnames/bind";

import styles from "./CardGrid.module.scss";
import ClassCard from "./ClassCard";

const cx = classNames.bind(styles);

interface ClassData {
  id: string;
  subject: string;
  teacher: string;
  students: number;
  chapters: number;
  classes: number;
  progress: number;
  icon: string;
}

const classes: ClassData[] = [
  {
    id: "math",
    subject: "Toán học 11",
    teacher: "Trần Thị Bình",
    students: 42,
    chapters: 8,
    classes: 2,
    progress: 65,
    icon: "lucide:ruler",
  },
  {
    id: "physics",
    subject: "Vật lý 11",
    teacher: "Nguyễn Hữu Đức",
    students: 38,
    chapters: 7,
    classes: 2,
    progress: 40,
    icon: "lucide:atom",
  },
  {
    id: "chemistry",
    subject: "Hóa học 11",
    teacher: "Phạm Thị Lan",
    students: 35,
    chapters: 9,
    classes: 2,
    progress: 80,
    icon: "lucide:flask-conical",
  },
  {
    id: "literature",
    subject: "Ngữ văn 11",
    teacher: "Hoàng Văn Minh",
    students: 44,
    chapters: 6,
    classes: 2,
    progress: 48,
    icon: "lucide:book-open",
  },
  {
    id: "biology",
    subject: "Sinh học 11",
    teacher: "Đỗ Thị Hạnh",
    students: 36,
    chapters: 8,
    classes: 1,
    progress: 72,
    icon: "lucide:flask-conical",
  },
  {
    id: "english",
    subject: "Tiếng Anh 11",
    teacher: "Lê Thị Thanh",
    students: 41,
    chapters: 10,
    classes: 2,
    progress: 72,
    icon: "lucide:book-open",
  },
  {
    id: "informatics",
    subject: "Tin học 11",
    teacher: "Nguyễn Văn Khải",
    students: 32,
    chapters: 7,
    classes: 1,
    progress: 82,
    icon: "lucide:clipboard-list",
  },
];

export default function CardGrid() {
  return (
    <div className={cx("wrapper")}>
      {classes.map((item) => (
        <ClassCard
          key={item.id}
          subject={item.subject}
          teacher={item.teacher}
          students={item.students}
          chapters={item.chapters}
          classes={item.classes}
          progress={item.progress}
          icon={item.icon}
        />
      ))}
    </div>
  );
}
