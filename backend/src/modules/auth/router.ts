import { Router } from "express";

import {
  activateAccount,
  logout,
  refreshToken,
  resendActivation,
  signIn,
  signUp,
} from "./controller";

import { authMiddleware } from "../../middlewares/auth";
import { validateZod } from "../../middlewares/validateZod";
import { AppError } from "../../core/error";

import { signInSchema } from "./dto/signIn";
import { signUpSchema } from "./dto/signUp";
import { activateAccountSchema } from "./dto/activateAccount";
import { resendActivationSchema } from "./dto/resendActivation";

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
 * -------------------- ACTIVATE ACCOUNT --------------------
 * Public endpoint.
 */

router.post(
  "/activate-account",
  validateZod({
    body: activateAccountSchema,
  }),
  activateAccount,
);

/*
 * -------------------- RESEND ACTIVATION EMAIL --------------------
 * Public endpoint.
 */

router.post(
  "/resend-activation",
  validateZod({
    body: resendActivationSchema,
  }),
  resendActivation,
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
