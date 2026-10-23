import AssignmentScores from "./components/AssignmentScores";
import ExamScores from "./components/ExamScores";
import SubjectScores from "./components/SubjectScores";
import Summary from "./components/Summary";

import classNames from "classnames/bind";
import styles from "./Grades.module.scss";

const cx = classNames.bind(styles);

export default function Grades() {
  return (
    <main className={cx("wrapper")}>
      <Summary />

      <section className={cx("overview")}>
        <AssignmentScores />
        <ExamScores />
      </section>

      <SubjectScores />
    </main>
  );
}
