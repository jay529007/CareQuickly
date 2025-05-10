import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctor } from "../functions/doctorSlice";
import { useForm } from "react-hook-form";
import { updateDoctorSlot } from "../functions/doctorAPI";
import Input from "../components/re-usablecomponets/InputFeild";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const AdminHome = () => {
  const [selectedSpecialty, setselectedSpecialty] = useState("");
  const [selectedDocter, setselectedDocter] = useState(null);
  // const [isOpen, setIsOpen] = useState(false);
  // const [isSlotOpen, setIsSlotOpen] = useState(false);
  // const [selectedSlot, setselectedSlot] = useState(null);
  const [isAddNewSlotopen, setisAddNewSlotopen] = useState(false);

  // fetching docter data
  const dispatch = useDispatch();
  const doctors = useSelector((state) => state.doctors.doctors);

  useEffect(() => {
    dispatch(fetchDoctor());
  }, [dispatch]);

  const FilterdDoctersbySpecialty = doctors.filter(
    (doctor) => doctor.specialty === selectedSpecialty
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleDoctorChange = (e) => {
    const doctor = FilterdDoctersbySpecialty.find(
      (doctor) => doctor.name === e.target.value
    );
    setselectedDocter(doctor);
  };
  const todayFormatted = new Date().toISOString().split("T")[0];
  // deleting Slots
  const handleDelete = (slotToDelete) => {
    // Creating new array
    const updatedSlots = selectedDocter.availableslots.filter(
      (slot) => slot.date !== slotToDelete.date
    );

    const updatedDoctor = { ...selectedDocter, availableslots: updatedSlots };
    updateDoctorSlot(updatedDoctor.id, updatedDoctor);
    dispatch(fetchDoctor());
  };

  // console.log(selectedDocter);

  const onSubmit = async (formdata) => {
    try {
      const newSlot = {
        date: formdata.availableslots.date,
        start: formdata.availableslots.start,
        end: formdata.availableslots.end,
      };

      const updatedDoctor = { ...selectedDocter };
      const existingSlots = [...(updatedDoctor.availableslots || [])];
      // if slotalrady available it'l have -1 index
      const index = existingSlots.findIndex(
        (slot) => slot.date === newSlot.date
      );

      if (index !== -1) {
        existingSlots[index] = newSlot;
      } else {
        existingSlots.push(newSlot);
      }

      updatedDoctor.availableslots = existingSlots;

      await updateDoctorSlot(updatedDoctor.id, updatedDoctor);
      // setIsSlotOpen(false);
      setisAddNewSlotopen(false);
      toast.success("Slot updated successfully");
      reset();
      dispatch(fetchDoctor());
      // window.location.reload();
      // setTimeout(() => window.location.reload(), 100);
    } catch (error) {
      console.error("Slot update failed:", error);
      toast.error("Something went wrong while updating the slot.");
      reset();
    }
  };

  return (
    <div className="mx-[10%] py-10 flex flex-col justify-between">
      {/* add new appointment */}
      <div className="self-end">
        <button
          className="bg-green-500 mr-4 text-white px-5 py-2 rounded hover:bg-green-600"
          onClick={() => setisAddNewSlotopen(true)}
        >
          + Add New Slot
        </button>
        <Link to="/admin/doctors/new">
          <button className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600">
            + Add New Doctor
          </button>
        </Link>
      </div>

      {/* Docter Details */}
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Doctor Details
        </h2>

        <div className="overflow-x-auto  shadow rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-sky-200 text-gray-700">
              <tr>
                <th className="py-3 px-6 ">Name</th>
                <th className="py-3 px-6 ">Specialty</th>
                <th className="py-3 px-6 ">Experience</th>
                <th className="py-3 px-6 ">Status</th>
                <th className="py-3 px-6 ">Details</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-center">
              {doctors.map((slot) => (
                <tr key={slot.id} className="border-b">
                  <td className="py-3 px-6">{slot.name || "N/A"}</td>
                  <td className="py-3 px-6">{slot.specialty || "N/A"}</td>
                  <td className="py-3 px-6">{slot.experience || "N/A"}</td>
                  <td className="py-3 px-6">
                    {slot.unavailableslots?.some(
                      (s) => s.date === todayFormatted
                    ) ? (
                      <span className="text-red-500 font-semibold">
                        Unavailable
                      </span>
                    ) : (
                      <span className="text-green-500 font-semibold">
                        Available
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-6 flex justify-center space-x-2">
                    <Link
                      to={`/admin/doctors/${slot.id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      // onClick={() => {
                      //   setselectedDocter(slot);
                      //   setIsOpen(true);
                      // }}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Add New Slot */}
      {isAddNewSlotopen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Add New Appointment
              </h3>
              <button
                onClick={() => setisAddNewSlotopen(false)}
                className="text-gray-500 hover:text-red-500 transition"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="my-3 border border-gray-300 bg-white p-4 rounded shadow-sm"
            >
              {/*  filter */}
              <div className="flex gap-4">
                {/* Doctor Specialty filter */}
                <div className="flex-1">
                  <select
                    className="w-full my-4 py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e) => setselectedSpecialty(e.target.value)}
                  >
                    <option value="">All Specialist</option>
                    <option value="Dentist">Dentist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="General Physician">General Physician</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Surgeons">Surgeons</option>
                    <option value="Neurologists">Neurologists</option>
                  </select>
                </div>
                {/* Doctor filter */}
                <div className="flex-1">
                  <select
                    className="w-full my-4 py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 defocus:ring-blue-400"
                    disabled={!selectedSpecialty}
                    onChange={handleDoctorChange}
                  >
                    <option hidden value="">
                      All doctors
                    </option>

                    {FilterdDoctersbySpecialty.map((doctor) => (
                      <option key={doctor.id}>{doctor.name || "N/A"}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* date picker */}
              <div>
                <Input
                  className="w-full my-4 py-3 px-4 border border-gray-300 shadow-sm bg-white"
                  placeholder="Select a date"
                  disabled={!selectedDocter}
                  type="date"
                  {...register("availableslots.date", {
                    required: "Select the Date",
                  })}
                />
                {errors.availableslots?.date && (
                  <p className="text-red-500">
                    {errors.availableslots?.date.message}
                  </p>
                )}
              </div>
              {/* Time Selection */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Starting Time */}
                <div className="flex-1">
                  <label className="block text-md font-sm text-black ">
                    Select Starting Time
                  </label>
                  <select
                    disabled={!selectedDocter}
                    className="mt-2.5 block w-full bg-white p-2 border border-gray-300 rounded-md"
                    {...register("availableslots.start", {
                      required: "Select the Time",
                    })}
                  >
                    <option hidden value="">
                      Select Time
                    </option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 AM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                  </select>
                  {errors.availableslots?.start && (
                    <p className="text-red-500">
                      {errors.availableslots?.start.message}
                    </p>
                  )}
                </div>

                {/* Ending Time */}
                <div className="flex-1">
                  <label className="block text-md font-sm text-black">
                    Select Ending Time
                  </label>
                  <select
                    disabled={!selectedDocter}
                    className="mt-2.5 block w-full bg-white p-2 border border-gray-300 rounded-md"
                    {...register("availableslots.end", {
                      required: "Select the Time",
                    })}
                  >
                    <option hidden value="">
                      Select Time
                    </option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 AM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                    <option value="19:00">07:00 PM</option>
                  </select>
                  {errors.availableslots?.end && (
                    <p className="text-red-500">
                      {errors.availableslots?.end.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white px-3 py-1 rounded mt-4 sm:mt-6"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      )}

      {/* no more in use */}
      {/* Selected Doctor Details
      {isOpen && (
        <div className="  flex items-center justify-center  ">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-semibold text-gray-800">
                Doctor Details
              </h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setselectedDocter(null);
                }}
                className="text-gray-500 hover:text-red-500 transition"
              >
                ✕
              </button>
            </div>

            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedDocter.image}
                  alt={selectedDocter.name}
                  className="w-32 h-32 object-cover rounded-full shadow-lg"
                />
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {selectedDocter.name || "N/A"}
                  </h3>
                  <p className="text-md text-gray-500">
                    {selectedDocter.specialty || "N/A"}
                  </p>
                  <p className="text-md text-gray-600">
                    {selectedDocter.experience || "N/A"} years of experience
                  </p>
                </div>
              </div>
            </div>

           
            <div className="mt-6">
              <h4 className="text-xl font-medium text-gray-800 mb-4">
                Available Slots
              </h4>
              <table className="min-w-full bg-gray-50 border-collapse shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className=" bg-gray-200 text-gray-700">
                    <th className="px-6 py-3 text-sm font-semibold">Date</th>
                    <th className="px-6 py-3 text-sm font-semibold">Time</th>
                    <th className="px-6 py-3 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDocter.availableslots.map((slot, index) => (
                    <tr
                      key={index}
                      className="border-t text-center border-b text-sm text-gray-600"
                    >
                      <td className="px-6 py-4">{slot.date || "N/A"}</td>
                      <td className="px-6 py-4">
                        {slot.start || "N/A"} - {slot.end || "N/A"}
                      </td>
                      <td className="justify-center my-3 items-center flex gap-3">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                          onClick={() => {
                            setselectedSlot(slot);
                            setIsSlotOpen(true);
                          }}
                        >
                          Update
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition disabled:opacity-50"
                          disabled={slot.date === todayFormatted}
                          onClick={() => handleDelete(slot)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

           
            {isSlotOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[100]">
                <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
                
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Slot Details
                    </h3>
                    <button
                      onClick={() => setIsSlotOpen(false)}
                      className="text-gray-400 hover:text-red-500 transition text-2xl"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="overflow-x-auto mb-6">
                    <table className="min-w-full text-sm text-gray-700">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-xs leading-normal">
                          <th className="py-3 px-6 text-left">Date</th>
                          <th className="py-3 px-6 text-left">Time</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr className="border-b hover:bg-gray-50">
                          <td className="py-4 px-6">{selectedSlot.date}</td>
                          <td className="py-4 px-6">
                            {selectedSlot.start} - {selectedSlot.end}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mb-6">
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <div>
                        <input
                          type="hidden"
                          value={selectedSlot.date}
                          {...register("availableslots.date", {})}
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-gray-600 mb-1 text-sm">
                            Start Time
                          </label>
                          <select
                            className="w-full p-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            {...register("availableslots.start", {})}
                          >
                            <option hidden value={selectedSlot.start}>
                              {selectedSlot.start}
                            </option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="12:00">12:00 AM</option>
                            <option value="13:00">01:00 PM</option>
                            <option value="14:00">02:00 PM</option>
                            <option value="15:00">03:00 PM</option>
                            <option value="16:00">04:00 PM</option>
                            <option value="17:00">05:00 PM</option>
                            <option value="18:00">06:00 PM</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-gray-600 mb-1 text-sm">
                            End Time
                          </label>
                          <select
                            className="w-full p-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            {...register("availableslots.end", {})}
                          >
                            <option hidden value={selectedSlot.end}>
                              {selectedSlot.end}
                            </option>
                            <option value="11:00">11:00 AM</option>
                            <option value="12:00">12:00 AM</option>
                            <option value="13:00">01:00 PM</option>
                            <option value="14:00">02:00 PM</option>
                            <option value="15:00">03:00 PM</option>
                            <option value="16:00">04:00 PM</option>
                            <option value="17:00">05:00 PM</option>
                            <option value="18:00">06:00 PM</option>
                            <option value="19:00">07:00 PM</option>
                          </select>
                        </div>
                      </div>
                  
                      <div className="flex justify-end gap-4">
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => setIsSlotOpen(false)}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg shadow transition disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default AdminHome;
