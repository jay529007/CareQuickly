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

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Contect = () => {
  const [currentView, setCurrentView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [events, setEvents] = useState([]);

  // data
   const authdata = loadState();
      const id = authdata.id;
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users?.users);
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  const currentUser = users.find((user) => user.id === id);
  // console.log(currentUser);
  const allAppointments = currentUser?.appointments;

  const handleViewChange = (view) => setCurrentView(view);

  const handleAddEvent = () => {
    if (!newTitle || !startTime || !endTime) return;

    const start = new Date(selectedDate);
    const end = new Date(selectedDate);
    const [startHour, startMin] = startTime.split(":");
    const [endHour, endMin] = endTime.split(":");

    start.setHours(startHour, startMin);
    end.setHours(endHour, endMin);

    const newEvent = {
      id: events.length + 1,
      title: newTitle,
      start,
      end,
    };

    setEvents([...events, newEvent]);
    setShowModal(false);
    setStartTime("");
    setEndTime("");
    setNewTitle("");
  };

  useEffect(() => {
    if (allAppointments) {
      const formatted = allAppointments.map((appt, index) => {
        const dateStr = appt.notes; 
        const [startHour, startMin, startPeriod] =
          appt.slot.start.split(/[:\s]/);
        const [endHour, endMin, endPeriod] = appt.slot.end.split(/[:\s]/);

        const convertTo24Hr = (hour, min, period) =>
          period === "PM" && +hour !== 12
            ? +hour + 12
            : period === "AM" && +hour === 12
            ? 0
            : +hour;

        const start = new Date(dateStr);
        start.setHours(
          convertTo24Hr(startHour, startMin, startPeriod),
          +startMin || 0
        );

        const end = new Date(dateStr);
        end.setHours(convertTo24Hr(endHour, endMin, endPeriod), +endMin || 0);

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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">My Calendar</h2>
      {/* {allAppointments?.map((appointment) => (
      <div key={appointment.id} className="border p-2 mb-2 rounded">
        <h3 className="font-bold">{appointment.service}</h3>
        <p>Date: {appointment.notes}</p>
        <p>
          Time: {appointment.slot.start} - {appointment.slot.end}
        </p>
      </div>
      ))} */}
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

            <Input
              label="Name: "
              type="text"
              disabled
              className="border w-full p-1 mb-2"
              placeholder="User"
            />
            <Input
              label="Email: "
              type="text"
              disabled
              className="border w-full p-1 mb-2"
              placeholder="Useremail"
            />

            <div>
              <label
                htmlFor="Service"
                className="block text-md font-sm text-black"
              >
                Service
              </label>
              <select className="mt-2.5 block  bg-white w-full p-2  border rounded-md">
                <option hidden value="">
                  Select Service
                </option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Dentist">Dentist</option>
                <option value="General-Physician">General Physician</option>
                <option value="Cardiologist">Cardiologist</option>
              </select>
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
              />
            </div>
            {/* time */}
            <div className="flex gap-2 mb-2">
              <Input type="time" className="border rounded-2xl w-full p-1" />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contect;
