import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { clearState, loadState } from "../store/localstorage";
import { toast } from "react-toastify";

const ProtectedRoutes = ({ allowedRoles }) => {
  const param = useParams();
  const authdata = loadState();
  const type = authdata?.type || null;
  const [redirectPath, setRedirectPath] = useState(null);

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
          setRedirectPath("/admin/dashboard");
          break;
        case "doctor":
          toast.error("No Access - Doctors cannot access this route.");
          
          setRedirectPath("/doctor/dashboard");
          break;
          case "user":
            toast.error("No Access - Users cannot access this route.");
            console.log("user");
          setRedirectPath("/home");
          break;
        default:
          clearState();
          setRedirectPath("/login");
      }
    }
  }, [param]);

  // Redirect based on the computed path
  if (redirectPath) return <Navigate to={redirectPath} />;

  return <Outlet />;
};

export default ProtectedRoutes;
