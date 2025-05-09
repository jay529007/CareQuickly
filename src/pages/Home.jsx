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
  const id = loadState();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const doctors = useSelector((doctor) => doctor.doctors.doctors);
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchDoctor());
  }, []);

  const currntUser = users.find((user) => user.id === id);
  const isAdmin = currntUser?.role === "admin";
  const isDoctor = doctors.find((doc) => doc.id === id);
  return (
    <>
      <div className="min-h-screen bg-indigo-50">
        {isAdmin ? <AdminHome /> : isDoctor ? <DoctorHomePage /> : <UserHome />}
      </div>
    </>
  );
};

export default Home;
