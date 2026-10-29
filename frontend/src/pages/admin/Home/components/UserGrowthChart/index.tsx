import classNames from "classnames/bind";

import styles from "./UserGrowthChart.module.scss";

const cx = classNames.bind(styles);

interface GrowthData {
  month: string;
  value: number;
}

const growthData: GrowthData[] = [
  { month: "T7", value: 920 },
  { month: "T8", value: 980 },
  { month: "T9", value: 1050 },
  { month: "T10", value: 1100 },
  { month: "T11", value: 1180 },
  { month: "T12", value: 1248 },
];

const MAX_HEIGHT = 110;
const MAX_VALUE = Math.max(...growthData.map((item) => item.value));

export default function UserGrowthChart() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <h3 className={cx("title")}>Tăng trưởng người dùng</h3>

        <span className={cx("badge")}>6 tháng gần đây</span>
      </div>

      <div className={cx("chart")}>
        {growthData.map((item, index) => {
          const height = (item.value / MAX_VALUE) * MAX_HEIGHT;
          const isLast = index === growthData.length - 1;

          return (
            <div className={cx("bar-item")} key={item.month}>
              <div className={cx("value")}>{item.value}</div>

              <div
                className={cx("bar", {
                  active: isLast,
                })}
                style={{ height: `${height}px` }}
              />

              <div className={cx("month")}>{item.month}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
