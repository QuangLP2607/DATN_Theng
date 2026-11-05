import { Children, type ReactNode } from "react";
import classNames from "classnames/bind";

import styles from "./CardGrid.module.scss";

const cx = classNames.bind(styles);

interface CardGridProps {
  children: ReactNode;
}

export default function CardGrid({ children }: CardGridProps) {
  return (
    <div className={cx("card-grid")}>
      {Children.map(children, (child) => (
        <div className={cx("card-grid__item")}>{child}</div>
      ))}
    </div>
  );
}
