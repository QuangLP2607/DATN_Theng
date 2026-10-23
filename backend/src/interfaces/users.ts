export const Roles = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export interface IUser {
  id: string;
  email: string;
  passwordHash: string;
  name?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser<R extends Role = Role> {
  id: string;
  role: R;
}
