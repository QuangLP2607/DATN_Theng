export const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const MAX_FILES = 1;

export const ALLOWED_MIME_TYPES = [
  // Documents
  "application/pdf",

  // Images
  "image/jpeg",
  "image/png",
  "image/webp",

  // Videos
  "video/mp4",
  "video/webm",

  // PowerPoint
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  // Word
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const STORAGE_CACHE_PREFIX = "s3:presigned-url:";

export const STORAGE_FOLDERS = {
  LESSON_ATTACHMENTS: "lesson-attachments",
  COURSE_THUMBNAILS: "course-thumbnails",
  USER_AVATARS: "user-avatars",
} as const;
