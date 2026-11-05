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
import { requireAdmin } from "../../middlewares/requireAdmin";
import { validateZod } from "../../middlewares/validateZod";

import { signInSchema } from "./dto/signIn";
import { signUpSchema } from "./dto/signUp";
import { activateAccountSchema } from "./dto/activateAccount";
import { resendActivationSchema } from "./dto/resendActivation";

const router = Router();

// Sign up - Admin only
router.post(
  "/sign-up",
  authMiddleware,
  requireAdmin,
  validateZod({ body: signUpSchema }),
  signUp,
);

// Sign in - Public
router.post("/sign-in", validateZod({ body: signInSchema }), signIn);

// Activate account - Public
router.post(
  "/activate-account",
  validateZod({ body: activateAccountSchema }),
  activateAccount,
);

// Resend activation email - Public
router.post(
  "/resend-activation",
  validateZod({ body: resendActivationSchema }),
  resendActivation,
);

// Logout
router.post("/logout", logout);

// Refresh token
router.post("/refresh-token", refreshToken);

export default router;
