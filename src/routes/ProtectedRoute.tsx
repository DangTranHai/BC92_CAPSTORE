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

  const auth = JSON.parse(rawAuth);

  if (!auth?.token || auth?.user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;