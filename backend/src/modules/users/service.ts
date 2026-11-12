import { Prisma } from "../../generated/prisma/client";

import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";

import { AccessAction } from "../access/actions";
import { accessibleBy } from "../access/casl-prisma";
import type { AppAbility } from "../access/casl-prisma";

import type { Pagination } from "../../utils/zod";

import type { ListUsersQueryDto } from "./dto/listUsers";
import type { UpdateProfileDto } from "./dto/updateProfile";
import type { UpdateUserDto } from "./dto/updateUser";

/*
 * -------------------- SELECT --------------------
 */

const userSelect = {
  id: true,
  email: true,
  name: true,
  avatarKey: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type UserResponse = Prisma.UserGetPayload<{
  select: typeof userSelect;
}>;

/*
 * -------------------- GET CURRENT USER --------------------
 */

export const getMe = async (
  ability: AppAbility,
  userId: string,
): Promise<UserResponse> => {
  const accessWhere: Prisma.UserWhereInput = accessibleBy(
    ability,
    AccessAction.READ,
  ).ofType("User");

  const user = await prisma.user.findFirst({
    where: {
      AND: [{ id: userId }, accessWhere],
    },
    select: userSelect,
  });

  if (!user) {
    throw AppError.notFound("User not found");
  }

  return user;
};

/*
 * -------------------- LIST USERS --------------------
 */

export const getUsers = async (
  ability: AppAbility,
  query: ListUsersQueryDto,
) => {
  const { page, limit, search, role, status, sortBy, order } = query;

  const accessWhere: Prisma.UserWhereInput = accessibleBy(
    ability,
    AccessAction.READ,
  ).ofType("User");

  const conditions: Prisma.UserWhereInput[] = [accessWhere];

  if (role) {
    conditions.push({ role });
  }

  if (status) {
    conditions.push({ status });
  }

  if (search) {
    conditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  const where: Prisma.UserWhereInput = {
    AND: conditions,
  };

  const skip = (page - 1) * limit;

  const orderBy: Prisma.UserOrderByWithRelationInput = {
    [sortBy]: order,
  };

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: userSelect,
      orderBy: [orderBy, { id: "asc" }],
      skip,
      take: limit,
    }),

    prisma.user.count({
      where,
    }),
  ]);

  const pagination: Pagination = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  return {
    users,
    pagination,
  };
};

/*
 * -------------------- GET USER BY ID --------------------
 */

export const getUserById = async (
  ability: AppAbility,
  id: string,
): Promise<UserResponse> => {
  const accessWhere: Prisma.UserWhereInput = accessibleBy(
    ability,
    AccessAction.READ,
  ).ofType("User");

  const user = await prisma.user.findFirst({
    where: {
      AND: [{ id }, accessWhere],
    },
    select: userSelect,
  });

  if (!user) {
    throw AppError.notFound("User not found");
  }

  return user;
};

/*
 * -------------------- UPDATE CURRENT USER PROFILE --------------------
 */

export const updateProfile = async (
  ability: AppAbility,
  userId: string,
  data: UpdateProfileDto,
): Promise<UserResponse> => {
  const accessWhere: Prisma.UserWhereInput = accessibleBy(
    ability,
    AccessAction.UPDATE,
  ).ofType("User");

  const result = await prisma.user.updateMany({
    where: {
      AND: [{ id: userId }, accessWhere],
    },
    data,
  });

  if (result.count !== 1) {
    throw AppError.notFound("User not found");
  }

  return getMe(ability, userId);
};

/*
 * -------------------- UPDATE USER --------------------
 */

export const updateUser = async (
  ability: AppAbility,
  id: string,
  data: UpdateUserDto,
): Promise<UserResponse> => {
  const accessWhere: Prisma.UserWhereInput = accessibleBy(
    ability,
    AccessAction.UPDATE,
  ).ofType("User");

  const result = await prisma.user.updateMany({
    where: {
      AND: [{ id }, accessWhere],
    },
    data,
  });

  if (result.count !== 1) {
    throw AppError.notFound("User not found");
  }

  return getUserById(ability, id);
};
