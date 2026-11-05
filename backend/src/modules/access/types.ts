export type SubjectResource = "subject" | "chapter" | "lesson";

export interface SubjectAccessParams {
  subjectId: string;
  userId: string;
}

export interface ClassAccessParams {
  classId: string;
  userId: string;
}

export interface ResourceAccessParams {
  resource: SubjectResource;
  resourceId: string;
}
