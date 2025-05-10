import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { clearState, loadState } from "../store/localstorage";
import Mainlayout from "../pages/mainlayout";

const ProtectedRoutes = ({ allowedRoles }) => {
  const authdata = loadState();
  const type = authdata.type;
  return allowedRoles.includes(type) ? (
    <Outlet />
  ) : type === "admin" ? (
    <Navigate to="/admin/dashboard" />
  ) : type === "doctor" ? (
    <Navigate to="/doctor/dashboard" />
  ) : type === "user" ? (
    <Navigate to="/home" />
  ) : (
    ((<Navigate to="/" />), clearState())
  );
};

export default ProtectedRoutes;
