export type ClassStatus = "ACTIVE" | "INACTIVE";

export interface Class {
  id: string;
  courseId: string;
  name: string;
  code: string;
  status: ClassStatus;
  maxStudents: number | null;
  startAt: string | null;
  endAt: string | null;
  createdAt: string;
  updatedAt: string;
}
