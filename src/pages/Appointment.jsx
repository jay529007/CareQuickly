import { useState } from "react";
import MyCalendar from "../components/calander";

const Appointment = () => {
  return (
    <>
      <div>
         <h2 className="text-2xl py-3 font-semibold mb-4">My Appoinments</h2>
        <div style={{ height: "95vh" }}>
          <MyCalendar />
        </div>
      </div>
    </>
  );
};

export default Appointment;
