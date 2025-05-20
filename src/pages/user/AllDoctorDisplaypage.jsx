import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchDoctor } from "../../functions/doctorSlice";
import DocterCard from "../../components/docterCard";

const AllDoctorDisplaypage = () => {
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
            onClick={() => setSpecialists()}
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
            <DocterCard doctor={doctor} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllDoctorDisplaypage;
