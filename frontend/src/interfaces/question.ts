export type QuestionType =
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE"
  | "ESSAY";

export interface QuestionOption {
  id: string;
  questionId: string;
  content: string;
  isCorrect: boolean;
  position: number;
}

export interface Question {
  id: string;
  content: string;
  type: QuestionType;
  explanation: string | null;
  options: QuestionOption[];
  createdAt: string;
  updatedAt: string;
}
