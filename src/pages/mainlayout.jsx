import React, { useEffect } from "react";
import GuestUserHome from "./guestUserHome";
import { loadState } from "../store/localstorage";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import GlobalStatus from "../components/GlobalStatus";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctor } from "../functions/doctorSlice";
import { fetchUsers } from "../functions/userSlice";


const Mainlayout = () => {
  const authdata = loadState();
  const type = authdata.type;

  const isUser = type === "user";
  const isAdmin = type === "admin";
  const isDoctor = type === "doctor";

  return (
    <>
      <GlobalStatus />
      {isUser || isAdmin || isDoctor ? (
        <div>
          <Navbar />
          <ToastContainer />
          <Outlet />
        </div>
      ) : (
        <GuestUserHome />
      )}
    </>
  );
};

export default Mainlayout;
