import type { RequestHandler } from "express";

import { AppError } from "../../../core/error";
import { defineAbilityFor } from "../ability/ability.factory";

export const loadAbility: RequestHandler = (req, _res, next) => {
  try {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required");
    }

    req.ability = defineAbilityFor({
      id: req.user.id,
      role: req.user.role,
    });

    next();
  } catch (error) {
    next(error);
  }
};
