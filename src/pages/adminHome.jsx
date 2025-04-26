import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctor } from "../functions/doctorSlice";
import { useForm } from "react-hook-form";
import DocterCard from "../components/docterCard";
import { updateDoctorSlot } from "../functions/doctorAPI";
import Input from "../components/re-usablecomponets/InputFeild";

const AdminHome = () => {
  const [selectedSpecialty, setselectedSpecialty] = useState("");
  const [selectedDocter, setselectedDocter] = useState(null);

  // fetching docter data
  const dispatch = useDispatch();
  const doctors = useSelector((state) => state.doctors.doctors);

  useEffect(() => {
    dispatch(fetchDoctor());
  }, [dispatch]);

  const FilterdDoctersbySpecialty = doctors.filter(
    (doctor) => doctor.specialty === selectedSpecialty
  );

  // today date

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [blockedSlots, setBlockedSlots] = useState(["10:00", "15:30"]);
  const [slots, setSlots] = useState([
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "15:00",
    "17:00",
  ]);

  const toggleBlockSlot = (time) => {
    setBlockedSlots((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleDoctorChange = (e) => {
    const doctor = FilterdDoctersbySpecialty.find(
      (doctor) => doctor.name === e.target.value
    );
    setselectedDocter(doctor);
  };

  const onSubmit = async (formdata) => {
    const newSlot = {
      date: formdata.availableslots.date,
      start: formdata.availableslots.start,
      end: formdata.availableslots.end,
    };

    const updatedDoctor = { ...selectedDocter };
    const existingSlots = [...(updatedDoctor.availableslots || [])];
    // if slotalrady available it'l have -1 index
    const index = existingSlots.findIndex((slot) => slot.date === newSlot.date);

    if (index !== -1) {
      existingSlots[index] = newSlot;
    } else {
      existingSlots.push(newSlot);
    }

    updatedDoctor.availableslots = existingSlots;

    console.log("Updated doctor:", updatedDoctor);

    await updateDoctorSlot(updatedDoctor.id, updatedDoctor);

    // Optional: Show toast/success
    alert("Slot updated successfully!");
  };


  return (
    <div className="px-4 py-10 flex flex-col justify-between">
      <div>
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
                <option value="">All Services</option>
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
                className="w-full my-4 py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={!selectedSpecialty}
                onChange={handleDoctorChange}
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

      {/* Slot Management */}
      <div className="bg-white p-4 border border-gray-300 rounded shadow-sm mt-6">
        <h2 className="text-xl font-semibold mb-4">Manage Time Slots</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {slots.map((slot) => (
            <button
              key={slot}
              onClick={() => toggleBlockSlot(slot)}
              className={`p-2 rounded text-sm font-medium border ${
                blockedSlots.includes(slot)
                  ? "bg-red-100 text-red-600 border-red-400"
                  : "bg-green-100 text-green-600 border-green-400"
              }`}
            >
              {slot} -{" "}
              {blockedSlots.includes(slot) ? "Unavailable" : "Available"}
            </button>
          ))}
        </div>
      </div>

      {Array.isArray(FilterdDoctersbySpecialty) &&
        FilterdDoctersbySpecialty.length > 0 && (
          <div className="bg-white p-4 border border-gray-300 rounded shadow-sm mt-6">
            <h2 className="text-xl font-semibold mb-4">All Docters</h2>
            <section className="max-w-6xl  px-4 py-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {FilterdDoctersbySpecialty.map((doctor) => (
                <DocterCard key={doctor.id} doctor={doctor} />
              ))}
            </section>
          </div>
        )}
    </div>
  );
};

export default AdminHome;
