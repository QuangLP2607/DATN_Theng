import type { LessonAttachment } from "./lessonAttachment";

export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type LessonType = "VIDEO" | "PDF" | "SLIDE" | "TEXT";

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  type: LessonType;
  content: string | null;
  duration: number | null;
  position: number;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LessonListItem extends Lesson {
  _count: {
    attachments: number;
    progress: number;
  };
}

export interface LessonDetail extends Lesson {
  attachments: LessonAttachment[];
}
