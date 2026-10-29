import ChapterList from "./components/ChapterList";
import FileUpload from "./components/FileUpload";
import SubjectHeader from "./components/SubjectHeader";
import SubjectList from "./components/SubjectList";

import classNames from "classnames/bind";
import styles from "./Content.module.scss";

const cx = classNames.bind(styles);

export default function Content() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("content-grid")}>
        <SubjectList />

        <div className={cx("main-content")}>
          {" "}
          <SubjectHeader
            name="Toán học 11"
            studentCount={42}
            chapterCount={8}
          />
          <ChapterList />
          <FileUpload />
        </div>
      </div>
    </div>
  );
}
