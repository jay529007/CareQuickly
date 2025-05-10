import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { clearState, loadState } from "../../store/localstorage";
import { useNavigate } from "react-router-dom";
export const Notfound = () => {
  const navigate = useNavigate();
  const authdata = loadState();
  const type = authdata.type;
  const navigateRouterHandler = () => {
    if (type === "admin") {
      navigate("/admin/dashboard");
    } else if (type === "doctor") {
      navigate("/doctor/dashboard");
    } else if (type === "user") {
      navigate("/home");
    } else {
      navigate("/");
      clearState();
    }
  };
  return (
    <>
      <section className="text-center flex flex-col justify-center items-center h-96">
        <FaExclamationTriangle className="text-yellow-400 text-6xl mb-4" />
        {/* <i className="fas fa-exclamation-triangle text-yellow-400 fa-4x mb-4"></i> */}
        <h1 className="text-6xl font-bold mb-4">404 Not Found</h1>
        <p className="text-xl mb-5">This page does not exist</p>
        <button
          onClick={navigateRouterHandler}
          className="text-white bg-indigo-700 hover:bg-indigo-900 rounded-md px-3 py-2 mt-4"
        >
          Go Back
        </button>
      </section>
    </>
  );
};
