import type { Request, Response, NextFunction } from "express";
import ms, { type StringValue } from "ms";

import { sendResponse } from "../../core/response";
import { refreshAccessToken } from "../../services/jwt";

import * as authService from "./service";

import type { SignUpDto } from "./dto/signUp";
import type { SignInDto } from "./dto/signIn";
import type { ActivateAccountDto } from "./dto/activateAccount";
import type { ResendActivationDto } from "./dto/resendActivation";

/*
 * -------------------- SIGN UP --------------------
 * Only ADMIN can register accounts.
 */

export const signUp = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = res.locals.validated.body as SignUpDto;

    const user = await authService.signUp(body);

    sendResponse(res, 201, {
      message: "Sign up successfully",
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

    const { accessToken, refreshToken, user } = result;

    const refreshTokenExpires = process.env.JWT_REFRESH_TOKEN_EXPIRES ?? "7d";

    const maxAgeMs = ms(refreshTokenExpires as StringValue);

    if (maxAgeMs === undefined || maxAgeMs <= 0) {
      throw new Error(
        `Invalid time format for JWT_REFRESH_TOKEN_EXPIRES: ${refreshTokenExpires}`,
      );
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: maxAgeMs,
    });

    sendResponse(res, 200, {
      message: "Sign in successfully",
      data: {
        accessToken,
        user,
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
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

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

    if (!token) {
      sendResponse(res, 401, {
        message: "Missing refresh token",
      });
      return;
    }

    const newAccessToken = refreshAccessToken(token);

    if (!newAccessToken) {
      sendResponse(res, 403, {
        message: "Invalid or expired refresh token",
      });
      return;
    }

    sendResponse(res, 200, {
      message: "Access token refreshed successfully",
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
