import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent, MouseEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import classNames from "classnames/bind";

import Loading from "@/components/Loading";

import type { CourseDetail as CourseDetailType } from "@/services/course";
import type { ChapterListItem } from "@/interfaces/chapter";
import type {
  LessonListItem,
  LessonDetail,
  LessonType,
} from "@/interfaces/lesson";
import type { LessonAttachment } from "@/interfaces/lessonAttachment";

import courseApi from "@/services/course";
import chapterApi, {
  type CreateChapterPayload,
  type UpdateChapterPayload,
} from "@/services/chapter";
import lessonApi, {
  type CreateLessonPayload,
  type UpdateLessonPayload,
} from "@/services/lesson";
import lessonAttachmentApi, {
  type CreateLinkAttachmentPayload,
  type UpdateAttachmentPayload,
} from "@/services/lessonAttachment";

import AttachmentPreview from "./components/AttachmentPreview";
import styles from "./CourseDetail.module.scss";

const cx = classNames.bind(styles);

type ModalType = "chapter" | "lesson" | "link" | "attachment" | null;

const LESSON_TYPES: { value: LessonType; label: string }[] = [
  { value: "VIDEO", label: "Video" },
  { value: "PDF", label: "PDF" },
  { value: "SLIDE", label: "Slide" },
  { value: "TEXT", label: "Văn bản" },
];

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Bản nháp",
  PUBLISHED: "Đã xuất bản",
  ARCHIVED: "Đã lưu trữ",
};

const LESSON_TYPE_ICONS: Record<LessonType, string> = {
  VIDEO: "solar:play-circle-linear",
  PDF: "solar:file-pdf-linear",
  SLIDE: "solar:gallery-wide-linear",
  TEXT: "solar:document-text-linear",
};

function formatFileSize(size: number | null): string {
  if (!size) return "Không rõ dung lượng";

  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  return fallback;
}

function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseDetailType | null>(null);
  const [chapters, setChapters] = useState<ChapterListItem[]>([]);
  const [lessonLists, setLessonLists] = useState<
    Record<string, LessonListItem[]>
  >({});
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<LessonDetail | null>(
    null,
  );
  const [previewAttachment, setPreviewAttachment] =
    useState<LessonAttachment | null>(null);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingChapter, setEditingChapter] = useState<ChapterListItem | null>(
    null,
  );
  const [editingLesson, setEditingLesson] = useState<LessonListItem | null>(
    null,
  );
  const [editingAttachment, setEditingAttachment] =
    useState<LessonAttachment | null>(null);

  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterDescription, setChapterDescription] = useState("");

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState<LessonType>("VIDEO");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");

  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [attachmentTitle, setAttachmentTitle] = useState("");

  const loadPage = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setPageError("");

    try {
      const [courseData, chapterData] = await Promise.all([
        courseApi.getCourseById(id),
        chapterApi.getChapters(id),
      ]);

      setCourse(courseData);
      setChapters(chapterData);
    } catch (error) {
      setPageError(getErrorMessage(error, "Không thể tải thông tin khóa học."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadPage();
  }, [loadPage]);

  const loadLessons = useCallback(async (chapterId: string) => {
    try {
      const data = await lessonApi.getLessons(chapterId);

      setLessonLists((previous) => ({
        ...previous,
        [chapterId]: data,
      }));
    } catch (error) {
      setActionError(
        getErrorMessage(error, "Không thể tải danh sách bài học."),
      );
    }
  }, []);

  const loadLessonDetail = async (lessonId: string) => {
    setActionError("");

    try {
      const data = await lessonApi.getLessonById(lessonId);
      setSelectedLesson(data);
      setPreviewAttachment(null);
    } catch (error) {
      setActionError(
        getErrorMessage(error, "Không thể tải thông tin bài học."),
      );
    }
  };

  const refreshChapters = async () => {
    if (!id) return;

    const data = await chapterApi.getChapters(id);
    setChapters(data);
  };

  const refreshLessons = async (chapterId: string) => {
    const data = await lessonApi.getLessons(chapterId);

    setLessonLists((previous) => ({
      ...previous,
      [chapterId]: data,
    }));
  };

  const toggleChapter = async (chapterId: string) => {
    const isExpanded = expandedChapters.includes(chapterId);

    if (isExpanded) {
      setExpandedChapters((previous) =>
        previous.filter((item) => item !== chapterId),
      );
      return;
    }

    setExpandedChapters((previous) => [...previous, chapterId]);

    if (!lessonLists[chapterId]) {
      await loadLessons(chapterId);
    }
  };

  const resetModal = () => {
    setModalType(null);
    setEditingChapter(null);
    setEditingLesson(null);
    setEditingAttachment(null);

    setChapterTitle("");
    setChapterDescription("");

    setLessonTitle("");
    setLessonType("VIDEO");
    setLessonContent("");
    setLessonDuration("");

    setLinkTitle("");
    setLinkUrl("");
    setAttachmentTitle("");
  };

  const openCreateChapter = () => {
    resetModal();
    setModalType("chapter");
  };

  const openEditChapter = (chapter: ChapterListItem) => {
    resetModal();
    setEditingChapter(chapter);
    setChapterTitle(chapter.title);
    setChapterDescription(chapter.description ?? "");
    setModalType("chapter");
  };

  const openCreateLesson = (chapterId: string) => {
    resetModal();
    setEditingChapter(
      chapters.find((chapter) => chapter.id === chapterId) ?? null,
    );
    setModalType("lesson");
  };

  const openEditLesson = (lesson: LessonListItem) => {
    resetModal();
    setEditingLesson(lesson);
    setLessonTitle(lesson.title);
    setLessonType(lesson.type);
    setLessonDuration(lesson.duration?.toString() ?? "");
    setModalType("lesson");
  };

  const openCreateLink = () => {
    if (!selectedLesson) return;

    resetModal();
    setModalType("link");
  };

  const openEditAttachment = (attachment: LessonAttachment) => {
    resetModal();
    setEditingAttachment(attachment);
    setAttachmentTitle(attachment.title);
    setModalType("attachment");
  };

  const handleSaveChapter = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id || !chapterTitle.trim()) return;

    setSubmitting(true);
    setActionError("");

    try {
      if (editingChapter) {
        const payload: UpdateChapterPayload = {
          title: chapterTitle.trim(),
          description: chapterDescription.trim() || null,
        };

        await chapterApi.updateChapter(editingChapter.id, payload);
        setSuccessMessage("Đã cập nhật chương.");
      } else {
        const payload: CreateChapterPayload = {
          title: chapterTitle.trim(),
          description: chapterDescription.trim() || null,
          position: chapters.length + 1,
        };

        await chapterApi.createChapter(id, payload);
        setSuccessMessage("Đã tạo chương mới.");
      }

      await refreshChapters();
      resetModal();
    } catch (error) {
      setActionError(getErrorMessage(error, "Không thể lưu chương."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteChapter = async (chapter: ChapterListItem) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa chương "${chapter.title}"? Các bài học bên trong cũng sẽ bị xóa.`,
    );

    if (!confirmed) return;

    setActionError("");

    try {
      await chapterApi.deleteChapter(chapter.id);

      setChapters((previous) =>
        previous.filter((item) => item.id !== chapter.id),
      );

      setLessonLists((previous) => {
        const next = { ...previous };
        delete next[chapter.id];
        return next;
      });

      setExpandedChapters((previous) =>
        previous.filter((item) => item !== chapter.id),
      );

      if (
        selectedLesson &&
        lessonLists[chapter.id]?.some(
          (lesson) => lesson.id === selectedLesson.id,
        )
      ) {
        setSelectedLesson(null);
        setPreviewAttachment(null);
      }

      setSuccessMessage("Đã xóa chương.");
    } catch (error) {
      setActionError(getErrorMessage(error, "Không thể xóa chương."));
    }
  };

  const handleSaveLesson = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingChapter || !lessonTitle.trim()) return;

    setSubmitting(true);
    setActionError("");

    try {
      const duration = lessonDuration.trim() ? Number(lessonDuration) : null;

      if (duration !== null && (!Number.isInteger(duration) || duration < 0)) {
        setActionError("Thời lượng phải là số nguyên không âm.");
        return;
      }

      if (editingLesson) {
        const payload: UpdateLessonPayload = {
          title: lessonTitle.trim(),
          type: lessonType,
          duration,
        };

        await lessonApi.updateLesson(editingLesson.id, payload);

        if (selectedLesson?.id === editingLesson.id) {
          await loadLessonDetail(editingLesson.id);
        }

        setSuccessMessage("Đã cập nhật bài học.");
      } else {
        const currentLessons = lessonLists[editingChapter.id] ?? [];

        const payload: CreateLessonPayload = {
          title: lessonTitle.trim(),
          type: lessonType,
          content: lessonContent.trim() || null,
          duration,
          position: currentLessons.length + 1,
        };

        await lessonApi.createLesson(editingChapter.id, payload);
        setSuccessMessage("Đã tạo bài học mới.");
      }

      await refreshLessons(editingChapter.id);
      resetModal();
    } catch (error) {
      setActionError(getErrorMessage(error, "Không thể lưu bài học."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLesson = async (lesson: LessonListItem) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa bài học "${lesson.title}"?`,
    );

    if (!confirmed) return;

    setActionError("");

    try {
      await lessonApi.deleteLesson(lesson.id);
      await refreshLessons(lesson.chapterId);

      if (selectedLesson?.id === lesson.id) {
        setSelectedLesson(null);
        setPreviewAttachment(null);
      }

      setSuccessMessage("Đã xóa bài học.");
    } catch (error) {
      setActionError(getErrorMessage(error, "Không thể xóa bài học."));
    }
  };

  const handleUploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !selectedLesson) return;

    setSubmitting(true);
    setActionError("");

    try {
      await lessonAttachmentApi.createFileAttachment(selectedLesson.id, file);
      await loadLessonDetail(selectedLesson.id);
      setSuccessMessage("Đã tải tài liệu lên.");
    } catch (error) {
      setActionError(getErrorMessage(error, "Không thể tải tài liệu lên."));
    } finally {
      setSubmitting(false);
      event.target.value = "";
    }
  };

  const handleSaveLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedLesson || !linkTitle.trim() || !linkUrl.trim()) return;

    setSubmitting(true);
    setActionError("");

    try {
      const payload: CreateLinkAttachmentPayload = {
        title: linkTitle.trim(),
        externalUrl: linkUrl.trim(),
      };

      await lessonAttachmentApi.createLinkAttachment(
        selectedLesson.id,
        payload,
      );

      await loadLessonDetail(selectedLesson.id);
      setSuccessMessage("Đã thêm liên kết tài liệu.");
      resetModal();
    } catch (error) {
      setActionError(
        getErrorMessage(error, "Không thể thêm liên kết tài liệu."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveAttachment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingAttachment || !attachmentTitle.trim()) return;

    setSubmitting(true);
    setActionError("");

    try {
      const payload: UpdateAttachmentPayload = {
        title: attachmentTitle.trim(),
      };

      await lessonAttachmentApi.updateAttachment(editingAttachment.id, payload);

      if (selectedLesson) {
        await loadLessonDetail(selectedLesson.id);
      }

      setSuccessMessage("Đã cập nhật tài liệu.");
      resetModal();
    } catch (error) {
      setActionError(getErrorMessage(error, "Không thể cập nhật tài liệu."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplaceFile = async (
    attachment: LessonAttachment,
    file: File,
  ) => {
    const confirmed = window.confirm(
      `Bạn muốn thay thế file "${attachment.title}" bằng file mới?`,
    );

    if (!confirmed) return;

    setSubmitting(true);
    setActionError("");

    try {
      await lessonAttachmentApi.replaceAttachmentFile(attachment.id, file);

      if (selectedLesson) {
        await loadLessonDetail(selectedLesson.id);
      }

      setPreviewAttachment(null);
      setSuccessMessage("Đã thay thế file tài liệu.");
    } catch (error) {
      setActionError(getErrorMessage(error, "Không thể thay thế file."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAttachment = async (attachment: LessonAttachment) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa tài liệu "${attachment.title}"?`,
    );

    if (!confirmed) return;

    setActionError("");

    try {
      await lessonAttachmentApi.deleteAttachment(attachment.id);

      if (selectedLesson) {
        await loadLessonDetail(selectedLesson.id);
      }

      if (previewAttachment?.id === attachment.id) {
        setPreviewAttachment(null);
      }

      setSuccessMessage("Đã xóa tài liệu.");
    } catch (error) {
      setActionError(getErrorMessage(error, "Không thể xóa tài liệu."));
    }
  };

  const handleCloseModalBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !submitting) {
      resetModal();
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (pageError || !course) {
    return (
      <div className={cx("page-state")}>
        <Icon icon="solar:danger-circle-linear" />
        <p>{pageError || "Không tìm thấy khóa học."}</p>
        <button type="button" onClick={() => void loadPage()}>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className={cx("course-detail")}>
      <div className={cx("breadcrumb")}>
        <button type="button" onClick={() => navigate("/admin/courses")}>
          <Icon icon="solar:arrow-left-linear" />
          Khóa học
        </button>
        <Icon icon="solar:alt-arrow-right-linear" />
        <span>Chi tiết khóa học</span>
      </div>

      <section className={cx("course-header")}>
        <div className={cx("course-header__main")}>
          <div className={cx("course-icon")}>
            <Icon icon="solar:book-2-linear" />
          </div>

          <div className={cx("course-info")}>
            <div className={cx("course-info__top")}>
              <span className={cx("course-code")}>{course.code}</span>
              <span
                className={cx(
                  "status",
                  `status--${course.status.toLowerCase()}`,
                )}
              >
                {STATUS_LABELS[course.status] ?? course.status}
              </span>
            </div>

            <h1>{course.title}</h1>
            <p>
              {course.subjectGrade.subject.title}
              {course.targetYear ? ` · Năm học ${course.targetYear}` : ""}
            </p>
          </div>
        </div>

        <div className={cx("course-header__actions")}>
          <button
            type="button"
            className={cx("button", "button--outline")}
            onClick={() => navigate("/admin/courses")}
          >
            <Icon icon="solar:arrow-left-linear" />
            Quay lại
          </button>
        </div>

        {course.description && (
          <p className={cx("course-description")}>{course.description}</p>
        )}

        <div className={cx("course-stats")}>
          <div>
            <Icon icon="solar:folder-with-files-linear" />
            <span>{chapters.length} chương</span>
          </div>
          <div>
            <Icon icon="solar:users-group-rounded-linear" />
            <span>{course._count.classes} lớp học</span>
          </div>
          <div>
            <Icon icon="solar:user-linear" />
            <span>{course.createdBy.name}</span>
          </div>
        </div>
      </section>

      {(actionError || successMessage) && (
        <div
          className={cx(
            "feedback",
            actionError ? "feedback--error" : "feedback--success",
          )}
        >
          <Icon
            icon={
              actionError
                ? "solar:danger-circle-linear"
                : "solar:check-circle-linear"
            }
          />
          <span>{actionError || successMessage}</span>
          <button
            type="button"
            aria-label="Đóng thông báo"
            onClick={() => {
              setActionError("");
              setSuccessMessage("");
            }}
          >
            <Icon icon="solar:close-circle-linear" />
          </button>
        </div>
      )}

      <div className={cx("content-layout")}>
        <section className={cx("curriculum")}>
          <div className={cx("section-heading")}>
            <div>
              <h2>Nội dung khóa học</h2>
              <p>Quản lý chương và bài học của khóa học.</p>
            </div>

            <button
              type="button"
              className={cx("button", "button--primary")}
              onClick={openCreateChapter}
            >
              <Icon icon="solar:add-circle-linear" />
              Thêm chương
            </button>
          </div>

          {chapters.length === 0 ? (
            <div className={cx("empty-state")}>
              <div className={cx("empty-state__icon")}>
                <Icon icon="solar:folder-open-linear" />
              </div>
              <h3>Chưa có chương học</h3>
              <p>Thêm chương đầu tiên để bắt đầu xây dựng nội dung khóa học.</p>
              <button
                type="button"
                className={cx("button", "button--primary")}
                onClick={openCreateChapter}
              >
                <Icon icon="solar:add-circle-linear" />
                Thêm chương đầu tiên
              </button>
            </div>
          ) : (
            <div className={cx("chapter-list")}>
              {chapters.map((chapter) => {
                const isExpanded = expandedChapters.includes(chapter.id);
                const lessons = lessonLists[chapter.id] ?? [];

                return (
                  <article className={cx("chapter")} key={chapter.id}>
                    <div className={cx("chapter__header")}>
                      <button
                        type="button"
                        className={cx("chapter__toggle")}
                        onClick={() => void toggleChapter(chapter.id)}
                        aria-expanded={isExpanded}
                      >
                        <Icon
                          icon={
                            isExpanded
                              ? "solar:alt-arrow-down-linear"
                              : "solar:alt-arrow-right-linear"
                          }
                        />
                        <span className={cx("chapter__number")}>
                          {chapter.position}
                        </span>
                        <span className={cx("chapter__title")}>
                          {chapter.title}
                        </span>
                        <span className={cx("chapter__count")}>
                          {chapter._count.lessons} bài học
                        </span>
                      </button>

                      <div className={cx("chapter__actions")}>
                        <button
                          type="button"
                          title="Thêm bài học"
                          aria-label="Thêm bài học"
                          onClick={() => openCreateLesson(chapter.id)}
                        >
                          <Icon icon="solar:add-circle-linear" />
                        </button>
                        <button
                          type="button"
                          title="Sửa chương"
                          aria-label="Sửa chương"
                          onClick={() => openEditChapter(chapter)}
                        >
                          <Icon icon="solar:pen-linear" />
                        </button>
                        <button
                          type="button"
                          title="Xóa chương"
                          aria-label="Xóa chương"
                          onClick={() => void handleDeleteChapter(chapter)}
                        >
                          <Icon icon="solar:trash-bin-trash-linear" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className={cx("chapter__body")}>
                        {chapter.description && (
                          <p className={cx("chapter__description")}>
                            {chapter.description}
                          </p>
                        )}

                        {lessons.length === 0 ? (
                          <div className={cx("lesson-empty")}>
                            <span>Chương này chưa có bài học.</span>
                            <button
                              type="button"
                              onClick={() => openCreateLesson(chapter.id)}
                            >
                              Thêm bài học
                            </button>
                          </div>
                        ) : (
                          <div className={cx("lesson-list")}>
                            {lessons.map((lesson) => (
                              <div
                                className={cx(
                                  "lesson",
                                  selectedLesson?.id === lesson.id &&
                                    "lesson--active",
                                )}
                                key={lesson.id}
                              >
                                <button
                                  type="button"
                                  className={cx("lesson__main")}
                                  onClick={() =>
                                    void loadLessonDetail(lesson.id)
                                  }
                                >
                                  <Icon
                                    className={cx("lesson__icon")}
                                    icon={LESSON_TYPE_ICONS[lesson.type]}
                                  />
                                  <span className={cx("lesson__info")}>
                                    <strong>{lesson.title}</strong>
                                    <small>
                                      {
                                        LESSON_TYPES.find(
                                          (item) => item.value === lesson.type,
                                        )?.label
                                      }
                                      {lesson.duration
                                        ? ` · ${lesson.duration} phút`
                                        : ""}
                                      {` · ${lesson._count.attachments} tài liệu`}
                                    </small>
                                  </span>
                                  <span
                                    className={cx(
                                      "status",
                                      `status--${lesson.status.toLowerCase()}`,
                                    )}
                                  >
                                    {STATUS_LABELS[lesson.status] ??
                                      lesson.status}
                                  </span>
                                </button>

                                <div className={cx("lesson__actions")}>
                                  <button
                                    type="button"
                                    title="Sửa bài học"
                                    aria-label="Sửa bài học"
                                    onClick={() => openEditLesson(lesson)}
                                  >
                                    <Icon icon="solar:pen-linear" />
                                  </button>
                                  <button
                                    type="button"
                                    title="Xóa bài học"
                                    aria-label="Xóa bài học"
                                    onClick={() =>
                                      void handleDeleteLesson(lesson)
                                    }
                                  >
                                    <Icon icon="solar:trash-bin-trash-linear" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          type="button"
                          className={cx("add-lesson")}
                          onClick={() => openCreateLesson(chapter.id)}
                        >
                          <Icon icon="solar:add-circle-linear" />
                          Thêm bài học
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className={cx("lesson-panel")}>
          {!selectedLesson ? (
            <div className={cx("lesson-placeholder")}>
              <div>
                <Icon icon="solar:document-text-linear" />
              </div>
              <h3>Chi tiết bài học</h3>
              <p>Chọn một bài học để xem nội dung và quản lý tài liệu.</p>
            </div>
          ) : (
            <>
              <div className={cx("lesson-panel__header")}>
                <div>
                  <span className={cx("panel-eyebrow")}>BÀI HỌC</span>
                  <h2>{selectedLesson.title}</h2>
                </div>
                <button
                  type="button"
                  aria-label="Đóng chi tiết bài học"
                  onClick={() => {
                    setSelectedLesson(null);
                    setPreviewAttachment(null);
                  }}
                >
                  <Icon icon="solar:close-circle-linear" />
                </button>
              </div>

              <div className={cx("lesson-summary")}>
                <span>
                  <Icon icon={LESSON_TYPE_ICONS[selectedLesson.type]} />
                  {
                    LESSON_TYPES.find(
                      (item) => item.value === selectedLesson.type,
                    )?.label
                  }
                </span>
                {selectedLesson.duration !== null && (
                  <span>
                    <Icon icon="solar:clock-circle-linear" />
                    {selectedLesson.duration} phút
                  </span>
                )}
                <span
                  className={cx(
                    "status",
                    `status--${selectedLesson.status.toLowerCase()}`,
                  )}
                >
                  {STATUS_LABELS[selectedLesson.status] ??
                    selectedLesson.status}
                </span>
              </div>

              {selectedLesson.content && (
                <div className={cx("lesson-content")}>
                  <h3>Nội dung</h3>
                  <p>{selectedLesson.content}</p>
                </div>
              )}

              <div className={cx("attachment-section")}>
                <div className={cx("attachment-heading")}>
                  <div>
                    <h3>Tài liệu bài học</h3>
                    <p>{selectedLesson.attachments.length} tài liệu</p>
                  </div>
                </div>

                <div className={cx("attachment-actions")}>
                  <label
                    className={cx("button", "button--outline", {
                      "button--disabled": submitting,
                    })}
                  >
                    <Icon icon="solar:upload-linear" />
                    Tải file lên
                    <input
                      type="file"
                      hidden
                      disabled={submitting}
                      onChange={(event) => void handleUploadFile(event)}
                    />
                  </label>

                  <button
                    type="button"
                    className={cx("button", "button--outline")}
                    onClick={openCreateLink}
                  >
                    <Icon icon="solar:link-linear" />
                    Thêm liên kết
                  </button>
                </div>

                {selectedLesson.attachments.length === 0 ? (
                  <div className={cx("attachment-empty")}>
                    <Icon icon="solar:paperclip-linear" />
                    <p>Chưa có tài liệu đính kèm.</p>
                  </div>
                ) : (
                  <div className={cx("attachment-list")}>
                    {selectedLesson.attachments.map((attachment) => (
                      <div className={cx("attachment")} key={attachment.id}>
                        <div className={cx("attachment__icon")}>
                          <Icon
                            icon={
                              attachment.type === "FILE"
                                ? "solar:file-text-linear"
                                : "solar:link-linear"
                            }
                          />
                        </div>

                        <div className={cx("attachment__info")}>
                          <strong>{attachment.title}</strong>
                          <small>
                            {attachment.type === "FILE"
                              ? `${attachment.fileName ?? "Tệp đính kèm"} · ${formatFileSize(attachment.size)}`
                              : "Liên kết bên ngoài"}
                          </small>
                        </div>

                        <div className={cx("attachment__actions")}>
                          {attachment.type === "FILE" && attachment.fileUrl && (
                            <button
                              type="button"
                              title="Xem trước tài liệu"
                              aria-label="Xem trước tài liệu"
                              onClick={() => setPreviewAttachment(attachment)}
                            >
                              <Icon icon="solar:eye-linear" />
                            </button>
                          )}

                          {attachment.type === "LINK" &&
                            attachment.externalUrl && (
                              <a
                                href={attachment.externalUrl}
                                target="_blank"
                                rel="noreferrer"
                                title="Mở liên kết"
                              >
                                <Icon icon="solar:external-link-linear" />
                              </a>
                            )}

                          <button
                            type="button"
                            title="Sửa tên tài liệu"
                            aria-label="Sửa tên tài liệu"
                            onClick={() => openEditAttachment(attachment)}
                          >
                            <Icon icon="solar:pen-linear" />
                          </button>

                          {attachment.type === "FILE" && (
                            <label
                              title="Thay thế file"
                              className={cx("replace-file")}
                            >
                              <Icon icon="solar:refresh-linear" />
                              <input
                                type="file"
                                hidden
                                disabled={submitting}
                                onChange={(event) => {
                                  const file = event.target.files?.[0];

                                  if (file) {
                                    void handleReplaceFile(attachment, file);
                                  }

                                  event.target.value = "";
                                }}
                              />
                            </label>
                          )}

                          <button
                            type="button"
                            title="Xóa tài liệu"
                            aria-label="Xóa tài liệu"
                            onClick={() =>
                              void handleDeleteAttachment(attachment)
                            }
                          >
                            <Icon icon="solar:trash-bin-trash-linear" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </aside>
      </div>

      {modalType && (
        <div
          className={cx("modal-backdrop")}
          onMouseDown={handleCloseModalBackdrop}
        >
          <div
            className={cx("modal")}
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-modal-title"
          >
            <div className={cx("modal__header")}>
              <h2 id="course-modal-title">
                {modalType === "chapter" &&
                  (editingChapter ? "Chỉnh sửa chương" : "Thêm chương mới")}
                {modalType === "lesson" &&
                  (editingLesson ? "Chỉnh sửa bài học" : "Thêm bài học mới")}
                {modalType === "link" && "Thêm liên kết tài liệu"}
                {modalType === "attachment" && "Chỉnh sửa tài liệu"}
              </h2>

              <button
                type="button"
                aria-label="Đóng"
                disabled={submitting}
                onClick={resetModal}
              >
                <Icon icon="solar:close-circle-linear" />
              </button>
            </div>

            {modalType === "chapter" && (
              <form onSubmit={handleSaveChapter}>
                <div className={cx("form-group")}>
                  <label htmlFor="chapter-title">Tên chương</label>
                  <input
                    id="chapter-title"
                    value={chapterTitle}
                    onChange={(event) => setChapterTitle(event.target.value)}
                    placeholder="Nhập tên chương"
                    maxLength={255}
                    required
                  />
                </div>

                <div className={cx("form-group")}>
                  <label htmlFor="chapter-description">Mô tả</label>
                  <textarea
                    id="chapter-description"
                    value={chapterDescription}
                    onChange={(event) =>
                      setChapterDescription(event.target.value)
                    }
                    placeholder="Mô tả nội dung chương..."
                    rows={4}
                  />
                </div>

                <div className={cx("modal__footer")}>
                  <button
                    type="button"
                    className={cx("button", "button--outline")}
                    disabled={submitting}
                    onClick={resetModal}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className={cx("button", "button--primary")}
                    disabled={submitting || !chapterTitle.trim()}
                  >
                    {submitting ? "Đang lưu..." : "Lưu chương"}
                  </button>
                </div>
              </form>
            )}

            {modalType === "lesson" && (
              <form onSubmit={handleSaveLesson}>
                <div className={cx("form-group")}>
                  <label htmlFor="lesson-title">Tên bài học</label>
                  <input
                    id="lesson-title"
                    value={lessonTitle}
                    onChange={(event) => setLessonTitle(event.target.value)}
                    placeholder="Nhập tên bài học"
                    maxLength={255}
                    required
                  />
                </div>

                <div className={cx("form-row")}>
                  <div className={cx("form-group")}>
                    <label htmlFor="lesson-type">Loại bài học</label>
                    <select
                      id="lesson-type"
                      value={lessonType}
                      onChange={(event) =>
                        setLessonType(event.target.value as LessonType)
                      }
                    >
                      {LESSON_TYPES.map((item) => (
                        <option value={item.value} key={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={cx("form-group")}>
                    <label htmlFor="lesson-duration">Thời lượng (phút)</label>
                    <input
                      id="lesson-duration"
                      type="number"
                      min={0}
                      step={1}
                      value={lessonDuration}
                      onChange={(event) =>
                        setLessonDuration(event.target.value)
                      }
                      placeholder="Ví dụ: 15"
                    />
                  </div>
                </div>

                {!editingLesson && (
                  <div className={cx("form-group")}>
                    <label htmlFor="lesson-content">Nội dung</label>
                    <textarea
                      id="lesson-content"
                      value={lessonContent}
                      onChange={(event) => setLessonContent(event.target.value)}
                      placeholder="Nhập nội dung giới thiệu bài học..."
                      rows={4}
                    />
                  </div>
                )}

                <div className={cx("modal__footer")}>
                  <button
                    type="button"
                    className={cx("button", "button--outline")}
                    disabled={submitting}
                    onClick={resetModal}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className={cx("button", "button--primary")}
                    disabled={submitting || !lessonTitle.trim()}
                  >
                    {submitting ? "Đang lưu..." : "Lưu bài học"}
                  </button>
                </div>
              </form>
            )}

            {modalType === "link" && (
              <form onSubmit={handleSaveLink}>
                <div className={cx("form-group")}>
                  <label htmlFor="link-title">Tên tài liệu</label>
                  <input
                    id="link-title"
                    value={linkTitle}
                    onChange={(event) => setLinkTitle(event.target.value)}
                    placeholder="Ví dụ: Video bài giảng"
                    maxLength={255}
                    required
                  />
                </div>

                <div className={cx("form-group")}>
                  <label htmlFor="link-url">Đường dẫn</label>
                  <input
                    id="link-url"
                    type="url"
                    value={linkUrl}
                    onChange={(event) => setLinkUrl(event.target.value)}
                    placeholder="https://..."
                    maxLength={1000}
                    required
                  />
                </div>

                <div className={cx("modal__footer")}>
                  <button
                    type="button"
                    className={cx("button", "button--outline")}
                    disabled={submitting}
                    onClick={resetModal}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className={cx("button", "button--primary")}
                    disabled={
                      submitting || !linkTitle.trim() || !linkUrl.trim()
                    }
                  >
                    {submitting ? "Đang lưu..." : "Thêm liên kết"}
                  </button>
                </div>
              </form>
            )}

            {modalType === "attachment" && (
              <form onSubmit={handleSaveAttachment}>
                <div className={cx("form-group")}>
                  <label htmlFor="attachment-title">Tên tài liệu</label>
                  <input
                    id="attachment-title"
                    value={attachmentTitle}
                    onChange={(event) => setAttachmentTitle(event.target.value)}
                    placeholder="Nhập tên tài liệu"
                    maxLength={255}
                    required
                  />
                </div>

                <div className={cx("modal__footer")}>
                  <button
                    type="button"
                    className={cx("button", "button--outline")}
                    disabled={submitting}
                    onClick={resetModal}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className={cx("button", "button--primary")}
                    disabled={submitting || !attachmentTitle.trim()}
                  >
                    {submitting ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {previewAttachment && (
        <AttachmentPreview
          attachment={previewAttachment}
          onClose={() => setPreviewAttachment(null)}
        />
      )}
    </div>
  );
}

export default CourseDetail;
