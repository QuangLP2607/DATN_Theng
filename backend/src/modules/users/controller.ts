import type { NextFunction, Request, Response } from "express";

import { sendResponse } from "../../core/response";
import * as userService from "./service";

import type { ListUsersQueryDto } from "./dto/listUsers";
import type { UpdateProfileDto } from "./dto/updateProfile";
import type { UpdateUserDto } from "./dto/updateUser";
import type { UuidParam } from "../../shared/validation/uuidParam";

/*
 * -------------------- GET CURRENT USER --------------------
 */

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      sendResponse(res, 401, {
        message: "Authentication required",
      });
      return;
    }

    const user = await userService.getMe(req.user.id);

    sendResponse(res, 200, {
      message: "Get profile successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- UPDATE CURRENT USER PROFILE --------------------
 */

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      sendResponse(res, 401, {
        message: "Authentication required",
      });
      return;
    }

    const body = res.locals.validated.body as UpdateProfileDto;

    const user = await userService.updateProfile(req.user.id, body);

    sendResponse(res, 200, {
      message: "Update profile successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- LIST USERS --------------------
 */

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = res.locals.validated.query as ListUsersQueryDto;

    const result = await userService.getUsers(query);

    sendResponse(res, 200, {
      message: "Get users successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- GET USER BY ID --------------------
 */

export const getUserById = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = res.locals.validated.params as UuidParam;

    const user = await userService.getUserById(params.id);

    sendResponse(res, 200, {
      message: "Get user successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- UPDATE USER --------------------
 */

export const updateUser = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = res.locals.validated.params as UuidParam;
    const body = res.locals.validated.body as UpdateUserDto;

    const user = await userService.updateUser(params.id, body);

    sendResponse(res, 200, {
      message: "Update user successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
