import { Router } from "express";

import { getUserStats } from "./controller";

import { authMiddleware } from "../../middlewares/auth";
import { AppError } from "../../core/error";

const router = Router();

router.use(authMiddleware);

router.get(
  "/users",
  (req, _res, next) => {
    if (req.user?.role !== "ADMIN") {
      return next(AppError.forbidden("Only admins can view user statistics"));
    }

    next();
  },
  getUserStats,
);

export default router;
