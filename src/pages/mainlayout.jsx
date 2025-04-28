import React from "react";
import GuestUserHome from "./guestUserHome";
import { loadState } from "../store/localstorage";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import GlobalStatus from "../components/GlobalStatus";

const Mainlayout = () => {
  const id = loadState();
  return (
    <>
      <GlobalStatus />
      {id ? (
        <div>
          <Navbar />
          <Outlet />
        </div>
      ) : (
        <GuestUserHome />
      )}
    </>
  );
};

export default Mainlayout;
