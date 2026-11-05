export interface Chapter {
  id: string;
  subjectId: string;
  title: string;
  description: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
}
