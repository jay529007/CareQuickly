import React from "react";
import { loadState } from "../store/localstorage";

const DocterCard = ({ doctor }) => {
  const id = loadState();

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
        <div className="h-40 bg-gray-200 overflow-clip ">
          <img className="" src={`https://doctor-apoinment-system.vercel.app/${doctor.image}`} alt={doctor.name} />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-1">{doctor.name}</h3>
          <p className="text-sm text-gray-500 mb-4">
            {doctor.specialty} · {doctor.experience} years experience
          </p>
          {/* <button
            disabled={!id}
            className={` w-full px-4 py-2  rounded-lg ${
              id
                ? "bg-blue-500 text-white cursor-pointer"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            } `}
          >
            {id ? "Book Now" : "Login to Book"}
          </button> */}
        </div>
      </div>
    </>
  );
};

export default DocterCard;
