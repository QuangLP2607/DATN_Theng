import { Prisma } from "../../generated/prisma/client";
import { LessonAttachmentType } from "../../generated/prisma/enums";

import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";

import { uploadFile, getFileUrl, deleteFile } from "../storage/service";

import { AccessAction } from "../access/actions";
import { accessibleBy } from "../access/casl-prisma";
import type { AppAbility } from "../access/casl-prisma";

import type { CreateLinkAttachmentDto } from "./dto/createLinkAttachment";
import type { ListAttachmentsQueryDto } from "./dto/listAttachments";
import type { UpdateAttachmentDto } from "./dto/updateAttachment";

/*
 * -------------------- CONSTANTS --------------------
 */

const LESSON_ATTACHMENT_FOLDER = "lesson-attachments";

/*
 * -------------------- SELECT --------------------
 */

const attachmentSelect = {
  id: true,
  lessonId: true,
  title: true,
  type: true,
  storageKey: true,
  fileName: true,
  mimeType: true,
  size: true,
  externalUrl: true,
  position: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.LessonAttachmentSelect;

type AttachmentRecord = Prisma.LessonAttachmentGetPayload<{
  select: typeof attachmentSelect;
}>;

export interface AttachmentResponse {
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
  createdAt: Date;
  updatedAt: Date;
}

/*
 * -------------------- ACCESS --------------------
 */

const getCourseAccessWhere = (
  ability: AppAbility,
  action: AccessAction,
): Prisma.CourseWhereInput => {
  return accessibleBy(ability, action).ofType("Course");
};

const validateLessonAccess = async (
  ability: AppAbility,
  lessonId: string,
  action: AccessAction,
) => {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      chapter: {
        select: {
          id: true,
          courseId: true,
        },
      },
    },
  });

  if (!lesson) {
    throw AppError.notFound("Lesson not found");
  }

  const course = await prisma.course.findFirst({
    where: {
      AND: [
        {
          id: lesson.chapter.courseId,
        },
        getCourseAccessWhere(ability, action),
      ],
    },
    select: {
      id: true,
    },
  });

  if (!course) {
    throw AppError.notFound("Lesson not found");
  }

  return lesson;
};

const findAttachment = async (
  id: string,
  ability: AppAbility,
  action: AccessAction,
): Promise<AttachmentRecord> => {
  const attachment = await prisma.lessonAttachment.findUnique({
    where: {
      id,
    },
    select: attachmentSelect,
  });

  if (!attachment) {
    throw AppError.notFound("Attachment not found");
  }

  await validateLessonAccess(ability, attachment.lessonId, action);

  return attachment;
};

/*
 * -------------------- HELPERS --------------------
 */

const getNextPosition = async (lessonId: string): Promise<number> => {
  const latestAttachment = await prisma.lessonAttachment.findFirst({
    where: {
      lessonId,
    },
    orderBy: {
      position: "desc",
    },
    select: {
      position: true,
    },
  });

  return (latestAttachment?.position ?? 0) + 1;
};

const mapAttachment = async (
  attachment: AttachmentRecord,
): Promise<AttachmentResponse> => {
  let fileUrl: string | null = null;

  if (attachment.type === LessonAttachmentType.FILE && attachment.storageKey) {
    fileUrl = await getFileUrl(attachment.storageKey, {
      download: false,
    });
  }

  return {
    id: attachment.id,
    lessonId: attachment.lessonId,
    title: attachment.title,
    type: attachment.type,
    fileName: attachment.fileName,
    mimeType: attachment.mimeType,
    size: attachment.size,
    externalUrl: attachment.externalUrl,
    fileUrl,
    position: attachment.position,
    createdAt: attachment.createdAt,
    updatedAt: attachment.updatedAt,
  };
};

const handlePositionConflict = (error: unknown): never => {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw AppError.conflict(
      "Attachment position already exists in this lesson",
    );
  }

  throw error;
};

/*
 * -------------------- LIST ATTACHMENTS --------------------
 */

export const getAttachments = async (
  ability: AppAbility,
  lessonId: string,
  query: ListAttachmentsQueryDto,
): Promise<AttachmentResponse[]> => {
  await validateLessonAccess(ability, lessonId, AccessAction.READ);

  const attachments = await prisma.lessonAttachment.findMany({
    where: {
      lessonId,
      ...(query.type ? { type: query.type } : {}),
    },
    select: attachmentSelect,
    orderBy: [{ position: "asc" }, { id: "asc" }],
  });

  return Promise.all(attachments.map(mapAttachment));
};

/*
 * -------------------- GET ATTACHMENT BY ID --------------------
 */

export const getAttachmentById = async (
  ability: AppAbility,
  id: string,
): Promise<AttachmentResponse> => {
  const attachment = await findAttachment(id, ability, AccessAction.READ);

  return mapAttachment(attachment);
};

/*
 * -------------------- CREATE FILE ATTACHMENT --------------------
 */

export const createFileAttachment = async (
  ability: AppAbility,
  lessonId: string,
  file: Express.Multer.File,
): Promise<AttachmentResponse> => {
  await validateLessonAccess(ability, lessonId, AccessAction.UPDATE);

  const uploadedFile = await uploadFile({
    file,
    folder: LESSON_ATTACHMENT_FOLDER,
  });

  let attachment: AttachmentRecord;

  try {
    const position = await getNextPosition(lessonId);

    attachment = await prisma.lessonAttachment.create({
      data: {
        lessonId,
        title: uploadedFile.fileName,
        type: LessonAttachmentType.FILE,
        storageKey: uploadedFile.storageKey,
        fileName: uploadedFile.fileName,
        mimeType: uploadedFile.mimeType,
        size: uploadedFile.size,
        position,
      },
      select: attachmentSelect,
    });
  } catch (error) {
    try {
      await deleteFile(uploadedFile.storageKey);
    } catch (deleteError) {
      console.error(
        "[LessonAttachment] Rollback uploaded file failed:",
        deleteError,
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return handlePositionConflict(error);
    }

    throw error;
  }

  return mapAttachment(attachment);
};

/*
 * -------------------- CREATE LINK ATTACHMENT --------------------
 */

export const createLinkAttachment = async (
  ability: AppAbility,
  lessonId: string,
  input: CreateLinkAttachmentDto,
): Promise<AttachmentResponse> => {
  await validateLessonAccess(ability, lessonId, AccessAction.UPDATE);

  try {
    const position = await getNextPosition(lessonId);

    const attachment = await prisma.lessonAttachment.create({
      data: {
        lessonId,
        title: input.title,
        type: LessonAttachmentType.LINK,
        externalUrl: input.externalUrl,
        position,
      },
      select: attachmentSelect,
    });

    return mapAttachment(attachment);
  } catch (error) {
    return handlePositionConflict(error);
  }
};

/*
 * -------------------- UPDATE ATTACHMENT --------------------
 */

export const updateAttachment = async (
  ability: AppAbility,
  id: string,
  input: UpdateAttachmentDto,
): Promise<AttachmentResponse> => {
  const attachment = await findAttachment(id, ability, AccessAction.UPDATE);

  if (
    input.externalUrl !== undefined &&
    attachment.type !== LessonAttachmentType.LINK
  ) {
    throw AppError.badRequest("Only link attachments can update external URL");
  }

  try {
    const updatedAttachment = await prisma.lessonAttachment.update({
      where: {
        id: attachment.id,
      },
      data: input,
      select: attachmentSelect,
    });

    return mapAttachment(updatedAttachment);
  } catch (error) {
    return handlePositionConflict(error);
  }
};

/*
 * -------------------- REPLACE FILE --------------------
 */

export const replaceAttachmentFile = async (
  ability: AppAbility,
  id: string,
  file: Express.Multer.File,
): Promise<AttachmentResponse> => {
  const attachment = await findAttachment(id, ability, AccessAction.UPDATE);

  if (attachment.type !== LessonAttachmentType.FILE) {
    throw AppError.badRequest(
      "Only file attachments can replace uploaded files",
    );
  }

  if (!attachment.storageKey) {
    throw AppError.badRequest("Attachment does not have a valid storage key");
  }

  const oldStorageKey = attachment.storageKey;

  const uploadedFile = await uploadFile({
    file,
    folder: LESSON_ATTACHMENT_FOLDER,
  });

  let updatedAttachment: AttachmentRecord;

  try {
    updatedAttachment = await prisma.lessonAttachment.update({
      where: {
        id: attachment.id,
      },
      data: {
        title: uploadedFile.fileName,
        storageKey: uploadedFile.storageKey,
        fileName: uploadedFile.fileName,
        mimeType: uploadedFile.mimeType,
        size: uploadedFile.size,
      },
      select: attachmentSelect,
    });
  } catch (error) {
    try {
      await deleteFile(uploadedFile.storageKey);
    } catch (deleteError) {
      console.error(
        "[LessonAttachment] Rollback replacement file failed:",
        deleteError,
      );
    }

    throw error;
  }

  try {
    await deleteFile(oldStorageKey);
  } catch (error) {
    // Database already points to the new file.
    // Keep the old object for later cleanup rather than rolling back DB.
    console.error("[LessonAttachment] Old file cleanup failed:", error);
  }

  return mapAttachment(updatedAttachment);
};

/*
 * -------------------- DELETE ATTACHMENT --------------------
 */

export const deleteAttachment = async (
  ability: AppAbility,
  id: string,
): Promise<void> => {
  const attachment = await findAttachment(id, ability, AccessAction.DELETE);

  await prisma.lessonAttachment.delete({
    where: {
      id: attachment.id,
    },
  });

  if (attachment.type === LessonAttachmentType.FILE && attachment.storageKey) {
    try {
      await deleteFile(attachment.storageKey);
    } catch (error) {
      // The database record is already deleted.
      // Log the orphaned object so it can be cleaned up.
      console.error("[LessonAttachment] S3 object cleanup failed:", {
        attachmentId: attachment.id,
        storageKey: attachment.storageKey,
        error,
      });
    }
  }
};
