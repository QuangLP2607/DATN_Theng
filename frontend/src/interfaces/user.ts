export type Role = "STUDENT" | "TEACHER" | "ADMIN";

export type UserStatus = "ACTIVE" | "INACTIVE";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: Role;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}
