import { Router } from "express";

import {
  getMe,
  updateMe,
  getUsers,
  getUserById,
  updateUser,
} from "./controller";

import { authMiddleware } from "../../middlewares/auth";
import { loadAbility } from "../access/middlewares/ability.middleware";
import { validateZod } from "../../middlewares/validateZod";

import { uuidParamSchema } from "../../shared/validation/uuidParam";

import { listUsersQuerySchema } from "./dto/listUsers";
import { updateProfileSchema } from "./dto/updateProfile";
import { updateUserSchema } from "./dto/updateUser";

const router = Router();

router.use(authMiddleware, loadAbility);

// Current user
router.get("/me", getMe);

router.patch("/me", validateZod({ body: updateProfileSchema }), updateMe);

// User management
router.get("/", validateZod({ query: listUsersQuerySchema }), getUsers);

router.get("/:id", validateZod({ params: uuidParamSchema }), getUserById);

router.patch(
  "/:id",
  validateZod({
    params: uuidParamSchema,
    body: updateUserSchema,
  }),
  updateUser,
);

export default router;
