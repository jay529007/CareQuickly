import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchDoctor } from "../../functions/doctorSlice";

export default function TestDoctorpage() {
  const dispatch = useDispatch();
  const doctors = useSelector((state) => state.doctors?.doctors);
  useEffect(() => {
    dispatch(fetchDoctor());
  }, []);
  const [selectedSpecialty, setSpecialists] = useState("");
  const Specialty = [...new Set(doctors?.map((doctor) => doctor.specialty))];
  const visibleDoctors = selectedSpecialty
    ? doctors?.filter(
        (filterddoctor) => filterddoctor.specialty === selectedSpecialty
      )
    : doctors;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Our Medical Experts
        </h1>

        {/* Specialty Filter */}
        <div className="mb-12 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setSpecialists("")}
            className="px-6 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
          >
            All
          </button>
          {Specialty?.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSpecialists(specialty)}
              className="px-6 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
            >
              {specialty}
            </button>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{doctor.name}</h3>
                <p className="text-blue-600 font-medium mb-2">
                  {doctor.specialty}
                </p>
                <div className="flex items-center text-gray-600 mb-4">
                  <span className="mr-2">
                    ⭐ {doctor.experience}+ Years Experience
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {doctor.qualifications.map((q, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {q}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/doctor/Profile/${doctor.id}`}
                  className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
