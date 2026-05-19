import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login";
import AdminLayout from "../layouts/AdminLayout.tsx";
import Dashboard from "../pages/admin/Dashboard";
import ProductManagement from "../pages/admin/ProductManagement";
import UserManagement from "../pages/admin/UserManagement";
import OrderManagement from "../pages/admin/OrderManagement";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "products", element: <ProductManagement /> },
      { path: "users", element: <UserManagement /> },
      { path: "orders", element: <OrderManagement /> },
    ],
  },
]);