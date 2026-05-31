import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AUTH_KEY } from "../constants/auth.constant";

type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const rawAuth = localStorage.getItem(AUTH_KEY);

  if (!rawAuth) {
    return <Navigate to="/login" replace />;
  }

  try {
    const auth = JSON.parse(rawAuth);
    const role = auth?.role;

    if (!auth?.token) {
      return <Navigate to="/login" replace />;
    }

if (role?.toUpperCase() !== "ADMIN") {
  return <Navigate to="/" replace />;
}

    return children;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;