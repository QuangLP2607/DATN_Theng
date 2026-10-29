import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./StatCard.module.scss";

const cx = classNames.bind(styles);

export type StatCardColor = "indigo" | "green" | "yellow" | "orange" | "red";

export type StatCardVariant = "success" | "primary" | "accent";

export interface StatCardProps {
  value: string | number;
  suffix?: string;
  label: string;

  icon?: string;
  color?: StatCardColor;

  growth?: string;
  variant?: StatCardVariant;
}

export default function StatCard({
  value,
  suffix,
  label,
  icon,
  color = "indigo",
  growth,
  variant,
}: StatCardProps) {
  return (
    <div className={cx("card", { summary: !icon })}>
      {icon && (
        <div className={cx("top")}>
          <div className={cx("icon-wrapper", color)}>
            <Icon icon={icon} aria-hidden="true" />
          </div>

          {growth && (
            <span className={cx("growth")}>
              <Icon icon="lucide:arrow-up" aria-hidden="true" />
              {growth}
            </span>
          )}
        </div>
      )}

      <div className={cx("value", icon ? color : variant)}>
        {value}

        {suffix && <span className={cx("suffix")}>{suffix}</span>}
      </div>

      <div className={cx("label")}>{label}</div>
    </div>
  );
}
