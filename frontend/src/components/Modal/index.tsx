import { useEffect, useId, type MouseEvent, type ReactNode } from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./Modal.module.scss";

const cx = classNames.bind(styles);

interface ModalProps {
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  loading?: boolean;
  success?: boolean;
  successTitle?: string;
  successDescription?: string;
  successContent?: ReactNode;
  closeOnOverlay?: boolean;
}

export default function Modal({
  title,
  description,
  children,
  onClose,
  loading = false,
  success = false,
  successTitle,
  successDescription,
  successContent,
  closeOnOverlay = false,
}: ModalProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  const currentTitle = success ? successTitle || title : title;
  const currentDescription = success ? successDescription : description;

  const handleOverlayMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlay && event.target === event.currentTarget && !loading) {
      onClose();
    }
  };

  // Khóa cuộn trang khi Modal được mở.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Đóng Modal bằng phím Escape.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [loading, onClose]);

  return (
    <div className={cx("overlay")} onMouseDown={handleOverlayMouseDown}>
      <section
        className={cx("modal")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={currentDescription ? descriptionId : undefined}
      >
        <div className={cx("header")}>
          <div className={cx("header-content")}>
            <h2 id={titleId}>{currentTitle}</h2>

            {currentDescription && (
              <p id={descriptionId}>{currentDescription}</p>
            )}
          </div>

          <button
            className={cx("close-button")}
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            disabled={loading}
          >
            <Icon icon="lucide:x" aria-hidden="true" />
          </button>
        </div>

        <div className={cx("body")}>{success ? successContent : children}</div>
      </section>
    </div>
  );
}
