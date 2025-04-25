import { useState } from "react";
import MyCalendar from "../components/calander";

const Appointment = () => {
  return (
    <>
      <h2 className="text-2xl py-3 font-semibold mb-4">My Appoinments</h2>
      <div style={{ height: "fit" }}>
        <MyCalendar />
      </div>
    </>
  );
};

export default Appointment;
