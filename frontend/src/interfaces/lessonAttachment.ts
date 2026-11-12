export type LessonAttachmentType = "FILE" | "LINK";

export interface LessonAttachment {
  id: string;
  lessonId: string;
  title: string;
  type: LessonAttachmentType;
  fileName: string | null;
  mimeType: string | null;
  size: number | null;
  externalUrl: string | null;
  fileUrl: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
}
