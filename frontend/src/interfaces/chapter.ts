import type { ContentStatus, LessonType } from "./lesson";

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  position: number;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ChapterListItem extends Chapter {
  _count: {
    lessons: number;
    questions: number;
  };
}

export interface ChapterLessonItem {
  id: string;
  title: string;
  type: LessonType;
  duration: number | null;
  position: number;
  status: ContentStatus;
}

export interface ChapterDetail extends ChapterListItem {
  lessons: ChapterLessonItem[];
}
