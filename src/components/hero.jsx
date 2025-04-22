import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <>
      <header className="bg-white shadow py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Book Appointments with Trusted Doctors
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6">
          Quick. Easy. Reliable. Find the right doctor and book instantly.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl text-lg hover:bg-blue-50 transition"
          >
            Register
          </Link>
        </div>
      </header>
    </>
  );
};

export default Hero;
