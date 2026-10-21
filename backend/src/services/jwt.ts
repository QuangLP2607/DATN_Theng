import dotenv from "dotenv";
import jwt, { type SignOptions } from "jsonwebtoken";

import type { User } from "../generated/prisma/client";

dotenv.config();

/*
 * JWT configuration
 */

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

const JWT_ACCESS_TOKEN_EXPIRES = "1d";
const JWT_REFRESH_TOKEN_EXPIRES = "7d";

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error(
    "Missing JWT_SECRET or JWT_REFRESH_SECRET in environment variables",
  );
}

/*
 * JWT payload
 */
export type JwtPayload = Pick<User, "id" | "role">;

/*
 * -------------------- ACCESS TOKEN --------------------
 */

export function generateAccessToken(user: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: JWT_ACCESS_TOKEN_EXPIRES,
  };

  return jwt.sign(user, JWT_SECRET, options);
}

/*
 * -------------------- REFRESH TOKEN --------------------
 */

export function generateRefreshToken(user: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: JWT_REFRESH_TOKEN_EXPIRES,
  };

  return jwt.sign(user, JWT_REFRESH_SECRET, options);
}

/*
 * -------------------- GENERATE BOTH --------------------
 */

export function generateTokens(user: JwtPayload) {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
}

/*
 * -------------------- VERIFY ACCESS TOKEN --------------------
 */

export function verifyAccessToken(accessToken: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET) as jwt.JwtPayload &
      JwtPayload;

    if (!decoded.id || !decoded.role) {
      return null;
    }

    return {
      id: decoded.id,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

/*
 * -------------------- VERIFY REFRESH TOKEN --------------------
 */

export function verifyRefreshToken(refreshToken: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(
      refreshToken,
      JWT_REFRESH_SECRET,
    ) as jwt.JwtPayload & JwtPayload;

    if (!decoded.id || !decoded.role) {
      return null;
    }

    return {
      id: decoded.id,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

/*
 * -------------------- REFRESH ACCESS TOKEN --------------------
 */

export function refreshAccessToken(refreshToken: string): string | null {
  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded) {
    return null;
  }

  return generateAccessToken({
    id: decoded.id,
    role: decoded.role,
  });
}
