import { S3Client } from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET;

if (!region) {
  throw new Error("AWS_REGION is not configured");
}

if (!bucket) {
  throw new Error("AWS_S3_BUCKET is not configured");
}

const parsePositiveInteger = (
  value: string | undefined,
  fallback: number,
): number => {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const s3Client = new S3Client({
  region,
});

export const S3_BUCKET = bucket;

// AWS presigned URL có thời hạn tối đa 7 ngày.
export const S3_PRESIGNED_URL_EXPIRES = Math.min(
  parsePositiveInteger(process.env.S3_PRESIGNED_URL_EXPIRES, 3600),
  604800,
);

// Cache URL ngắn hơn thời hạn URL thực tế.
export const S3_PRESIGNED_URL_CACHE_TTL = Math.min(
  parsePositiveInteger(process.env.S3_PRESIGNED_URL_CACHE_TTL, 3300),
  S3_PRESIGNED_URL_EXPIRES - 1,
);
