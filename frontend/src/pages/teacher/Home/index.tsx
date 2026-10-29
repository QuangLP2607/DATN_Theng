import DashboardGreeting from "./components/DashboardGreeting";
import StatsGrid from "./components/StatsGrid";
import ClassesOverview from "./components/ClassesOverview";
import PendingAssignments from "./components/PendingAssignments";
import StudentProgress from "./components/StudentProgress";

import classNames from "classnames/bind";
import styles from "./home.module.scss";

const cx = classNames.bind(styles);

export default function Home() {
  return (
    <main className={cx("wrapper")}>
      <DashboardGreeting
        name="Trần Thị Bình"
        pendingAssignments={4}
        teachingClasses={16}
      />

      <StatsGrid />

      <section className={cx("overview")}>
        {" "}
        <ClassesOverview />
        <aside className={cx("sidebar")}>
          <PendingAssignments />
        </aside>
      </section>
      <StudentProgress />
    </main>
  );
}
