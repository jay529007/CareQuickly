import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { loadState } from "../store/localstorage";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../functions/userSlice";
import { fetchDoctor } from "../functions/doctorSlice";
import Slidbar from "./slidbar";

const Navbar = () => {
  const [SlidebarOpen, setSlidebarOpen] = useState(false);
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

  const Linkclass = ({ isActive }) =>
    isActive
      ? "text-blue-800 font-medium hover:text-blue-600 transition relative group"
      : "text-gray-600 font-medium hover:text-blue-600 transition relative group";
  const animatenavbar =
    "absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300";
  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to={
              isAdmin
                ? "/admin/Dashboard"
                : isDoctor
                ? "/doctor/dashboard"
                : "/"
            }
            className="flex items-center space-x-2"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl">
              <img
                src="https://doctor-apoinment-system.vercel.app/CareQuickly-Logo.png"
                alt="CareQuickly Logo"
                className="object-cover w-full h-full"
              />
            </div>
            <h1 className="text-2xl font-bold text-[#083b66]">CareQuickly</h1>
          </Link>

          <nav className="hidden lg:flex space-x-8">
            {!isDoctor && !isAdmin ? (
              <>
                <NavLink to="/" className={Linkclass}>
                  Home
                  <span className={animatenavbar} />
                </NavLink>
                <NavLink to="/services" className={Linkclass}>
                  Services
                  <span className={animatenavbar} />
                </NavLink>
                <NavLink to="/doctors" className={Linkclass}>
                  Doctors
                  <span className={animatenavbar} />
                </NavLink>
                {isUser && (
                  <NavLink to="/appointment/details" className={Linkclass}>
                    Appointment Details
                    <span className={animatenavbar} />
                  </NavLink>
                )}
                <NavLink to="/" className={Linkclass}>
                  Contact
                  <span className={animatenavbar} />
                </NavLink>
              </>
            ) : isAdmin ? (
              <>
                <NavLink to="/patient/details" className={Linkclass}>
                  Patient Details
                  <span className={animatenavbar} />
                </NavLink>
                <NavLink to="/admin/Dashboard" className={Linkclass}>
                  Dashboard
                  <span className={animatenavbar} />
                </NavLink>
              </>
            ) : (
              isDoctor && (
                <>
                  <NavLink to="/doctor/dashboard" className={Linkclass}>
                    Home
                    <span className={animatenavbar} />
                  </NavLink>
                  <NavLink to="/doctor/appointments" className={Linkclass}>
                    Appointments
                    <span className={animatenavbar} />
                  </NavLink>
                  <NavLink to={`/doctor/profile/${id}`} className={Linkclass}>
                    profile
                    <span className={animatenavbar} />
                  </NavLink>
                  {/* <NavLink to={`/doctor/leave/${id}`} className={Linkclass}>
                    Leave
                    <span className={animatenavbar} />
                  </NavLink> */}
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
      {SlidebarOpen && (
        <Slidbar type={type} id={id} setSlidebarOpen={setSlidebarOpen} />
      )}
    </>
  );
};

export default Navbar;
