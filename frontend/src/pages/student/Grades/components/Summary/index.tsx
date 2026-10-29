import StatCard, { type StatCardVariant } from "@/components/StatCard";

import classNames from "classnames/bind";

import styles from "./Summary.module.scss";

const cx = classNames.bind(styles);

interface Stat {
  id: string;
  value: string;
  suffix: string;
  label: string;
  variant: StatCardVariant;
}

const stats: Stat[] = [
  {
    id: "average-score",
    value: "8.1",
    suffix: "/10",
    label: "Điểm TB chung",
    variant: "success",
  },
  {
    id: "graded",
    value: "6",
    suffix: " / 22",
    label: "Bài đã chấm",
    variant: "primary",
  },
  {
    id: "highest-score",
    value: "9.0",
    suffix: "/10",
    label: "Điểm cao nhất",
    variant: "success",
  },
  {
    id: "tests",
    value: "4",
    suffix: " / 15",
    label: "Bài kiểm tra",
    variant: "accent",
  },
];

export default function Summary() {
  return (
    <div className={cx("wrapper")}>
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          value={stat.value}
          suffix={stat.suffix}
          label={stat.label}
          variant={stat.variant}
        />
      ))}
    </div>
  );
}
