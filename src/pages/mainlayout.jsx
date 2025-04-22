import React from "react";
import GuestUserHome from "./guestUserHome";
import { loadState } from "../store/localstorage";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
Outlet;

const Mainlayout = () => {
  const id = loadState();
  return (
    <>
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
