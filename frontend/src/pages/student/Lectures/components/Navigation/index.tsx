import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./Navigation.module.scss";

const cx = classNames.bind(styles);

interface NavigationProps {
  hasPrevious?: boolean;
  hasNext?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
}

export default function Navigation({
  hasPrevious = false,
  hasNext = true,
  onPrevious,
  onNext,
}: NavigationProps) {
  return (
    <div className={cx("wrapper")}>
      <button
        type="button"
        className={cx("button", "previous")}
        disabled={!hasPrevious}
        onClick={onPrevious}
      >
        <Icon icon="lucide:arrow-left" aria-hidden="true" />
        Bài trước
      </button>

      <button
        type="button"
        className={cx("button", "next")}
        disabled={!hasNext}
        onClick={onNext}
      >
        Bài tiếp theo
        <Icon icon="lucide:arrow-right" aria-hidden="true" />
      </button>
    </div>
  );
}
