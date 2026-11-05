import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./ErrorState.module.scss";

const cx = classNames.bind(styles);

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  loading?: boolean;
}

export default function ErrorState({
  message,
  onRetry,
  loading = false,
}: ErrorStateProps) {
  return (
    <div className={cx("overlay")} role="alert">
      <div className={cx("content")}>
        <div className={cx("icon-wrapper")}>
          <Icon icon="lucide:alert-circle" />
        </div>

        <p className={cx("message")}>{message}</p>

        <button
          type="button"
          className={cx("retry-button")}
          onClick={onRetry}
          disabled={loading}
        >
          <Icon
            icon={loading ? "lucide:loader-circle" : "lucide:refresh-cw"}
            className={loading ? cx("loading-icon") : undefined}
          />

          {loading ? "Đang thử lại..." : "Thử lại"}
        </button>
      </div>
    </div>
  );
}
