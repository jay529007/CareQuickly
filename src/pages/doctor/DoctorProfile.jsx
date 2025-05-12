import React from "react";
import DoctorProfilePage from "../DoctorProfilePage";

const DoctorProfile = () => {
  let isDoctor = 1;
  return (
    <div>
      <DoctorProfilePage isDoctor={isDoctor} />
    </div>
  );
};

export default DoctorProfile;
