export type GradeLevel = "GRADE_10" | "GRADE_11" | "GRADE_12";

export interface SubjectGradeSummary {
  id: string;
  grade: GradeLevel;
}

export interface SubjectGrade {
  id: string;
  subjectId: string;
  grade: GradeLevel;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectGradeDetail extends SubjectGrade {
  subject: {
    id: string;
    code: string;
    title: string;
    icon: string;
  };
  _count: {
    courses: number;
    questions: number;
  };
}
