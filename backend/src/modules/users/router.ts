import { Router } from "express";

import {
  getMe,
  updateMe,
  getUsers,
  getUserById,
  updateUser,
} from "./controller";

import { authMiddleware } from "../../middlewares/auth";
import { validateZod } from "../../middlewares/validateZod";
import { AppError } from "../../core/error";

import { uuidParamSchema } from "../../shared/validation/uuidParam";
import { listUsersQuerySchema } from "./dto/listUsers";
import { updateProfileSchema } from "./dto/updateProfile";
import { updateUserSchema } from "./dto/updateUser";

const router = Router();

router.use(authMiddleware);

/*
 * -------------------- CURRENT USER --------------------
 */

router.get("/me", getMe);

router.patch(
  "/me",
  validateZod({
    body: updateProfileSchema,
  }),
  updateMe,
);

/*
 * -------------------- ADMIN: USER MANAGEMENT --------------------
 */

router.get(
  "/",
  (req, _res, next) => {
    if (req.user?.role !== "ADMIN") {
      return next(AppError.forbidden("Only admins can view all users"));
    }

    next();
  },
  validateZod({
    query: listUsersQuerySchema,
  }),
  getUsers,
);

router.get(
  "/:id",
  (req, _res, next) => {
    if (req.user?.role !== "ADMIN") {
      return next(AppError.forbidden("Only admins can view user details"));
    }

    next();
  },
  validateZod({
    params: uuidParamSchema,
  }),
  getUserById,
);

router.patch(
  "/:id",
  (req, _res, next) => {
    if (req.user?.role !== "ADMIN") {
      return next(AppError.forbidden("Only admins can update users"));
    }

    next();
  },
  validateZod({
    params: uuidParamSchema,
    body: updateUserSchema,
  }),
  updateUser,
);

export default router;
