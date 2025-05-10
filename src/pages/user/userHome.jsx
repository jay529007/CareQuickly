import React, { useEffect } from "react";
import DocterCard from "../../components/docterCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctor } from "../../functions/doctorSlice";

const UserHome = () => {
  const dispatch = useDispatch();
  const doctors = useSelector((state) => state.doctors.doctors);
  useEffect(() => {
    dispatch(fetchDoctor());
  }, []);
  return (
    <>
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h2 className="text-4xl font-extrabold text-indigo-800 mb-4">
          Book Doctor Appointments Online
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-6">
          Quick and easy doctor bookings. Find specialists, check availability,
          and schedule visits anytime, anywhere.
        </p>

        {/* Doctor Card Section */}
        <section className="max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <DocterCard key={doctor.id} doctor={doctor} />
          ))}
        </section>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 mt-10 py-4">
        &copy; {new Date().getFullYear()} DocBook. All rights reserved.
      </footer>
    </>
  );
};

export default UserHome;
