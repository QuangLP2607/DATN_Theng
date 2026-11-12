import type { Request, Response, NextFunction } from "express";
import multer from "multer";

import { AppError } from "../core/error";

import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  MAX_FILES,
} from "../modules/storage/constants";

const multerUpload = multer({
  storage: multer.memoryStorage(),

  fileFilter: (_req, file, callback) => {
    const isAllowed = ALLOWED_MIME_TYPES.some(
      (mimeType) => mimeType === file.mimetype,
    );

    if (!isAllowed) {
      callback(AppError.badRequest("File type is not supported"));
      return;
    }

    callback(null, true);
  },

  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
  },
});

export const uploadSingleFile = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  multerUpload.single("file")(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "File size exceeds 50 MB"
          : error.code === "LIMIT_FILE_COUNT"
            ? "Only one file is allowed"
            : error.message;

      next(AppError.badRequest(message));
      return;
    }

    next(error);
  });
};
