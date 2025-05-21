import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchDoctor } from "../functions/doctorSlice";
import DocterCard from "../components/docterCard";
import { FiFilter, FiStar, FiArrowRight } from "react-icons/fi";

const AllDoctorDisplaypage = () => {
  const dispatch = useDispatch();
  const doctors = useSelector((state) => state.doctors?.doctors);

  useEffect(() => {
    dispatch(fetchDoctor());
  }, []);

  const [selectedSpecialty, setSpecialists] = useState("");
  const Specialty = [...new Set(doctors?.map((doctor) => doctor.specialty))];

  const visibleDoctors = selectedSpecialty
    ? doctors?.filter((doctor) => doctor.specialty === selectedSpecialty)
    : doctors;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center mb-6">
            <div className="w-12 h-1 bg-blue-600 rounded-full mr-4"></div>
            <h2 className="text-xl font-semibold text-blue-600">
              Meet Our Specialists
            </h2>
            <div className="w-12 h-1 bg-blue-600 rounded-full ml-4"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Expert Medical Professionals
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with highly qualified doctors specializing in various
            medical fields
          </p>
        </div>

        {/* Specialty Filter */}
        <div className="mb-16 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setSpecialists("")}
            className={`px-5 py-2.5 rounded-full flex items-center transition-all ${
              !selectedSpecialty
                ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <FiFilter className="mr-2" />
            All Specialties
          </button>

          {Specialty?.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSpecialists(specialty)}
              className={`px-5 py-2.5 rounded-full transition-all ${
                selectedSpecialty === specialty
                  ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleDoctors.map((doctor) => (
            <DocterCard
              key={doctor.id}
              doctor={doctor}
              className="transform hover:-translate-y-2 transition-all duration-300"
            />
          ))}
        </div>

        {/* View More (Optional) */}
        {visibleDoctors.length > 6 && (
          <div className="mt-12 text-center">
            <button className="inline-flex items-center text-blue-600 hover:text-indigo-700 font-semibold">
              View More Doctors
              <FiArrowRight className="ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDoctorDisplaypage;
