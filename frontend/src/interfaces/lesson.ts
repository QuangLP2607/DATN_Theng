export type LessonType = "VIDEO" | "PDF" | "SLIDE" | "TEXT";

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  type: LessonType;
  content: string | null;
  fileUrl: string | null;
  duration: number | null;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface LessonProgress {
  id: string;
  lessonId: string;
  studentId: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}
