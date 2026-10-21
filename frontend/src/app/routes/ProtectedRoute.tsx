import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/app/providers/Auth";
import type { Role } from "@/interfaces/user";

interface ProtectedRouteProps {
  element: ReactElement;
  allowedRoles?: Role[];
}

const getHomeRoute = (role: Role): string => {
  switch (role) {
    case "STUDENT":
      return "/student";
    case "TEACHER":
      return "/teacher";
    case "ADMIN":
      return "/admin";
  }
};

export const ProtectedRoute = ({
  element,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { isSignedIn, user } = useAuth();

  if (!isSignedIn || !user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getHomeRoute(user.role)} replace />;
  }

  return element;
};

export const PublicRoute = ({ element }: { element: ReactElement }) => {
  const { isSignedIn, user } = useAuth();

  if (isSignedIn && user) {
    return <Navigate to={getHomeRoute(user.role)} replace />;
  }

  return element;
};
