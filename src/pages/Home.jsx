import React, { useEffect } from "react";
import Navbar from "../components/navbar";
import UserHome from "./userHome";
import { loadState } from "../store/localstorage";
import { fetchUsers } from "../functions/userSlice";
import { useDispatch, useSelector } from "react-redux";
import AdminHome from "./adminHome";
import { fetchDoctor } from "../functions/doctorSlice";
import DoctorHomePage from "./DoctorHome";

const Home = () => {
  const authdata = loadState();
  const type = authdata.type;

  const isUser = type === "user";
  const isAdmin = type === "admin";
  const isDoctor = type === "doctor";

  return (
    <>
      <div className="">
        {isAdmin ? <AdminHome /> : isDoctor ? <DoctorHomePage /> : <UserHome />}
      </div>
    </>
  );
};

export default Home;
