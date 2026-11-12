import type { SubjectGradeSummary } from "./subjectGrade";

export interface Subject {
  id: string;
  code: string;
  title: string;
  description: string | null;
  icon: string;
  subjectGrades: SubjectGradeSummary[];
  createdAt: string;
  updatedAt: string;
}
