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
    value: "16",
    label: "Lớp đang dạy",
    icon: "lucide:school",
    color: "green",
  },
  {
    value: "16",
    label: "Tổng học sinh",
    icon: "lucide:users-round",
    color: "indigo",
  },
  {
    value: "4",
    label: "Bài chờ chấm",
    icon: "lucide:circle-check",
    color: "orange",
  },
  {
    value: "7.6",
    suffix: "/10",
    label: "Điểm TB lớp",
    icon: "lucide:chart-column",
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
