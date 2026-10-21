import bcrypt from "bcrypt";

import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";
import { generateTokens } from "../../services/jwt";

import type { SignUpDto } from "./dto/signUp";
import type { SignInDto } from "./dto/signIn";

const SALT_ROUNDS = 10;

/*
 * -------------------- SIGN UP --------------------
 * Create account with the role supplied in the validated DTO.
 */

export const signUp = async (data: SignUpDto) => {
  const email = data.email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw AppError.conflict("Email is already registered");
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: data.name.trim(),
      role: data.role,
      status: "ACTIVE",
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

/*
 * -------------------- SIGN IN --------------------
 */

export const signIn = async (data: SignInDto) => {
  const email = data.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw AppError.unauthorized("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw AppError.unauthorized("Invalid email or password");
  }

  const { accessToken, refreshToken } = generateTokens({
    id: user.id,
    role: user.role,
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
    },
  };
};
