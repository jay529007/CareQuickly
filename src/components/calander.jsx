import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Input from "../components/re-usablecomponets/InputFeild";
// import "../../App.css";
import { useDispatch, useSelector } from "react-redux";
import { loadState } from "../store/localstorage";
import { fetchUsers } from "../functions/userSlice";
import { useForm } from "react-hook-form";
import { updateUser } from "../functions/userAPI";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const MyCalendar = () => {
  const [currentView, setCurrentView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);

  // fetching currentusers  Appointments
  const id = loadState();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users?.users);
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);
  const currentUser = users.find((user) => user.id === id);
  const allAppointments = currentUser?.appointments;

  // for navigating in toolbar
  const handleViewChange = (view) => setCurrentView(view);

  // Formatting Appointments for Calendar
  useEffect(() => {
    if (allAppointments) {
      const formatted = allAppointments.map((appt, index) => {
        const dateStr = appt.slot.date;
        const [startHour, startMin] = appt.slot.start.split(":").map(Number);
        const [endHour, endMin] = appt.slot.end.split(":").map(Number);

        const start = new Date(dateStr);
        start.setHours(startHour, startMin, 0, 0);

        const end = new Date(dateStr);
        end.setHours(endHour, endMin, 0, 0);

        return {
          id: appt.id || index,
          title: `${appt.service}`,
          start,
          end,
        };
      });

      setEvents(formatted);
    }
  }, [allAppointments]);

  // toolbar
  const CustomToolbar = ({ label, onNavigate, onView }) => (
    <div className="flex justify-between items-center mb-2">
      <div className="flex gap-2 items-center">
        <>
          <button
            className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
            onClick={() => onNavigate("PREV")}
          >
            ←
          </button>
          <button
            className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
            onClick={() => onNavigate("NEXT")}
          >
            →
          </button>
        </>
        <h3 className="text-lg font-bold">{label}</h3>
      </div>

      <div className="space-x-2">
        <button
          onClick={() => onView("month")}
          className="p-2 bg-gray-200 rounded cursor-pointer"
        >
          Month
        </button>
        <button
          onClick={() => onView("week")}
          className="p-2 bg-gray-200 rounded cursor-pointer"
        >
          Weeks
        </button>
        <button
          onClick={() => onView("day")}
          className="p-2 bg-gray-200 rounded cursor-pointer"
        >
          Day
        </button>
      </div>
    </div>
  );

  // saving new Appointment
  const isoDate = new Date(selectedDate).toISOString();

  const errorClass =
    "text-red-500 text-sm w-fit p-1 font-medium uppercase mt-2 bg-gray-200/50";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (formdata) => {
    // const newAppointment = formdata.appointments;
    // newAppointment.id = crypto.randomUUID();
    // newAppointment.slot.date = format(selectedDate, "yyyy-MM-dd");
    const newAppointment = {
      id: crypto.randomUUID(),
      service: formdata.appointments.service,
      notes: formdata.appointments.notes,
      slot: {
        date: format(selectedDate, "yyyy-MM-dd"),
        start: formdata.appointments.slot?.start,
        end: formdata.appointments.slot.end,
      },
    };

    const updatedAppointments = [
      ...(currentUser.appointments || []),
      newAppointment,
    ];

    const updatedUserData = {
      ...currentUser,
      appointments: updatedAppointments,
    };

    updateUser(currentUser.id, updatedUserData);
    console.log("Updated User:", updatedUserData);

    // Optional: Close modal
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">My Calendar</h2>
      {/* Displaying the Calendar */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        date={currentDate}
        view={currentView}
        views={["month", "week", "day"]}
        onView={handleViewChange}
        onNavigate={(date) => setCurrentDate(date)}
        onSelectSlot={({ start }) => {
          setSelectedDate(start);
          setShowModal(true);
        }}
        selectable={true}
        components={{ toolbar: (props) => <CustomToolbar {...props} /> }}
      />
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-4 rounded-xl shadow w-[50%]">
            <h3 className="text-xl font-bold mb-2">New Appointment</h3>
            <p className="text-sm mb-1">Date: {format(selectedDate, "PPP")}</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* name */}
              <div>
                <Input
                  label="Name: "
                  type="text"
                  value={currentUser.name}
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
                  value={currentUser.email}
                  className="border w-full p-1 mb-2"
                  placeholder="Useremail"
                />
              </div>

              {/* services */}
              <div>
                <label
                  htmlFor="Service"
                  className="block text-md font-sm text-black"
                >
                  Service
                </label>
                <select
                  className="mt-2.5 block  bg-white w-full p-2  border rounded-md"
                  {...register("appointments.service", {
                    required: "Select the Service",
                  })}
                >
                  <option hidden value="">
                    Select Service
                  </option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Dentist">Dentist</option>
                  <option value="General-Physician">General Physician</option>
                  <option value="Cardiologist">Cardiologist</option>
                </select>
                {errors.appointments?.service && (
                  <p className={errorClass}>
                    {errors.appointments?.service.message}
                  </p>
                )}
              </div>
              <br />
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
                    className="mt-2.5 block  bg-white w-full p-2  border rounded-md"
                    {...register("appointments.slot.start", {
                      required: "Select the Service",
                    })}
                  >
                    <option hidden value="">
                      Select Time
                    </option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 AM</option>
                    <option value="13:00">01:00 PM</option>
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
                    className="mt-2.5 block  bg-white w-full p-2  border rounded-md"
                    {...register("appointments.slot.end", {
                      required: "Select the time",
                    })}
                  >
                    <option hidden value="">
                      Select Time
                    </option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 AM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:00">02:00 PM</option>
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
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
