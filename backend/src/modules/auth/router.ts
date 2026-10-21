import { Router } from "express";

import { logout, refreshToken, signIn, signUp } from "./controller";
import { authMiddleware } from "../../middlewares/auth";
import { validateZod } from "../../middlewares/validateZod";
import { AppError } from "../../core/error";

import { signInSchema } from "./dto/signIn";
import { signUpSchema } from "./dto/signUp";

const router = Router();

/*
 * -------------------- SIGN UP --------------------
 * Only ADMIN can create accounts.
 */

router.post(
  "/sign-up",
  authMiddleware,
  (req, _res, next) => {
    if (req.user?.role !== "ADMIN") {
      return next(AppError.forbidden("Only admins can register accounts"));
    }

    next();
  },
  validateZod({
    body: signUpSchema,
  }),
  signUp,
);

/*
 * -------------------- SIGN IN --------------------
 */

router.post(
  "/sign-in",
  validateZod({
    body: signInSchema,
  }),
  signIn,
);

/*
 * -------------------- LOGOUT --------------------
 */

router.post("/logout", logout);

/*
 * -------------------- REFRESH TOKEN --------------------
 */

router.post("/refresh-token", refreshToken);

export default router;
