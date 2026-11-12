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

import { loadAbility } from "../access/middlewares/ability.middleware";

import { signInSchema } from "./dto/signIn";
import { signUpSchema } from "./dto/signUp";
import { activateAccountSchema } from "./dto/activateAccount";
import { resendActivationSchema } from "./dto/resendActivation";

const router = Router();

/*
 * -------------------- SIGN UP --------------------
 * ADMIN only
 */

router.post(
  "/sign-up",
  authMiddleware,
  loadAbility,
  validateZod({ body: signUpSchema }),
  signUp,
);

/*
 * -------------------- SIGN IN --------------------
 * Public
 */

router.post("/sign-in", validateZod({ body: signInSchema }), signIn);

/*
 * -------------------- ACTIVATE ACCOUNT --------------------
 * Public
 */

router.post(
  "/activate-account",
  validateZod({ body: activateAccountSchema }),
  activateAccount,
);

/*
 * -------------------- RESEND ACTIVATION --------------------
 * Public
 */

router.post(
  "/resend-activation",
  validateZod({ body: resendActivationSchema }),
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
