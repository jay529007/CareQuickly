import React, { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { clearState, loadState } from "../store/localstorage";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../functions/userSlice";

const Navbar = () => {
  const id = loadState();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);
  const currntUser = users.find((user) => user.id === id);
  const isAdmin = currntUser?.role === "admin";
  const Logout = () => {
    clearState();
    console.log("logout");
    window.location.reload();
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
              <NavLink to="/" className={Linkclass}>
                Home
              </NavLink>
              <NavLink to="/appointment" className={Linkclass}>
                Appointment
              </NavLink>
              <NavLink to="/dashboard" className={Linkclass}>
                Dashboard
              </NavLink>
              <Link
                to="/contect"
                className="hover:text-indigo-600 cursor-pointer"
              >
                test
              </Link>
            </div>
          ) : (
            <div className="space-x-6">
              <NavLink to="/admindashboard" className={Linkclass}>
                Dashboard
              </NavLink>
              <Link
                to="/admintest"
                className="hover:text-indigo-600 cursor-pointer"
              >
                test
              </Link>
            </div>
          )}
          <button
            onClick={Logout}
            className="hover:text-gray-50 bg-blue-500 px-2 py-2 rounded-2xl text-white cursor-pointer"
          >
            Logout
          </button>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
