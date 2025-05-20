import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Mainlayout from "./pages/mainlayout";
import GuestUserHome from "./pages/guestUserHome";
import UserDashboard from "./pages/user/userDashboard";
import LoginPage from "./pages/login";
import Register from "./pages/register";
import { Notfound } from "./pages/error/notfound";
import Appointment from "./pages/Appointment";
import AdminHome from "./pages/admin/adminHome";
import UserDetails from "./pages/admin/userDetails";
import { ToastContainer } from "react-toastify";
import AddDoctor from "./pages/admin/addDoctor";
import DoctorProfilePage from "./pages/DoctorProfilePage";
import DoctorHomePage from "./pages/doctor/DoctorHome";
import ProtectedRoutes from "./functions/ProtectedRoutes";
import UserHome from "./pages/user/userHome";
import "react-toastify/dist/ReactToastify.css";
import DoctorsAppointments from "./pages/doctor/DoctorsAppointments";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import UpdateProfile from "./pages/doctor/updateProfile";
import PasswordChange from "./pages/PasswordChange";
import TestHomepage from "./pages/test/testHomepage";
import TestDoctorpage from "./pages/test/Testdoctorpage";
import TestDoctorProfile from "./pages/test/TestDoctorProfile";
import TestServices from "./pages/test/TestServices";

const router = createBrowserRouter([
  // ── Public ─────────────────────────────────────────────────────
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <Register /> },
  // { path: "/", element: <GuestUserHome /> },
  { path: "*", element: <Notfound /> },
  {
    path: "/", // at “/”
    element: <Mainlayout />, // show navbar/layout
    children: [
      { path: "/", element: <TestHomepage /> },
      { path: "/testdoctor", element: <TestDoctorpage /> },
      { path: "/testdoctor/:id", element: <TestDoctorProfile /> },
      { path: "/testservices", element: <TestServices /> },
      { path: "/appointment/calendar", element: <Appointment /> },
      { path: "/appointment/details", element: <UserDashboard /> },
      { path: "/account/change-password", element: <PasswordChange /> },

      // ── Authenticated ──────────────────────────────────────────────

      // ── Doctor + Admin ─────────────────────────
      {
        element: <ProtectedRoutes allowedRoles={["doctor", "admin"]} />,
        children: [
          { path: "/doctor/dashboard", element: <DoctorHomePage /> },
          {
            path: "/doctor/appointments",
            element: <DoctorsAppointments />,
          },
          { path: "/doctor/Profile/:id", element: <DoctorProfile /> },
          {
            path: "/doctor/Profile/update/:id",
            element: <UpdateProfile />,
          },
        ],
      },

      // ── Admin Only ─────────────────────────────
      {
        element: <ProtectedRoutes allowedRoles={["admin"]} />,
        children: [
          { path: "/admin/dashboard", element: <AdminHome /> },
          { path: "/patient/details", element: <UserDetails /> },
          { path: "/admin/doctors/new", element: <AddDoctor /> },
          { path: "/admin/doctors/:id", element: <DoctorProfilePage /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}
