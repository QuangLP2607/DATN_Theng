import StatCard, { type StatCardColor } from "@/components/StatCard";

import classNames from "classnames/bind";

import styles from "./StatsGrid.module.scss";

const cx = classNames.bind(styles);

interface Stat {
  value: string;
  label: string;
  growth: string;
  icon: string;
  color: StatCardColor;
}

const stats: Stat[] = [
  {
    value: "1,248",
    label: "Tổng người dùng",
    growth: "+48 tháng này",
    icon: "lucide:user-round",
    color: "indigo",
  },
  {
    value: "86",
    label: "Giáo viên",
    growth: "+3 tháng này",
    icon: "lucide:book-open",
    color: "green",
  },
  {
    value: "1,150",
    label: "Học sinh",
    growth: "+45 tháng này",
    icon: "lucide:graduation-cap",
    color: "indigo",
  },
  {
    value: "312",
    label: "Môn học",
    growth: "+12 tháng này",
    icon: "lucide:library-big",
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
          label={stat.label}
          growth={stat.growth}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}
