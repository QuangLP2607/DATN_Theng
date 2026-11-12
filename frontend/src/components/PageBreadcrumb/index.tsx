import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";

import styles from "./PageBreadcrumb.module.scss";

const cx = classNames.bind(styles);

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  return (
    <nav className={cx("breadcrumb")} aria-label="Điều hướng">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div
            className={cx("breadcrumb__item")}
            key={`${item.label}-${index}`}
          >
            {index > 0 && (
              <Icon
                icon="solar:alt-arrow-right-linear"
                className={cx("breadcrumb__separator")}
              />
            )}

            {item.to && !isLast ? (
              <Link to={item.to} className={cx("breadcrumb__link")}>
                {item.label}
              </Link>
            ) : (
              <span
                className={cx("breadcrumb__current")}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
