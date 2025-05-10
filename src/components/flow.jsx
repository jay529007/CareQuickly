import React from "react";

const Flow = () => {
  return (
    <>
      <section className="bg-white py-20 border-t">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              "Create Account",
              "Choose a Doctor",
              "Select Time Slot",
              "Confirm Appointment",
            ].map((step, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-md transition"
              >
                <div className="text-blue-600 text-3xl font-bold mb-2">
                  {index + 1}
                </div>
                <p className="text-lg text-nowrap  font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Flow;
