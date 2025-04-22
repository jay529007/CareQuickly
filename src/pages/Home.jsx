import React, { useEffect } from "react";
import Navbar from "../components/navbar";
import UserHome from "./userHome";
import { loadState } from "../store/localstorage";
import { fetchUsers } from "../functions/userSlice";
import { useDispatch, useSelector } from "react-redux";
import AdminHome from "./adminHome";

const Home = () => {
  const id = loadState();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const currntUser = users.find((user) => user.id === id);
  const isAdmin = currntUser?.role === "admin";

  return (
    <>
      <div className="min-h-screen bg-indigo-50">
       
        {isAdmin ? <AdminHome /> : <UserHome />}
      </div>
    </>
  );
};

export default Home;
