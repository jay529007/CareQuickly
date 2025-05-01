import React, { useEffect } from "react";
import { fetchDoctor } from "../functions/doctorSlice";
import { useDispatch, useSelector } from "react-redux";
import DocterCard from "../components/docterCard";
import Hero from "../components/hero";
import Flow from "../components/flow";
import { useNavigate } from "react-router-dom";

const GuestUserHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const doctors = useSelector((state) => state.doctors.doctors);
  useEffect(() => {
    dispatch(fetchDoctor());
    navigate("/");
    // window.location.reload();
  }, []);
  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        {/* Hero Section */}
        <Hero />
        {/* Doctor Card Section */}
        <section className="max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <DocterCard key={doctor.id} doctor={doctor} />
          ))}
        </section>
        {/* How It Works Section */}
        <Flow />
      </div>
    </>
  );
};

export default GuestUserHome;
