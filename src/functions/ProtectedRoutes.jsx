import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { clearState, loadState } from "../store/localstorage";
import { toast } from "react-toastify";
import { fetchDoctor } from "./doctorSlice";

const ProtectedRoutes = ({ allowedRoles }) => {
  const param = useParams();
  const authdata = loadState();
  const type = authdata?.type || null;
  const navigate = useNavigate();
  useEffect(() => {
    if (!type) {
      clearState();
      setRedirectPath("/login");
      return;
    }

    if (!allowedRoles.includes(type)) {
      // Handle unauthorized access based on role
      switch (type) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "doctor":
          toast.error("No Access - Doctors cannot access this route.");
          navigate("/doctor/dashboard");
          break;
        case "user":
          toast.error("No Access - Users cannot access this route.");
          navigate("/home");
          break;
        default:
          clearState();
          navigate("/login");
      }
    }
  }, [param, type, allowedRoles]);
  return <Outlet />;
};

export default ProtectedRoutes;
