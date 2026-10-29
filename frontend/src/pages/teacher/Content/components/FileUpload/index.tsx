import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import styles from "./FileUpload.module.scss";

const cx = classNames.bind(styles);

interface FileUploadProps {
  onSelectFile?: () => void;
}

export default function FileUpload({ onSelectFile }: FileUploadProps) {
  return (
    <div className={cx("wrapper")}>
      <Icon
        className={cx("upload-icon")}
        icon="lucide:cloud-upload"
        aria-hidden="true"
      />

      <div className={cx("title")}>Kéo thả để tải lên tài liệu</div>

      <div className={cx("description")}>
        Hỗ trợ PDF, DOCX, PPTX, XLSX, hình ảnh, video, âm thanh
      </div>

      <button type="button" className={cx("button")} onClick={onSelectFile}>
        Chọn file
      </button>
    </div>
  );
}
