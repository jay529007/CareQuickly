import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { clearState, loadState } from "../store/localstorage";
import Mainlayout from "../pages/mainlayout";

const ProtectedRoutes = ({ allowedRoles }) => {
  const authdata = loadState();
  const type = authdata.type || null;
  if (!type) {
    clearState();
    return <Navigate to="/login" />;
  }


  if (!allowedRoles.includes(type)) {
    // Redirect based on role
    switch (type) {
      case "admin":
        return <Navigate to="/admin/dashboard" />;
      case "doctor":
        return <Navigate to="/doctor/dashboard" />;
      case "user":
        return <Navigate to="/user/dashboard" />;
      default:
        clearState();
        return <Navigate to="/login" />;
    }
  }

  // Role is allowed — show route
  return <Outlet />;
};

export default ProtectedRoutes;
