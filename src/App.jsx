import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Mainlayout from "./pages/mainlayout";
import GuestUserHome from "./pages/guestUserHome";
import UserDashboard from "./pages/userDashboard";
import LoginPage from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/Home";
import { Notfound } from "./pages/error/notfound";
import Contect from "./pages/contect";
import Appointment from "./pages/Appointment";
import AdminHome from "./pages/adminHome";
import UserDetails from "./pages/userDetails";
import Nouserfound from "./pages/error/no-userfound";
import { ToastContainer } from "react-toastify";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <Notfound />,
  },
  {
    path: "/nouserfound",
    element: <Nouserfound />,
  },
  {
    path: "/guest",
    element: <GuestUserHome />,
  },
  {
    path: "/",
    element: <Mainlayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/dashboard",
        element: <UserDashboard />,
      },
      {
        path: "/admindashboard",
        element: <AdminHome />,
      },
      {
        path: "/userdetails",
        element: <UserDetails />,
      },

      {
        path: "/contect",
        element: <Contect />,
      },
      {
        path: "/appointment",
        element: <Appointment />,
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
