import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./SystemMetrics.module.scss";

const cx = classNames.bind(styles);

const metrics = [
  {
    label: "Tổng bài giảng",
    value: "2,847",
    icon: "lucide:video",
    iconClass: "indigo",
  },
  {
    label: "Lượt làm bài KT",
    value: "15,632",
    icon: "lucide:file-pen-line",
    iconClass: "green",
  },
  {
    label: "Điểm trung bình toàn hệ thống",
    value: "7.4/10",
    icon: "lucide:star",
    iconClass: "yellow",
  },
  {
    label: "Đang trực tuyến hôm nay",
    value: "423",
    icon: "lucide:circle",
    iconClass: "green",
  },
];

export default function SystemMetrics() {
  return (
    <div className={cx("wrapper")}>
      <h3 className={cx("title")}>Chỉ số hệ thống</h3>

      <div className={cx("list")}>
        {metrics.map((metric) => (
          <div className={cx("metric")} key={metric.label}>
            <div className={cx("icon", metric.iconClass)}>
              <Icon icon={metric.icon} aria-hidden="true" />
            </div>

            <span className={cx("label")}>{metric.label}</span>

            <span className={cx("value", metric.iconClass)}>
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
