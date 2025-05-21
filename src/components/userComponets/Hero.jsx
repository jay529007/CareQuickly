import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const Hero = () => {
  return (
    <>
      <section className="relative">
        <div className="absolute inset-0 bg-blue-900 opacity-30"></div>
        <img
          src="https://doctor-apoinment-system.vercel.app/heroDoctor.jpg"
          alt="Doctor with patient"
          className="w-full h-[600px] object-cover"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6 z-10">
            <div className="max-w-2xl bg-white bg-opacity-90 p-8 rounded-xl shadow-xl">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Healthcare <span className="text-blue-600">Made Simple</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Book appointments with top specialists in minutes, not days.
                Your health is our priority.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/doctors"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center transition"
                >
                  Find Link Doctor <FaArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/services"
                  className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center transition"
                >
                  Our Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
