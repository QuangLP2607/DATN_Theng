import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcrypt";

import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";
import { generateTokens } from "../../services/jwt";
import { sendActivationEmail } from "../../services/email";

import type { SignUpDto } from "./dto/signUp";
import type { SignInDto } from "./dto/signIn";
import type { ActivateAccountDto } from "./dto/activateAccount";
import type { ResendActivationDto } from "./dto/resendActivation";

const SALT_ROUNDS = 10;
const ACTIVATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const generateActivationToken = () => {
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");

  return { token, tokenHash };
};

/*
 * -------------------- SIGN UP --------------------
 */

export const signUp = async (data: SignUpDto) => {
  const email = data.email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw AppError.conflict("Email is already registered");
  }

  const { token, tokenHash } = generateActivationToken();

  const temporaryPasswordHash = await bcrypt.hash(
    randomBytes(32).toString("hex"),
    SALT_ROUNDS,
  );

  const user = await prisma.user.create({
    data: {
      email,
      name: data.name.trim(),
      role: data.role,
      status: "INACTIVE",
      passwordHash: temporaryPasswordHash,
      emailVerifiedAt: null,
      activationTokenHash: tokenHash,
      activationTokenExpiresAt: new Date(Date.now() + ACTIVATION_TOKEN_TTL_MS),
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  try {
    await sendActivationEmail({
      email: user.email,
      name: user.name,
      token,
    });
  } catch (error) {
    await prisma.user.delete({
      where: { id: user.id },
    });

    throw error;
  }

  return user;
};

/*
 * -------------------- ACTIVATE ACCOUNT --------------------
 */

export const activateAccount = async (data: ActivateAccountDto) => {
  const tokenHash = createHash("sha256").update(data.token).digest("hex");

  const user = await prisma.user.findUnique({
    where: { activationTokenHash: tokenHash },
  });

  if (
    !user ||
    !user.activationTokenExpiresAt ||
    user.activationTokenExpiresAt.getTime() <= Date.now() ||
    user.emailVerifiedAt
  ) {
    throw AppError.unauthorized("Activation link is invalid or expired");
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const now = new Date();

  const result = await prisma.user.updateMany({
    where: {
      id: user.id,
      activationTokenHash: tokenHash,
      activationTokenExpiresAt: {
        gt: now,
      },
      emailVerifiedAt: null,
      status: "INACTIVE",
    },
    data: {
      passwordHash,
      emailVerifiedAt: now,
      activationTokenHash: null,
      activationTokenExpiresAt: null,
      status: "ACTIVE",
    },
  });

  if (result.count !== 1) {
    throw AppError.unauthorized("Activation link is invalid or expired");
  }

  return {
    message: "Account activated successfully",
  };
};

/*
 * -------------------- RESEND ACTIVATION EMAIL --------------------
 */

export const resendActivation = async (data: ResendActivationDto) => {
  const email = data.email.trim().toLowerCase();

  const genericResponse = {
    message:
      "If the account requires activation, an activation email will be sent.",
  };

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.emailVerifiedAt || user.status !== "INACTIVE") {
    return genericResponse;
  }

  const { token, tokenHash } = generateActivationToken();

  const result = await prisma.user.updateMany({
    where: {
      id: user.id,
      emailVerifiedAt: null,
      status: "INACTIVE",
    },
    data: {
      activationTokenHash: tokenHash,
      activationTokenExpiresAt: new Date(Date.now() + ACTIVATION_TOKEN_TTL_MS),
    },
  });

  if (result.count === 1) {
    await sendActivationEmail({
      email: user.email,
      name: user.name,
      token,
    });
  }

  return genericResponse;
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

  if (!user.emailVerifiedAt) {
    throw AppError.unauthorized(
      "Please activate your account using the link sent to your email",
    );
  }

  if (user.status !== "ACTIVE") {
    throw AppError.unauthorized("Account is inactive");
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
