import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchDoctor } from "../functions/doctorSlice";
import { useDispatch, useSelector } from "react-redux";
import Nouserfound from "./error/no-userfound";
import { loadState } from "../store/localstorage";
import { toast } from "react-toastify";

const DoctorProfilePage = ({ isDoctor }) => {
  const dispatch = useDispatch();
  const doctors = useSelector((doctor) => doctor.doctors.doctors);
  useEffect(() => {
    dispatch(fetchDoctor());
  }, []);
  const navingate = useNavigate();
  //   console.log(doctors[id]);
  const { id } = useParams();
  const authdata = loadState();
  const isUser = authdata.type === "user";
  const isAdmin = authdata.type === "admin";
  const isdoctor = authdata.type === "doctor";
  const currentDoctor = doctors?.find((doctors) => doctors.id === id);

  return (
    <>
      {currentDoctor ? (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Back button */}
          {isAdmin ||
            (isUser && (
              <div className="mb-6">
                <Link
                  to={isAdmin ? "/admin/dashboard" : isUser && "/doctors"}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-0.5"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Back to Doctors
                </Link>
              </div>
            ))}
          {/* Main Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Doctor Image */}
              <div className="md:w-1/3 lg:w-1/4 bg-gray-100 flex items-center justify-center p-6">
                <img
                  src={currentDoctor?.image}
                  alt={currentDoctor?.name}
                  className="w-64 h-64 object-cover rounded-full border-4 border-white shadow-md"
                />
              </div>

              {/* CurrentDoctor Details */}
              <div className="md:w-2/3 lg:w-3/4 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {currentDoctor?.name}
                    </h1>
                    <p className="text-xl text-blue-600 font-medium">
                      {currentDoctor?.specialty}
                    </p>
                  </div>
                  {isdoctor && (
                    <div className="mt-4 md:mt-0 flex space-x-3">
                      <Link
                        to="/doctor/Profile/update/:id"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Update Profile
                      </Link>
                    </div>
                  )}
                  {isUser && (
                    <div className="mt-4 md:mt-0 flex space-x-3">
                      <Link
                        to={isUser && "/appointment/calendar"}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Book Appointmet
                      </Link>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {currentDoctor?.bio && (
                  <div className="mb-6">
                    <p className="text-gray-700 italic">{currentDoctor?.bio}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">
                        Professional Information
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex">
                          <span className="text-gray-600 font-medium w-32">
                            Experience:
                          </span>
                          <span>{currentDoctor?.experience} years</span>
                        </li>
                        <li className="flex">
                          <span className="text-gray-600 font-medium w-32">
                            Education:
                          </span>
                          <span>{currentDoctor?.education}</span>
                        </li>
                        <li className="flex">
                          <span className="text-gray-600 font-medium w-32">
                            Qualifications:
                          </span>
                          <div>
                            {currentDoctor?.qualifications.map((qual, i) => (
                              <div key={i} className="flex items-center">
                                <svg
                                  className="w-4 h-4 mr-2 text-blue-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {qual}
                              </div>
                            ))}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">
                        Personal Information
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex">
                          <span className="text-gray-600 font-medium w-32">
                            Gender:
                          </span>
                          <span>{currentDoctor?.gender}</span>
                        </li>
                        <li className="flex">
                          <span className="text-gray-600 font-medium w-32">
                            Date of Birth:
                          </span>
                          <span>{currentDoctor?.dateOfBirth}</span>
                        </li>
                        <li className="flex">
                          <span className="text-gray-600 font-medium w-32">
                            Languages:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {currentDoctor?.languages.map((lang, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                              >
                                {lang}
                              </span>
                            ))}
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">
                        Contact Information
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex">
                          <span className="text-gray-600 font-medium w-32">
                            Phone:
                          </span>
                          <span>{currentDoctor?.phone}</span>
                        </li>
                        <li className="flex">
                          <span className="text-gray-600 font-medium w-32">
                            Email:
                          </span>
                          <a
                            href={`mailto:${currentDoctor?.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {currentDoctor?.email}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                {currentDoctor?.about && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      About Dr. {currentDoctor?.name.split(" ")[1]}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {currentDoctor?.about}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Nouserfound />
      )}
    </>
  );
};

export default DoctorProfilePage;
