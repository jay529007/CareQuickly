import React from "react";
import GuestUserHome from "./guestUserHome";
import { loadState } from "../store/localstorage";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import GlobalStatus from "../components/GlobalStatus";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Mainlayout = () => {
  const id = loadState();
  return (
    <>
      <GlobalStatus />
      {/* <ToastContainer /> */}
      {id ? (
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
