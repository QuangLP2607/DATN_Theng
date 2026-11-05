export type ClassStatus = "ACTIVE" | "INACTIVE";

export interface Class {
  id: string;
  subjectId: string;
  name: string;
  code: string;
  status: ClassStatus;
  createdAt: string;
  updatedAt: string;
}
