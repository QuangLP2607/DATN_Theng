import type { NextFunction, Request, Response } from "express";
import ms, { type StringValue } from "ms";

import { sendResponse } from "../../core/response";
import { refreshAccessToken } from "../../services/jwt";

import * as authService from "./service";

/*
 * -------------------- SIGN UP --------------------
 * Only ADMIN can register accounts.
 */

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    if (!req.user) {
      return sendResponse(res, 401, {
        message: "Authentication required",
      });
    }

    if (req.user.role !== "ADMIN") {
      return sendResponse(res, 403, {
        message: "Only admins can register accounts",
      });
    }

    const user = await authService.signUp(req.body);

    return sendResponse(res, 201, {
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
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const result = await authService.signIn(req.body);

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

    return sendResponse(res, 200, {
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
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const result = await authService.activateAccount(req.body);

    return sendResponse(res, 200, {
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
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const result = await authService.resendActivation(req.body);

    return sendResponse(res, 200, {
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
): Promise<Response | void> => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return sendResponse(res, 200, {
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
): Promise<Response | void> => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return sendResponse(res, 401, {
        message: "Missing refresh token",
      });
    }

    const newAccessToken = refreshAccessToken(token);

    if (!newAccessToken) {
      return sendResponse(res, 403, {
        message: "Invalid or expired refresh token",
      });
    }

    return sendResponse(res, 200, {
      message: "Access token refreshed successfully",
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
