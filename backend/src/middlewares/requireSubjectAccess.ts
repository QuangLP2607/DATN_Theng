import type { RequestHandler } from "express";

import { AppError } from "../core/error";
import {
  assertSubjectAccess,
  getSubjectIdFromResource,
} from "../modules/access/service";

import type { SubjectResource } from "../modules/access/types";

interface RequireSubjectAccessOptions {
  resource: SubjectResource;
  param?: string;
}

export const requireSubjectAccess = ({
  resource,
  param = "id",
}: RequireSubjectAccessOptions): RequestHandler => {
  return async (req, _res, next) => {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required");
      }

      const resourceId = req.params[param];

      if (typeof resourceId !== "string" || !resourceId) {
        throw AppError.badRequest("Invalid resource ID");
      }

      const subjectId = await getSubjectIdFromResource({
        resource,
        resourceId,
      });

      await assertSubjectAccess({
        subjectId,
        userId: req.user.id,
      });

      next();
    } catch (error) {
      next(error);
    }
  };
};
