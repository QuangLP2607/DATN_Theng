import { createContext } from "react";

import type { User } from "@/interfaces/user";

export interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;

  login: (accessToken: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
