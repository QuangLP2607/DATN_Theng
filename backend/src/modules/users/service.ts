import { Prisma } from "../../generated/prisma/client";

import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";

import type { ListUsersQueryDto } from "./dto/listUsers";
import type { UpdateProfileDto } from "./dto/updateProfile";
import type { UpdateUserDto } from "./dto/updateUser";

const userSelect = {
  id: true,
  email: true,
  name: true,
  avatar: true,
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

export const getMe = async (userId: string): Promise<UserResponse> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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

export const getUsers = async (query: ListUsersQueryDto) => {
  const {
    page = 1,
    limit = 10,
    search,
    role,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const where: Prisma.UserWhereInput = {
    ...(role && { role }),
    ...(status && { status }),
    ...(search && {
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
    }),
  };

  const skip = (page - 1) * limit;

  const orderBy: Prisma.UserOrderByWithRelationInput = {
    [sortBy]: sortOrder,
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

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/*
 * -------------------- GET USER BY ID --------------------
 */

export const getUserById = async (id: string): Promise<UserResponse> => {
  const user = await prisma.user.findUnique({
    where: { id },
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
  userId: string,
  data: UpdateProfileDto,
): Promise<UserResponse> => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!existingUser) {
    throw AppError.notFound("User not found");
  }

  return prisma.user.update({
    where: { id: userId },
    data,
    select: userSelect,
  });
};

/*
 * -------------------- ADMIN UPDATE USER --------------------
 */

export const updateUser = async (
  id: string,
  data: UpdateUserDto,
): Promise<UserResponse> => {
  const existingUser = await prisma.user.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingUser) {
    throw AppError.notFound("User not found");
  }

  return prisma.user.update({
    where: { id },
    data,
    select: userSelect,
  });
};
