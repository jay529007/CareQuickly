import React from "react";
import { GoAlertFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const Nouserfound = () => {
  const navigate = useNavigate();
  const gotoLoading = () => {
    navigate("/");
    window.location.reload();
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center  bg-gray-100">
      <div className=" w-fit">
        <GoAlertFill className="size-20 text-yellow-500" />
      </div>
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-gray-800">No Data Found</h2>
        <p className="text-gray-500 mt-2">Check Conection.</p>
      </div>
      <button
        className="m-4 text-white bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 "
        onClick={gotoLoading}
      >
        Refresh
      </button>
    </div>
  );
};

export default Nouserfound;
