import { Router } from "express";

import {
  getAttachments,
  getAttachmentById,
  createFileAttachment,
  createLinkAttachment,
  updateAttachment,
  replaceAttachmentFile,
  deleteAttachment,
} from "./controller";

import { authMiddleware } from "../../middlewares/auth";
import { validateZod } from "../../middlewares/validateZod";
import { uploadSingleFile } from "../../middlewares/upload";

import { loadAbility } from "../access/middlewares/ability.middleware";

import {
  lessonIdParamsSchema,
  attachmentIdParamsSchema,
} from "./dto/attachmentParams";

import { listAttachmentsQuerySchema } from "./dto/listAttachments";
import { createLinkAttachmentSchema } from "./dto/createLinkAttachment";
import { updateAttachmentSchema } from "./dto/updateAttachment";

const router = Router();

router.use(authMiddleware, loadAbility);

// List attachments in a lesson
router.get(
  "/lessons/:lessonId/attachments",
  validateZod({
    params: lessonIdParamsSchema,
    query: listAttachmentsQuerySchema,
  }),
  getAttachments,
);

// Upload file attachment
router.post(
  "/lessons/:lessonId/attachments/file",
  uploadSingleFile,
  validateZod({
    params: lessonIdParamsSchema,
  }),
  createFileAttachment,
);

// Create external link attachment
router.post(
  "/lessons/:lessonId/attachments/link",
  validateZod({
    params: lessonIdParamsSchema,
    body: createLinkAttachmentSchema,
  }),
  createLinkAttachment,
);

// Get attachment detail
router.get(
  "/attachments/:id",
  validateZod({
    params: attachmentIdParamsSchema,
  }),
  getAttachmentById,
);

// Update attachment metadata
router.patch(
  "/attachments/:id",
  validateZod({
    params: attachmentIdParamsSchema,
    body: updateAttachmentSchema,
  }),
  updateAttachment,
);

// Replace uploaded file
router.put(
  "/attachments/:id/file",
  uploadSingleFile,
  validateZod({
    params: attachmentIdParamsSchema,
  }),
  replaceAttachmentFile,
);

// Delete attachment
router.delete(
  "/attachments/:id",
  validateZod({
    params: attachmentIdParamsSchema,
  }),
  deleteAttachment,
);

export default router;
