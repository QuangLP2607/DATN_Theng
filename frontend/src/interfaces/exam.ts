import type { Question } from "./question";

export type ExamStatus = "DRAFT" | "PUBLISHED" | "CLOSED";

export interface ExamQuestion {
  id: string;
  examId: string;
  questionId: string;
  points: number;
  position: number;
  question?: Question;
}

export interface Exam {
  id: string;
  classId: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  scheduledAt: string | null;
  maxAttempts: number;
  status: ExamStatus;
  createdBy: string;
  questions?: ExamQuestion[];
  createdAt: string;
  updatedAt: string;
}
