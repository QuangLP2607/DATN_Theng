import classNames from "classnames/bind";
import styles from "./home.module.scss";
import Sheet from "@/features/spreadsheet/components/Sheet";

const cx = classNames.bind(styles);

export default function Home() {
  return (
    <div className={cx("wrapper")}>
      <Sheet />
    </div>
  );
}
