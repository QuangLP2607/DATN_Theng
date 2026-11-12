import type { GradeLevel } from "./subjectGrade";

export type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Course {
  id: string;
  subjectGradeId: string;
  title: string;
  code: string;
  description: string | null;
  thumbnailKey: string | null;
  targetYear: number | null;
  status: CourseStatus;
  createdById: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CourseSubject {
  id: string;
  code: string;
  title: string;
  icon: string;
}

export interface CourseSubjectGrade {
  id: string;
  grade: GradeLevel;
  subject: CourseSubject;
}

export interface CourseCreator {
  id: string;
  name: string;
  email: string;
}
