import type { Sheet } from "./sheet";

export interface Workbook {
  id: string;
  ownerId: string;
  name: string;
  sheets: Sheet[];
  createdAt: string;
  updatedAt: string;
}
