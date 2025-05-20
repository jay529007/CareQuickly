import React from "react";
import { loadState } from "../store/localstorage";
import { Link, useNavigate } from "react-router-dom";

const DocterCard = ({ doctor }) => {
  const authdata = loadState();
  const id = authdata.id;
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
        <div className="h-40 bg-gray-200 overflow-clip ">
          <img className="" src={doctor.image} alt={doctor.name} />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-1">{doctor.name}</h3>
          <p className="text-sm text-gray-500 mb-4">
            {doctor.specialty} · {doctor.experience} years experience
          </p>
          <button
            className=" w-full  px-4 py-2  rounded-lg bg-blue-500 text-white cursor-pointer"
            onClick={() => navigate(`/doctor/Profile/${doctor.id}`)}
          >
            View More
          </button>
        </div>
      </div>
    </>
  );
};

export default DocterCard;
