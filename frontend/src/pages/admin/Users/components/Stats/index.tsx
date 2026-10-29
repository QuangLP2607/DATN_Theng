import classNames from "classnames/bind";

import StatCard from "@/components/StatCard";

import styles from "./Stats.module.scss";

const cx = classNames.bind(styles);

interface StatsProps {
  totalUsers: number;
  teachers: number;
  students: number;
}

export default function Stats({ totalUsers, teachers, students }: StatsProps) {
  return (
    <div className={cx("wrapper")}>
      <StatCard value={totalUsers} label="Tổng người dùng" variant="primary" />

      <StatCard value={teachers} label="Giáo viên" variant="success" />

      <StatCard value={students} label="Học sinh" variant="primary" />
    </div>
  );
}
