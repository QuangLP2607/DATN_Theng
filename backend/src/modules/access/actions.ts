export const AccessAction = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
} as const;

export type AccessAction = (typeof AccessAction)[keyof typeof AccessAction];
