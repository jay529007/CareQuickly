import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadState } from "../store/localstorage";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctor } from "../functions/doctorSlice";

const DoctorHomePage = () => {
  const doctorId = loadState();
  const dispatch = useDispatch();
  const doctors = useSelector((doctor) => doctor.doctors.doctors);
  useEffect(() => {
    dispatch(fetchDoctor());
  }, []);
  const currentDoctor = doctors?.find((doctors) => doctors.id === doctorId);
  return (
    <>
      <div className="">
        {currentDoctor ? (
          <div className="max-w-6xl mx-auto p-4 sm:p-6">
            {/* Doctor Profile Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Doctor Image */}
                <div className="md:w-1/3 flex justify-center p-6 bg-gray-50">
                  <img
                    src={
                      currentDoctor?.image || "https://via.placeholder.com/300"
                    }
                    alt={currentDoctor?.name}
                    className="w-64 h-64 object-cover rounded-full border-4 border-white shadow-lg"
                  />
                </div>

                {/* Doctor Details */}
                <div className="md:w-2/3 p-6 md:p-8">
                  {/* Header with Name and Specialty */}
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                      Dr. {currentDoctor?.name}
                    </h1>
                    <p className="text-xl text-blue-600 font-medium mt-1">
                      {currentDoctor?.specialty}
                    </p>
                  </div>

                  {/* Key Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 font-medium">
                        Experience
                      </p>
                      <p className="text-2xl font-bold text-blue-700">
                        {currentDoctor?.experience}+ years
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 font-medium">
                        Education
                      </p>
                      <p className="text-lg font-semibold text-blue-700">
                        {currentDoctor?.education}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 mt-8">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                      Book Appointment
                    </button>
                    <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      View Full Profile
                    </button>
                    <button className="px-6 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                      </svg>
                      View Availability
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Sections (example) */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Patient Reviews</h3>
                {/* Review content would go here */}
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Services Offered</h3>
                {/* Services content would go here */}
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                {/* Links content would go here */}
              </div>
            </div>
          </div>
        ) : (
          <p>Loading doctor details...</p>
        )}
      </div>
    </>
  );
};

export default DoctorHomePage;
