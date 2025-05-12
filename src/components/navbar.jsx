import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearState, loadState } from "../store/localstorage";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../functions/userSlice";
import { fetchDoctor } from "../functions/doctorSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const authdata = loadState();
  const type = authdata?.type || null;
  const id = authdata?.id || null;

  const isUser = type === "user";
  const isAdmin = type === "admin";
  const isDoctor = type === "doctor";

  // fetching appointment
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users?.users);
  const doctors = useSelector((state) => state.doctors?.doctors);
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchDoctor());
  }, [dispatch]);
  let currentUser = null;
  if (isUser || isAdmin) {
    currentUser = users.find((user) => user.id === id);
  }
  let currentDoctor = null;
  if (isDoctor && doctors && id) {
    currentDoctor = doctors.find((doctor) => doctor.id === id);
  }

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
      ? "hover:bg-blue-600 cursor-pointer py-2.5 px-2.5 rounded-2xl bg-blue-500 text-white transition-all duration-150 "
      : "hover:bg-gray-200 bg-gray-100 text-gray-700 py-2.5 px-2.5 rounded-2xl transition-all duration-150 ";

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">DocBook</h1>
        </div>
        <ul className="flex items-center rounded-2xl space-x-6 text-gray-700 font-medium">
          {isUser ? (
            <div className="space-x-6">
              <NavLink to="/home" className={Linkclass}>
                Home
              </NavLink>
              <NavLink to="/appointment/calendar" className={Linkclass}>
                Appointment
              </NavLink>
              <NavLink to="/appointment/details" className={Linkclass}>
                Dashboard
              </NavLink>
            </div>
          ) : isAdmin ? (
            <div className="space-x-6">
              <NavLink to="/patient/details" className={Linkclass}>
                Patient Details
              </NavLink>
              <NavLink to="/admin/dashboard" className={Linkclass}>
                Dashboard
              </NavLink>
            </div>
          ) : (
            isDoctor && (
              <div className="space-x-6">
                <NavLink to="/doctor/dashboard" className={Linkclass}>
                  Dashboard
                </NavLink>
                <NavLink to="/doctor/appointments" className={Linkclass}>
                  Appointments
                </NavLink>
              </div>
            )
          )}
          <button
            onClick={Logout}
            className="hover:bg-red-600 rounded-2xl py-2 px-3.5 hover:text-white cursor-pointer text-red-600 transition-all duration-150d "
          >
            Logout
          </button>
        </ul>
        {/* image */}
        <div className="flex items-center justify-center border-4 border-white rounded-full overflow-hidden shadow-lg w-12 h-12 md:w-14 md:h-14 bg-blue-100 text-blue-600 font-bold text-xl">
          {isDoctor && currentDoctor?.image ? (
            <img
              src={currentDoctor.image}
              alt={`Dr. ${currentDoctor.name}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "";
                e.target.className = "hidden"; // Hide broken image
              }}
            />
          ) : (
            <span className="flex items-center justify-center w-full h-full">
              {isDoctor
                ? currentDoctor?.name?.charAt(0) || "D"
                : currentUser?.name?.charAt(0) || "U"}
            </span>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
