import React from "react";
import GlobalStatus from "./components/GlobalStatus";
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
import Admintest from "./pages/admintest";
import UserDetails from "./pages/userDetails";

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
    path: "/guest",
    element: <GuestUserHome />,
  },
  {
    path: "*",
    element: <Notfound />,
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
        element: <UserDetails/>
      },
      {
        path: "/admintest",
        element: <Admintest />,
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
      <GlobalStatus />
      <RouterProvider router={router} />
    </>
  );
}
