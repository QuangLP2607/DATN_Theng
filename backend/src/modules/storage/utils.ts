
import { randomUUID } from "node:crypto";
import path from "node:path";

import { AppError } from "../../core/error";

export const sanitizeFileName = (
  fileName: string,
): string => {
  const extension = path.extname(fileName).toLowerCase();

  const name = path
    .basename(fileName, path.extname(fileName))
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);

  return `${name || "file"}${extension}`;
};

export const sanitizeFolder = (
  folder: string,
): string => {
  const normalized = folder
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "");

  const segments = normalized.split("/");

  if (
    !normalized ||
    segments.some(
      (segment) =>
        !segment ||
        segment === "." ||
        segment === ".." ||
        !/^[a-zA-Z0-9_-]+$/.test(segment),
    )
  ) {
    throw AppError.badRequest("Invalid storage folder");
  }

  return normalized;
};

export const generateStorageKey = (
  folder: string,
  fileName: string,
): string => {
  const safeFolder = sanitizeFolder(folder);
  const safeFileName = sanitizeFileName(fileName);

  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  return [
    safeFolder,
    year,
    month,
    `${randomUUID()}-${safeFileName}`,
  ].join("/");
};

export const validateStorageKey = (
  storageKey: string,
): void => {
  if (
    !storageKey ||
    storageKey.startsWith("/") ||
    storageKey.includes("\\") ||
    storageKey.includes("\0")
  ) {
    throw AppError.badRequest("Invalid storage key");
  }

  const segments = storageKey.split("/");

  if (
    segments.some(
      (segment) =>
        !segment ||
        segment === "." ||
        segment === "..",
    )
  ) {
    throw AppError.badRequest("Invalid storage key");
  }
};
