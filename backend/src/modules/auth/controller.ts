import type { Request, Response, NextFunction } from "express";
import ms, { type StringValue } from "ms";

import { sendResponse } from "../../core/response";
import { AppError } from "../../core/error";

import { refreshAccessToken } from "../../services/jwt";

import { AccessAction } from "../access/actions";

import * as authService from "./service";

import type { SignUpDto } from "./dto/signUp";
import type { SignInDto } from "./dto/signIn";
import type { ActivateAccountDto } from "./dto/activateAccount";
import type { ResendActivationDto } from "./dto/resendActivation";

const getRefreshCookieOptions = () => {
  const expiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRES ?? "7d";

  const maxAge = ms(expiresIn as StringValue);

  if (maxAge === undefined || maxAge <= 0) {
    throw new Error(`Invalid JWT_REFRESH_TOKEN_EXPIRES: ${expiresIn}`);
  }

  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
};

const clearRefreshCookie = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
};

/*
 * -------------------- SIGN UP --------------------
 */

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.ability) {
      throw AppError.unauthorized("Authorization ability not initialized");
    }

    if (!req.ability.can(AccessAction.CREATE, "User")) {
      throw AppError.forbidden("You are not allowed to create users");
    }

    const body = res.locals.validated.body as SignUpDto;

    const user = await authService.signUp(body);

    sendResponse(res, 201, {
      message: "User created successfully. Activation email has been sent.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- SIGN IN --------------------
 */

export const signIn = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = res.locals.validated.body as SignInDto;

    const result = await authService.signIn(body);

    res.cookie("refreshToken", result.refreshToken, getRefreshCookieOptions());

    sendResponse(res, 200, {
      message: "Sign in successfully",
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- ACTIVATE ACCOUNT --------------------
 */

export const activateAccount = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = res.locals.validated.body as ActivateAccountDto;

    const result = await authService.activateAccount(body);

    sendResponse(res, 200, {
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- RESEND ACTIVATION EMAIL --------------------
 */

export const resendActivation = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = res.locals.validated.body as ResendActivationDto;

    const result = await authService.resendActivation(body);

    sendResponse(res, 200, {
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- LOGOUT --------------------
 */

export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    clearRefreshCookie(res);

    sendResponse(res, 200, {
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- REFRESH TOKEN --------------------
 */

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token || typeof token !== "string") {
      throw AppError.unauthorized("Refresh token is missing");
    }

    const accessToken = refreshAccessToken(token);

    if (!accessToken) {
      clearRefreshCookie(res);

      throw AppError.unauthorized("Refresh token is invalid or expired");
    }

    sendResponse(res, 200, {
      message: "Access token refreshed successfully",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
