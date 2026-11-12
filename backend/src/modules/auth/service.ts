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

const SALT_ROUNDS = 12;
const ACTIVATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

/*
 * -------------------- ACTIVATION TOKEN --------------------
 */

const generateActivationToken = () => {
  const token = randomBytes(32).toString("hex");

  const tokenHash = createHash("sha256").update(token).digest("hex");

  return {
    token,
    tokenHash,
  };
};

const hashActivationToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

/*
 * -------------------- SIGN UP --------------------
 *
 * Only ADMIN can register accounts.
 * New accounts must activate their email before signing in.
 */

export const signUp = async (data: SignUpDto) => {
  const { token, tokenHash } = generateActivationToken();

  const temporaryPassword = randomBytes(32).toString("hex");

  const passwordHash = await bcrypt.hash(temporaryPassword, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      role: data.role,
      status: "INACTIVE",
      passwordHash,
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
    // Remove the newly created account if email delivery fails.
    await prisma.user.deleteMany({
      where: {
        id: user.id,
        activationTokenHash: tokenHash,
      },
    });

    throw error;
  }

  return user;
};

/*
 * -------------------- ACTIVATE ACCOUNT --------------------
 */

export const activateAccount = async (data: ActivateAccountDto) => {
  const tokenHash = hashActivationToken(data.token);
  const now = new Date();

  const user = await prisma.user.findFirst({
    where: {
      activationTokenHash: tokenHash,
      activationTokenExpiresAt: {
        gt: now,
      },
      emailVerifiedAt: null,
      status: "INACTIVE",
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw AppError.unauthorized("Activation link is invalid or expired");
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

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
  const genericResponse = {
    message:
      "If the account requires activation, an activation email will be sent.",
  };

  const user = await prisma.user.findFirst({
    where: {
      email: data.email,
      emailVerifiedAt: null,
      status: "INACTIVE",
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (!user) {
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

  if (result.count !== 1) {
    return genericResponse;
  }

  try {
    await sendActivationEmail({
      email: user.email,
      name: user.name,
      token,
    });
  } catch (error) {
    // Invalidate the new token if email delivery fails.
    await prisma.user.updateMany({
      where: {
        id: user.id,
        activationTokenHash: tokenHash,
      },
      data: {
        activationTokenHash: null,
        activationTokenExpiresAt: null,
      },
    });

    throw error;
  }

  return genericResponse;
};

/*
 * -------------------- SIGN IN --------------------
 */

export const signIn = async (data: SignInDto) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatarKey: true,
      role: true,
      status: true,
      passwordHash: true,
      emailVerifiedAt: true,
    },
  });

  // Do not reveal whether an email exists.
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
      avatarKey: user.avatarKey,
      role: user.role,
      status: user.status,
    },
  };
};
