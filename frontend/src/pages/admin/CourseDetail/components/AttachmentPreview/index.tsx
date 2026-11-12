import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import type { LessonAttachment } from "@/interfaces/lessonAttachment";

import styles from "./AttachmentPreview.module.scss";

const cx = classNames.bind(styles);

interface AttachmentPreviewProps {
  attachment: LessonAttachment;
  onClose: () => void;
}

type PreviewType = "image" | "pdf" | "unsupported";

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];

function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function getPreviewType(fileName: string): PreviewType {
  const extension = getFileExtension(fileName);

  if (IMAGE_EXTENSIONS.includes(extension)) {
    return "image";
  }

  if (extension === "pdf") {
    return "pdf";
  }

  return "unsupported";
}

function AttachmentPreview({ attachment, onClose }: AttachmentPreviewProps) {
  const fileName = attachment.fileName || attachment.title;
  const previewType = getPreviewType(fileName);
  const fileUrl = attachment.fileUrl;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={cx("preview-backdrop")} onMouseDown={handleBackdropClick}>
      <section
        className={cx("preview")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="attachment-preview-title"
      >
        <header className={cx("preview__header")}>
          <div className={cx("preview__heading")}>
            <div className={cx("preview__icon")}>
              <Icon
                icon={
                  previewType === "image"
                    ? "solar:gallery-linear"
                    : previewType === "pdf"
                      ? "solar:file-pdf-linear"
                      : "solar:file-text-linear"
                }
              />
            </div>

            <div className={cx("preview__info")}>
              <h2 id="attachment-preview-title">{attachment.title}</h2>
              <p>{fileName}</p>
            </div>
          </div>

          <div className={cx("preview__actions")}>
            {fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className={cx("preview__open")}
              >
                <Icon icon="solar:external-link-linear" />
                Mở trong tab mới
              </a>
            )}

            <button
              type="button"
              className={cx("preview__close")}
              aria-label="Đóng xem trước"
              onClick={onClose}
            >
              <Icon icon="solar:close-circle-linear" />
            </button>
          </div>
        </header>

        <div className={cx("preview__body")}>
          {!fileUrl ? (
            <div className={cx("preview__empty")}>
              <Icon icon="solar:danger-circle-linear" />
              <h3>Không thể xem trước tài liệu</h3>
              <p>Đường dẫn file không tồn tại hoặc không hợp lệ.</p>
            </div>
          ) : previewType === "image" ? (
            <div className={cx("preview__image")}>
              <img src={fileUrl} alt={attachment.title} />
            </div>
          ) : previewType === "pdf" ? (
            <iframe
              className={cx("preview__pdf")}
              src={fileUrl}
              title={`Xem trước ${attachment.title}`}
            />
          ) : (
            <div className={cx("preview__empty")}>
              <div className={cx("preview__empty-icon")}>
                <Icon icon="solar:file-text-linear" />
              </div>

              <h3>Định dạng chưa hỗ trợ xem trước</h3>

              <p>
                Bạn có thể mở tài liệu trong tab mới hoặc tải file về thiết bị
                để xem nội dung.
              </p>

              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className={cx("preview__download")}
              >
                <Icon icon="solar:download-linear" />
                Mở tài liệu
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AttachmentPreview;
