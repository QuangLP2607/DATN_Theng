import classNames from "classnames/bind";

import StatCard, { type StatCardColor } from "@/components/StatCard";

import styles from "./StatsGrid.module.scss";

const cx = classNames.bind(styles);

interface Stat {
  value: string;
  suffix?: string;
  label: string;
  icon: string;
  color: StatCardColor;
}

const stats: Stat[] = [
  {
    value: "12",
    label: "Lớp đang học",
    icon: "lucide:school",
    color: "indigo",
  },
  {
    value: "16",
    label: "Bài tập chưa nộp",
    icon: "lucide:pencil",
    color: "orange",
  },
  {
    value: "11",
    label: "Bài KT sắp tới",
    icon: "lucide:file-pen-line",
    color: "red",
  },
  {
    value: "8.1",
    suffix: "/10",
    label: "Điểm TB",
    icon: "lucide:star",
    color: "yellow",
  },
];

export default function StatsGrid() {
  return (
    <div className={cx("wrapper")}>
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          value={stat.value}
          suffix={stat.suffix}
          label={stat.label}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}
