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
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const doctors = useSelector((state) => state.doctors.doctors);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchDoctor());
  }, [dispatch]);

  const id = loadState();

  const currentUser = users.find((user) => user.id === id);
  const currentDoctor = doctors.find((doc) => doc.id === id);

  const isUserorAdmin = Boolean(currentUser);
  const isDoctor = Boolean(currentDoctor);

  return (
    <>
      <GlobalStatus />
      {isUserorAdmin || isDoctor ? (
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
