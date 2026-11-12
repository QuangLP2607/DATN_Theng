import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import {
  s3Client,
  S3_BUCKET,
  S3_PRESIGNED_URL_EXPIRES,
  S3_PRESIGNED_URL_CACHE_TTL,
} from "../../config/s3";

import redis from "../../config/redis";
import { AppError } from "../../core/error";

import { STORAGE_CACHE_PREFIX } from "./constants";

import type {
  GetFileUrlOptions,
  UploadFileInput,
  UploadFileResponse,
} from "./types";

import { generateStorageKey, validateStorageKey } from "./utils";

/*
 * -------------------- CACHE --------------------
 */

const getCacheKey = (
  storageKey: string,
  options: GetFileUrlOptions,
): string => {
  const disposition = options.download ? "attachment" : "inline";

  return [
    STORAGE_CACHE_PREFIX,
    storageKey,
    disposition,
    options.fileName ?? "",
    options.expiresIn ?? S3_PRESIGNED_URL_EXPIRES,
  ].join(":");
};

/*
 * -------------------- UPLOAD --------------------
 */

export const uploadFile = async ({
  file,
  folder,
}: UploadFileInput): Promise<UploadFileResponse> => {
  if (!file || !file.buffer || file.size <= 0) {
    throw AppError.badRequest("Invalid upload file");
  }

  const storageKey = generateStorageKey(folder, file.originalname);

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: storageKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.size,
      }),
    );

    return {
      storageKey,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  } catch (error) {
    console.error("[Storage] Upload failed:", error);

    throw AppError.internal("Unable to upload file");
  }
};

/*
 * -------------------- GET FILE URL --------------------
 */

export const getFileUrl = async (
  storageKey: string,
  options: GetFileUrlOptions = {},
): Promise<string> => {
  validateStorageKey(storageKey);

  const expiresIn = Math.min(
    Math.max(60, options.expiresIn ?? S3_PRESIGNED_URL_EXPIRES),
    S3_PRESIGNED_URL_EXPIRES,
  );

  const normalizedOptions: GetFileUrlOptions = {
    ...options,
    expiresIn,
  };

  const cacheKey = getCacheKey(storageKey, normalizedOptions);

  // Redis cache.
  try {
    const cachedUrl = await redis.get(cacheKey);

    if (cachedUrl) {
      return cachedUrl;
    }
  } catch (error) {
    console.error("[Storage] Redis get failed:", error);
  }

  try {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: storageKey,

      ResponseContentDisposition: options.download
        ? `attachment${options.fileName ? `; filename="${options.fileName.replace(/["\\\r\n]/g, "_")}"` : ""}`
        : undefined,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn,
    });

    // Cache URL, but never longer than its actual expiration.
    const cacheTTL = Math.min(S3_PRESIGNED_URL_CACHE_TTL, expiresIn - 1);

    try {
      await redis.set(cacheKey, url, "EX", cacheTTL);
    } catch (error) {
      console.error("[Storage] Redis set failed:", error);
    }

    return url;
  } catch (error) {
    console.error("[Storage] Generate URL failed:", error);

    throw AppError.internal("Unable to generate file URL");
  }
};

/*
 * -------------------- DELETE --------------------
 */

export const deleteFile = async (storageKey: string): Promise<void> => {
  validateStorageKey(storageKey);

  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: S3_BUCKET,
        Key: storageKey,
      }),
    );
  } catch (error) {
    console.error("[Storage] Delete failed:", error);

    throw AppError.internal("Unable to delete file");
  }

  // Invalidate every cached URL for this object.
  try {
    const keys = await redis.keys(`${STORAGE_CACHE_PREFIX}${storageKey}:*`);

    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error("[Storage] Redis cache invalidation failed:", error);
  }
};
