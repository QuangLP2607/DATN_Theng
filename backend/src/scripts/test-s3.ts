import "dotenv/config";

import { HeadBucketCommand } from "@aws-sdk/client-s3";

import s3Client, { S3_BUCKET_NAME, S3_REGION } from "../config/s3";

const testS3Connection = async (): Promise<void> => {
  try {
    await s3Client.send(
      new HeadBucketCommand({
        Bucket: S3_BUCKET_NAME,
      }),
    );

    console.log("--------------------------------");
    console.log("[S3] Connection successful!");
    console.log(`[S3] Bucket: ${S3_BUCKET_NAME}`);
    console.log(`[S3] Region: ${S3_REGION}`);
    console.log("--------------------------------");
  } catch (error) {
    console.error("[S3] Connection failed:", error);
    process.exitCode = 1;
  } finally {
    s3Client.destroy();
  }
};

testS3Connection();
