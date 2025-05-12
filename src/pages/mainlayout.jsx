import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import GlobalStatus from "../components/GlobalStatus";
const Mainlayout = () => {
  return (
    <>
      <GlobalStatus />
      <Navbar />
      <Outlet />
    </>
  );
};

export default Mainlayout;
