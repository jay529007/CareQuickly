import { useState } from "react";
import MyCalendar from "../components/calander";

const Appointment = () => {
  return (
    <>
      <div className="p-4 bg-gray-50">
        {/* <h2 className="text-2xl py-3 font-semibold mb-4">Appoinment Calendar</h2> */}
        <div className=" border border-gray-50 shadow-lg rounded-xl" style={{ height: "fit" }}>
          <MyCalendar />
        </div>
      </div>
    </>
  );
};

export default Appointment;
