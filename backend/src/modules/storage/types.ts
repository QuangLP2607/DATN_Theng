export interface UploadFileInput {
  file: Express.Multer.File;
  folder: string;
}

export interface UploadFileResponse {
  storageKey: string;
  fileName: string;
  mimeType: string;
  size: number;
}

export interface GetFileUrlOptions {
  expiresIn?: number;
  download?: boolean;
  fileName?: string;
}

export interface StorageFile {
  storageKey: string;
  fileName: string;
  mimeType: string;
  size: number;
}
