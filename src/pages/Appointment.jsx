import { useState } from "react";
import MyCalendar from "../components/calander";

const Appointment = () => {
  return (
    <>
      <div style={{ height: "95vh" }}>
        <MyCalendar />
      </div>
    </>
  );
};

export default Appointment;
