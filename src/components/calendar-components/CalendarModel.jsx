import React, { useEffect, useState } from "react";
import Input from "../re-usablecomponets/InputFeild";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctor } from "../../functions/doctorSlice";

const CalendarModel = ({
  setShowModal,
  currentUser,
  onSubmit,
  format,
  selectedDate,
  setselectedDoctor,
  handleDoctorChange,
  selectedDoctor,
  AvailableslotValue,
  Availableslot,
  selectedSpecialty,
  setselectedSpecialty,
  selectedAppointment,
  setSelectedAppointment,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const doctors = useSelector((state) => state.doctors.doctors);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDoctor());
  }, [dispatch]);

  const FilterdDoctersbySpecialty = doctors.filter(
    (doctor) => doctor.specialty === selectedSpecialty
  );
  useEffect(() => {
    if (!selectedAppointment) return;

    // First set the specialty
    setselectedSpecialty(selectedAppointment.service);

    // Then set the form values after a small delay to allow state updates
    const timer = setTimeout(() => {
      setValue("appointments.service", selectedAppointment.service);
      setValue("appointments.doctor", selectedAppointment.doctor);
      setValue("appointments.notes", selectedAppointment.notes);
      setValue("appointments.slot.start", selectedAppointment.slot.start);
      setValue("appointments.slot.end", selectedAppointment.slot.end);

      // Also set the selected doctor in state
      //   const doctor = doctors.find((d) => d.name === selectedAppointment.doctor);
      //   if (doctor) setselectedDoctor(doctor);
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedAppointment, setValue, doctors]);

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-4 rounded-xl shadow w-[50%]">
          <h3 className="text-xl font-bold mb-2">
            {selectedAppointment ? "Updated Appointment" : "New Appointment"}
          </h3>
          <p className="text-sm mb-1">
            Date:{" "}
            {selectedAppointment
              ? format(new Date(selectedAppointment.slot.date), "PPP")
              : format(selectedDate, "PPP")}
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* name */}
            <div>
              <Input
                label="Name: "
                type="text"
                value={currentUser?.name}
                disabled
                className="border w-full p-1 mb-2"
                placeholder="User"
              />
            </div>
            {/* email */}
            <div>
              <Input
                label="Email: "
                type="text"
                disabled
                value={currentUser?.email}
                className="border w-full p-1 mb-2"
                placeholder="Useremail"
              />
            </div>

            {/* filter */}
            <div className="flex gap-4">
              {/* Doctor Specialty filter */}
              <div className="flex-1">
                <select
                  className="w-full my-3 py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={selectedAppointment}
                  {...register("appointments.service", {
                    required: "Select the Service",
                    onChange: (e) => {
                      setselectedSpecialty(e.target.value),
                        setselectedDoctor("");
                    },
                  })}
                >
                  <option hidden value="">
                    Select Specialist
                  </option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Dentist">Dentist</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Neurologists">Neurologists</option>
                  <option value="Surgeons">Surgeons</option>
                </select>
                {errors.appointments?.service && (
                  <p className={errorClass}>
                    {errors.appointments?.service.message}
                  </p>
                )}
              </div>
              {/* Doctors Filter */}
              <div className="flex-1">
                <select
                  className="w-full my-3 py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={selectedAppointment || !selectedSpecialty}
                  // onChange={handleDoctorChange}
                  {...register("appointments.doctor", {
                    required: "Select the Doctor",
                    onChange: handleDoctorChange,
                  })}
                >
                  <option hidden value="">
                    All doctors
                  </option>
                  {FilterdDoctersbySpecialty.map((doctor, index) => (
                    <option key={index} value={doctor.name}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
                {errors.appointments?.doctor && (
                  <p className={errorClass}>
                    {errors.appointments?.doctor.message}
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="inline-block mb-1 text-black pl-1">
                Notes:
              </label>
              <textarea
                placeholder="Notes"
                rows="2"
                className="w-full bg-slate-50 px-4 py-2 mt-1 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("appointments.notes", {})}
              />
            </div>
            {/* time */}
            <div className="flex gap-3">
              {/* Stating Time */}
              <div className="flex-1">
                <label className="block text-md font-sm text-black">
                  Select Stating Time
                </label>
                <select
                  disabled={!selectedAppointment && !selectedDoctor}
                  className="mt-2.5 block  bg-white w-full p-2  border rounded-md"
                  {...register("appointments.slot.start", {
                    required: "Select the Time",
                  })}
                >
                  <option hidden value="">
                    Select Time
                  </option>
                  {AvailableslotValue.map((value, i) => {
                    // i is the index into both arrays
                    const display = Availableslot[i];
                    return (
                      <option key={value} value={value}>
                        {display}
                      </option>
                    );
                  })}
                </select>
                {errors.appointments?.slot.start && (
                  <p className={errorClass}>
                    {errors.appointments?.slot.start.message}
                  </p>
                )}
              </div>
              {/* Ending Time */}
              <div className="flex-1">
                <label className="block text-md font-sm text-black">
                  Select Ending Time
                </label>
                <select
                  disabled={!selectedAppointment && !selectedDoctor}
                  className="mt-2.5 block  bg-white w-full p-2  border rounded-md"
                  {...register("appointments.slot.end", {
                    required: "Select the time",
                  })}
                >
                  <option hidden value="">
                    Select Time
                  </option>
                  {AvailableslotValue.map((value, i) => {
                    // i is the index into both arrays
                    const display = Availableslot[i];
                    return (
                      <option key={value} value={value}>
                        {display}
                      </option>
                    );
                  })}
                
                </select>
                {errors.appointments?.slot.end && (
                  <p className={errorClass}>
                    {errors.appointments?.slot.end.message}
                  </p>
                )}
              </div>
            </div>
            <br />
            {/* buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setselectedDoctor("");
                  setselectedSpecialty("");
                  setSelectedAppointment("");
                  reset();
                  setShowModal(false);
                }}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                {selectedAppointment ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CalendarModel;
