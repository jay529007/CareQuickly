import React, { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { clearState, loadState } from "../store/localstorage";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../functions/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const authdata = loadState();
  const type = authdata.type;

  const isUser = type === "user";
  const isAdmin = type === "admin";
  const isDoctor = type === "doctor";

  const Logout = () => {
    try {
      clearState();
      toast.success("Logged out successfully!");
      console.log("logout");
      // setTimeout(() => window.location.reload(), 1000);
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
      console.error("Logout error:", error);
    }
  };

  const Linkclass = ({ isActive }) =>
    isActive
      ? "hover:text-indigo-600 cursor-pointer text-indigo-600 transition-all duration-150 "
      : "hover:text-indigo-600 transition-all duration-150 ";

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700">DocBook</h1>
        <ul className="flex space-x-6 text-gray-700 font-medium">
          {!isAdmin ? (
            <div className="space-x-6">
              <NavLink to="/home" className={Linkclass}>
                Home
              </NavLink>
              <NavLink to="/appointment" className={Linkclass}>
                Appointment
              </NavLink>
              <NavLink to="/appointment/details" className={Linkclass}>
                Dashboard
              </NavLink>
              {/* <Link
                to="/contect"
                className="hover:text-indigo-600 cursor-pointer"
              >
                test
              </Link> */}
            </div>
          ) : (
            <div className="space-x-6">
              <NavLink to="/userdetails" className={Linkclass}>
                Appointments
              </NavLink>
              <NavLink to="/admin/dashboard" className={Linkclass}>
                Dashboard
              </NavLink>
              {/* <Link
                to="/admintest"
                className="hover:text-indigo-600 cursor-pointer"
              >
                test
              </Link> */}
            </div>
          )}
          <button
            onClick={Logout}
            className="hover:text-gray-600 cursor-pointer text-red-600 transition-all duration-150 "
          >
            Logout
          </button>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
