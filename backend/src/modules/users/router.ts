import { Router } from "express";

import {
  getMe,
  updateMe,
  getUsers,
  getUserById,
  updateUser,
} from "./controller";

import { authMiddleware } from "../../middlewares/auth";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { validateZod } from "../../middlewares/validateZod";

import { uuidParamSchema } from "../../shared/validation/uuidParam";

import { listUsersQuerySchema } from "./dto/listUsers";
import { updateProfileSchema } from "./dto/updateProfile";
import { updateUserSchema } from "./dto/updateUser";

const router = Router();

router.use(authMiddleware);

// Current user
router.get("/me", getMe);

router.patch("/me", validateZod({ body: updateProfileSchema }), updateMe);

// Admin: User management
router.get(
  "/",
  requireAdmin,
  validateZod({ query: listUsersQuerySchema }),
  getUsers,
);

router.get(
  "/:id",
  requireAdmin,
  validateZod({ params: uuidParamSchema }),
  getUserById,
);

router.patch(
  "/:id",
  requireAdmin,
  validateZod({
    params: uuidParamSchema,
    body: updateUserSchema,
  }),
  updateUser,
);

export default router;
