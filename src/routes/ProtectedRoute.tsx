import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;