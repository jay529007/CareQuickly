import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearState, loadState } from "../store/localstorage";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../functions/userSlice";
import { fetchDoctor } from "../functions/doctorSlice";
import { toast } from "react-toastify";
import Slidbar from "./slidbar";
// import Slidbar from "./slidbar";

const Navbar = () => {
  const [SlidebarOpen, setSlidebarOpen] = useState(false);
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
      ? "hover:bg-blue-600 cursor-pointer py-2.5 px-3.5 rounded-2xl bg-blue-500 text-white transition-all duration-150 "
      : "hover:bg-gray-200 bg-gray-100 text-gray-700 py-2.5 px-3 rounded-2xl transition-all duration-150 ";

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              C
            </div>
            <h1 className="text-2xl font-bold text-blue-800">CareQuickly</h1>
          </div>

          <nav className="hidden lg:flex space-x-8">
            {!isDoctor && !isAdmin ? (
              <>
                <Link
                  to="/"
                  className="text-blue-800 font-medium hover:text-blue-600 transition relative group"
                >
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  to="/testservices"
                  className="text-gray-600 font-medium hover:text-blue-600 transition relative group"
                >
                  Services
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  to="/testdoctor"
                  className="text-gray-600 font-medium hover:text-blue-600 transition relative group"
                >
                  Doctors
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                {isUser && (
                  <Link
                    to="/appointment/details"
                    className="text-gray-600 font-medium hover:text-blue-600 transition relative group"
                  >
                    Appointment Details
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
                <Link
                  to="/"
                  className="text-gray-600 font-medium hover:text-blue-600 transition relative group"
                >
                  Contact
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            ) : isAdmin ? (
              <>
                <Link
                  to="/patient/details"
                  className="text-gray-600 font-medium hover:text-blue-600 transition relative group"
                >
                  Patient Details
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  to="/admin/Dashboard"
                  className="text-gray-600 font-medium hover:text-blue-600 transition relative group"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            ) : (
              isDoctor && (
                <>
                  <Link
                    to="/doctor/dashboard"
                    className="text-gray-600 font-medium hover:text-blue-600 transition relative group"
                  >
                    Home
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link
                    to="/doctor/appointments"
                    className="text-gray-600 font-medium hover:text-blue-600 transition relative group"
                  >
                    Appointments
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link
                    to={`/doctor/profile/${id}`}
                    className="text-gray-600 font-medium hover:text-blue-600 transition relative group"
                  >
                    profile
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </>
              )
            )}
          </nav>
          {/* image */}
          {id && type && (
            <div
              className="flex items-center justify-center border-4 border-white rounded-full overflow-hidden shadow-lg w-12 h-12 md:w-14 md:h-14 bg-blue-100 text-blue-600 font-bold text-xl"
              onClick={() => setSlidebarOpen(true)}
            >
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
                  {currentUser?.name?.charAt(0) || "u"}
                </span>
              )}
            </div>
          )}
          {!id && !type && (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:text-blue-800 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2 rounded-full font-medium hover:shadow-lg transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>
      {SlidebarOpen && <Slidbar setSlidebarOpen={setSlidebarOpen} />}
    </>
  );
};

export default Navbar;
