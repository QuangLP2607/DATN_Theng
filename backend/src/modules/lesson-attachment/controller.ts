import type { NextFunction, Request, Response } from "express";

import { sendResponse } from "../../core/response";
import { AppError } from "../../core/error";

import * as attachmentService from "./service";

import type { ListAttachmentsQueryDto } from "./dto/listAttachments";
import type { CreateLinkAttachmentDto } from "./dto/createLinkAttachment";
import type { UpdateAttachmentDto } from "./dto/updateAttachment";

import type {
  LessonIdParams,
  AttachmentIdParams,
} from "./dto/attachmentParams";

/*
 * -------------------- GET ATTACHMENTS --------------------
 */

export const getAttachments = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.ability) {
      throw AppError.unauthorized("Authorization ability not initialized");
    }

    const params = res.locals.validated.params as LessonIdParams;
    const query = res.locals.validated.query as ListAttachmentsQueryDto;

    const attachments = await attachmentService.getAttachments(
      req.ability,
      params.lessonId,
      query,
    );

    sendResponse(res, 200, {
      message: "Get attachments successfully",
      data: {
        attachments,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- GET ATTACHMENT BY ID --------------------
 */

export const getAttachmentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.ability) {
      throw AppError.unauthorized("Authorization ability not initialized");
    }

    const params = res.locals.validated.params as AttachmentIdParams;

    const attachment = await attachmentService.getAttachmentById(
      req.ability,
      params.id,
    );

    sendResponse(res, 200, {
      message: "Get attachment successfully",
      data: attachment,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- CREATE FILE ATTACHMENT --------------------
 */

export const createFileAttachment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.ability) {
      throw AppError.unauthorized("Authorization ability not initialized");
    }

    const params = res.locals.validated.params as LessonIdParams;

    if (!req.file) {
      throw AppError.badRequest("Please select a file to upload");
    }

    const attachment = await attachmentService.createFileAttachment(
      req.ability,
      params.lessonId,
      req.file,
    );

    sendResponse(res, 201, {
      message: "Upload attachment successfully",
      data: attachment,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- CREATE LINK ATTACHMENT --------------------
 */

export const createLinkAttachment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.ability) {
      throw AppError.unauthorized("Authorization ability not initialized");
    }

    const params = res.locals.validated.params as LessonIdParams;
    const body = res.locals.validated.body as CreateLinkAttachmentDto;

    const attachment = await attachmentService.createLinkAttachment(
      req.ability,
      params.lessonId,
      body,
    );

    sendResponse(res, 201, {
      message: "Create link attachment successfully",
      data: attachment,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- UPDATE ATTACHMENT --------------------
 */

export const updateAttachment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.ability) {
      throw AppError.unauthorized("Authorization ability not initialized");
    }

    const params = res.locals.validated.params as AttachmentIdParams;
    const body = res.locals.validated.body as UpdateAttachmentDto;

    const attachment = await attachmentService.updateAttachment(
      req.ability,
      params.id,
      body,
    );

    sendResponse(res, 200, {
      message: "Update attachment successfully",
      data: attachment,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- REPLACE FILE --------------------
 */

export const replaceAttachmentFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.ability) {
      throw AppError.unauthorized("Authorization ability not initialized");
    }

    const params = res.locals.validated.params as AttachmentIdParams;

    if (!req.file) {
      throw AppError.badRequest("Please select a file to upload");
    }

    const attachment = await attachmentService.replaceAttachmentFile(
      req.ability,
      params.id,
      req.file,
    );

    sendResponse(res, 200, {
      message: "Replace attachment file successfully",
      data: attachment,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- DELETE ATTACHMENT --------------------
 */

export const deleteAttachment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.ability) {
      throw AppError.unauthorized("Authorization ability not initialized");
    }

    const params = res.locals.validated.params as AttachmentIdParams;

    await attachmentService.deleteAttachment(req.ability, params.id);

    sendResponse(res, 200, {
      message: "Delete attachment successfully",
    });
  } catch (error) {
    next(error);
  }
};
