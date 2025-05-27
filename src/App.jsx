import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Mainlayout from "./pages/mainlayout";
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
import Homepage from "./pages/user/Homepage";
import AllDoctorDisplaypage from "./pages/user/AllDoctorDisplaypage";
import AllServices from "./pages/user/AllServices";
import Nouserfound from "./pages/error/no-userfound";
import DoctorLeave from "./pages/doctor/DoctorLeave";
import Contact from "./pages/user/Contact";

const router = createBrowserRouter([
  // ── Public ─────────────────────────────────────────────────────
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <Register /> },
  { path: "*", element: <Notfound /> },
  { path: "/nouserfound", element: <Nouserfound /> },
  {
    path: "/", // at “/”
    element: <Mainlayout />, // show navbar/layout
    children: [
      { path: "/", element: <Homepage /> },
      { path: "/doctors", element: <AllDoctorDisplaypage /> },
      { path: "/services", element: <AllServices /> },
      { path: "/doctor/Profile/:id", element: <DoctorProfile /> },

      // ── Authenticated ──────────────────────────────────────────────

      // ── User + Doctor + Admin ─────────────────────────
      {
        element: <ProtectedRoutes allowedRoles={["user", "admin"]} />,
        children: [
          { path: "/appointment/details", element: <UserDashboard /> },
          { path: "/appointment/calendar", element: <Appointment /> },
          { path: "/account/change-password", element: <PasswordChange /> },
          { path: "/contact", element: <Contact /> },
        ],
      },

      // ── Doctor + Admin ─────────────────────────
      {
        element: <ProtectedRoutes allowedRoles={["doctor", "admin"]} />,
        children: [
          { path: "/doctor/dashboard", element: <DoctorHomePage /> },
          {
            path: "/doctor/appointments",
            element: <DoctorsAppointments />,
          },
          {
            path: "/doctor/Profile/update/:id",
            element: <UpdateProfile />,
          },
          {
            path: "/doctor/leave/:id",
            element: <DoctorLeave />,
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
