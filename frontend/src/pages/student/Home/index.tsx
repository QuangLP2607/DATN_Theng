import AssessmentGrid from "./components/AssessmentGrid";
import DashboardGreeting from "./components/DashboardGreeting";
import LearningProgress from "./components/LearningProgress";
import Notifications from "./components/Notifications";
import StatsGrid from "./components/StatsGrid";
import UpcomingDeadlines from "./components/UpcomingDeadlines";

import classNames from "classnames/bind";
import styles from "./home.module.scss";

const cx = classNames.bind(styles);

export default function Home() {
  return (
    <main className={cx("wrapper")}>
      <DashboardGreeting />

      <StatsGrid />

      <section className={cx("overview")}>
        <LearningProgress />

        <aside className={cx("sidebar")}>
          <UpcomingDeadlines />
          <Notifications />
        </aside>
      </section>

      <AssessmentGrid />
    </main>
  );
}
