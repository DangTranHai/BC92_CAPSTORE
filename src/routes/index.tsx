import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home";
import RoomList from "../pages/rooms/RoomList";
import RoomDetail from "../pages/rooms/RoomDetail.tsx";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import UserManagement from "../pages/admin/UserManagement";
import LocationManagement from "../pages/admin/LocationManagement";
import RoomManagement from "../pages/admin/RoomManagement";
import BookingManagement from "../pages/admin/BookingManagement";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/rooms/:locationId",
    element: <RoomList />,
  },
  {
    path: "/rooms/detail/:id",
    element: <RoomDetail/>
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
       path: "/admin/users",
        element: <UserManagement />,
      },
      {
        path: "locations",
        element: <LocationManagement />,
      },
      {
        path: "rooms",
        element: <RoomManagement />,
      },
      {
        path: "bookings",
        element: <BookingManagement />,
      },
    ],
  },
]);