import React, { useState, useEffect } from "react";
import { Calendar } from "react-big-calendar";
import Input from "../components/re-usablecomponets/InputFeild";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { loadState } from "../store/localstorage";
import { fetchUsers } from "../functions/userSlice";
import { useForm } from "react-hook-form";
import { updateUser } from "../functions/userAPI";
import { fetchDoctor } from "../functions/doctorSlice";
import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enIN } from "date-fns/locale";
import { toast } from "react-toastify";
import { isAfter, startOfDay, isBefore, isSameDay } from "date-fns";
import { useNavigate } from "react-router-dom";

const locales = { "en-IN": enIN };

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const hospitalHours = {
  open: "10:00",
  close: "19:00",
  lunch: { start: "12:00", end: "14:00" },
  workingDays: [1, 2, 3, 4, 5, 6], // Mon–Sat (0 = Sun)
};

const slotsTimeValue = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

const DragAndDropCalendar = withDragAndDrop(Calendar);
const MyCalendar = () => {
  const [currentView, setCurrentView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedSpecialty, setselectedSpecialty] = useState("");
  const [selectedDoctor, setselectedDoctor] = useState(null);
  const navigate = useNavigate();
  // fetching currentusers  Appointments
  const authdata = loadState();
  const id = authdata.id;
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users?.users);
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);
  const currentUser = users?.find((user) => user.id === id);
  const allAppointments = currentUser?.appointments;
  format(new Date(), "P", { locale: locales["en-IN"] });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  // for navigating in toolbar
  const handleViewChange = (view) => setCurrentView(view);

  //Restriction in hours
  const isWithinAllowedHours = (start, end) => {
    const startHour = start.getHours();
    const endHour = end.getHours();
    return startHour >= 10 && endHour <= 19;
  };

  const isoDate = format(selectedDate, "yyyy-MM-dd");

  // Formatting Appointments for Calendar
  useEffect(() => {
    if (allAppointments) {
      const formatted = allAppointments.map((appt, index) => {
        const dateStr = appt.slot.date;
        const status = appt.status;
        const [startHour, startMin] = appt.slot.start.split(":").map(Number);
        const [endHour, endMin] = appt.slot.end.split(":").map(Number);

        const start = new Date(dateStr);
        start.setHours(startHour, startMin, 0, 0);

        const end = new Date(dateStr);
        end.setHours(endHour, endMin, 0, 0);

        return {
          id: appt.id || index,
          title: `${appt.service}`,
          status,
          start,
          end,
        };
      });

      setEvents(formatted);
    }
  }, [allAppointments]);

  // toolbar
  const CustomToolbar = ({ label, onNavigate, onView }) => (
    <div className="flex justify-between items-center mb-3">
      <div className="flex gap-2  items-center">
        <>
          <button
            className="px-3 py-2 bg-white border border-gray-300 hover:bg-gray-100 rounded cursor-pointer"
            onClick={() => onNavigate("PREV")}
          >
            {/* < */}
            &lt;
            {/* Back */}
          </button>
          <h3 className="px-3 py-2 bg-gray-100 border border-gray-300 rounded">
            {label}
          </h3>
          <button
            className="px-3 py-2 bg-white border border-gray-300 hover:bg-gray-100 rounded cursor-pointer"
            onClick={() => onNavigate("NEXT")}
          >
            {/* > */}
            &gt;
            {/* Next */}
          </button>
        </>
      </div>

      <div className="space-x-2">
        <button
          onClick={() => onView("month")}
          className="py-2 px-3 bg-white border border-gray-300 hover:bg-gray-100 rounded-md cursor-pointer"
        >
          Month
        </button>
        <button
          onClick={() => onView("week")}
          className="py-2 px-3 bg-white border border-gray-300 hover:bg-gray-100 rounded cursor-pointer"
        >
          Weeks
        </button>
        <button
          onClick={() => onView("day")}
          className="py-2 px-3 bg-white border border-gray-300 hover:bg-gray-100 rounded cursor-pointer"
        >
          Day
        </button>
      </div>
    </div>
  );
  // --------------------------- disable clicks according days -------------------------
  const isDraggable = (event) => {
    const now = startOfDay(new Date());
    return isAfter(event.start, now);
  };

  function dayPropGetter(date) {
    const today = startOfDay(new Date());
    const isPast = isBefore(date, today);
    const dow = getDay(date);
    const isToday = isSameDay(date, today);

    // find if this date is a leave day
    const iso = format(date, "yyyy-MM-dd");
    const onLeave = !!selectedDoctor?.unavailableslots?.find(
      (s) => s.date === iso
    );

    let style = {};
    if (dow === 0) style.backgroundColor = "#f0f0f0";
    if (isPast) style.backgroundColor = "#ececef"; // very light grey
    else if (isToday) style.backgroundColor = "#e3f2fd  "; // light blue
    if (onLeave) style.backgroundColor = "#fde8e8"; // pale red

    return { style };
  }

  // changeing color events
  const eventStyleGetter = (event) => {
    let backgroundColor;

    if (event.status === "Confirmed") {
      backgroundColor = "#1fc640";
    } else if (event.status === "Pending") {
      backgroundColor = "#F6C23E";
    } else if (event.status === "Cancelled") {
      backgroundColor = "red";
    } else {
      backgroundColor = "gray";
    }
    if (!isDraggable(event)) {
      backgroundColor = "gray";
    }

    return {
      style: {
        backgroundColor,
        color: "white",
        // backgroundColor: "red",
        pointerEvents: event.status === "Pending" ? "auto" : "none",
        borderRadius: "5px",
        border: "none",
        padding: "2px 5px",
      },
    };
  };
  const errorClass =
    "text-red-500 text-sm w-fit p-1 font-medium uppercase mt-2 bg-gray-200/50";

  const doctors = useSelector((state) => state.doctors.doctors);

  useEffect(() => {
    dispatch(fetchDoctor());
  }, [dispatch]);
  const FilterdDoctersbySpecialty = doctors.filter(
    (doctor) => doctor.specialty === selectedSpecialty
  );

  // --------------------------- disable time -------------------------
  const dayOfWeek = getDay(selectedDate);
  //  Find any block for today
  const todayBlock = (selectedDoctor?.unavailableslots || [])?.find(
    (slot) => slot.date === isoDate
  );

  // parse hours to integers once
  const openH = parseInt(hospitalHours.open.slice(0, 2), 10);
  const closeH = parseInt(hospitalHours.close.slice(0, 2), 10);
  const lunchStart = parseInt(hospitalHours.lunch.start.slice(0, 2), 10);
  const lunchEnd = parseInt(hospitalHours.lunch.end.slice(0, 2), 10);

  const AvailableslotValue = (() => {
    // 1) if not a working day, no slots at all
    if (!hospitalHours.workingDays.includes(dayOfWeek)) {
      return [];
    }

    return slotsTimeValue.filter((time) => {
      const h = parseInt(time.slice(0, 2), 10);

      // 2) outside hospital hours?
      if (h < openH || h >= closeH) return false;

      // 3) during lunch break?
      if (h >= lunchStart && h < lunchEnd) return false;

      // 4) overlapping doctor’s personal block?
      if (todayBlock) {
        const bs = parseInt(todayBlock.start.slice(0, 2), 10);
        const be = parseInt(todayBlock.end.slice(0, 2), 10);
        if (h >= bs && h < be) return false;
      }

      // otherwise it’s fine
      return true;
    });
  })();

  // converting in 12 hours formate
  const Availableslot = AvailableslotValue.map((time) => {
    const parsed = parse(time, "HH:mm", new Date());

    const time12 = format(parsed, "hh:mm a");
    return time12;
  });
  useEffect(() => {
    if (!selectedDoctor) return;
    // console.log(AvailableslotValue);
    if (AvailableslotValue.length <= 2) {
      toast.info(`${selectedDoctor.name} is on leave`);
      setShowModal(false);
      setselectedDoctor("");
      reset();
    }
  }, [AvailableslotValue.length, selectedDoctor, reset, setShowModal]);

  // ----------------------------------------------------------------------------------------

  const handleDoctorChange = (e) => {
    const doctor = FilterdDoctersbySpecialty?.find(
      (doctor) => doctor.name === e.target.value
    );
    setselectedDoctor(doctor);
  };

  // -------------------  Unavailable slotes form  -----------------------------------
  const isSlotWithinHospitalHours = (start, end) => {
    const open = parseInt(hospitalHours.open.slice(0, 2), 10);
    const close = parseInt(hospitalHours.close.slice(0, 2), 10);
    const s = parseInt(format(start, "HH"), 10);
    const e = parseInt(format(end, "HH"), 10);
    return s >= open && e <= close;
  };

  const isSlotDuringLunch = (start, end) => {
    const lunchStart = parseInt(hospitalHours.lunch.start.slice(0, 2), 10);
    const lunchEnd = parseInt(hospitalHours.lunch.end.slice(0, 2), 10);
    const s = parseInt(format(start, "HH"), 10);
    const e = parseInt(format(end, "HH"), 10);
    return s < lunchEnd && lunchStart < e;
  };

  const isSlotInsideBlockedTime = (start, end, unavailableslots) => {
    const bStart = parseInt(unavailableslots.start.slice(0, 2), 10);
    const bEnd = parseInt(unavailableslots.end.slice(0, 2), 10);
    const s = parseInt(format(start, "HH"), 10);
    const e = parseInt(format(end, "HH"), 10);
    return s < bEnd && bStart < e;
  };
  // ---------------------------------------dnd ---------------------------------------
  // Add this function near your other utility functions (before handleEventDrop)
  const isSlotInvalid = ({ start, end, date, todayBlock, hospitalHours }) => {
    const dayOfWeek = date.getDay();

    // 1) Check if it's a working day
    if (!hospitalHours.workingDays.includes(dayOfWeek)) {
      return "Hospital is closed on this day";
    }

    // 2) Check hospital hours
    const openH = parseInt(hospitalHours.open.slice(0, 2), 10);
    const closeH = parseInt(hospitalHours.close.slice(0, 2), 10);
    const s = parseInt(format(start, "HH"), 10);
    const e = parseInt(format(end, "HH"), 10);

    if (s < openH || e > closeH) {
      return "Please choose a time within hospital working hours";
    }

    // 3) Check lunch hours
    const lunchStart = parseInt(hospitalHours.lunch.start.slice(0, 2), 10);
    const lunchEnd = parseInt(hospitalHours.lunch.end.slice(0, 2), 10);

    if (s < lunchEnd && lunchStart < e) {
      return "Cannot book during lunch hours";
    }

    // 4) Check doctor's blocked time
    if (todayBlock) {
      const bs = parseInt(todayBlock.start.slice(0, 2), 10);
      const be = parseInt(todayBlock.end.slice(0, 2), 10);

      if (s < be && bs < e) {
        return "Doctor is unavailable at this time";
      }
    }

    return null;
  };

  const handleEventDrop = async ({ event, start, end }) => {
    const iso = format(start, "yyyy-MM-dd");
    const today = startOfDay(new Date());
    // A) conflict with other confirmed appointments
    const dayAppts = currentUser.appointments.filter(
      (a) => a.slot.date === iso && a.status === "Confirmed"
    );
    const conflict = dayAppts.some((a) => {
      const bs = +a.slot.start.slice(0, 2),
        be = +a.slot.end.slice(0, 2);
      const sH = +format(start, "HH"),
        eH = +format(end, "HH");
      return sH < be && bs < eH;
    });
    if (conflict) {
      return toast.error("Slot is already booked");
    }

    if (isBefore(start, today)) return;

    // B) apply the unified rules
    const todayBlock = (selectedDoctor?.unavailableslots || [])?.find(
      (s) => s.date === iso
    );

    const reason = isSlotInvalid({
      start,
      end,
      date: start,
      todayBlock,
      hospitalHours,
    });
    if (reason) {
      return toast.info(reason);
    }

    // C) now actually move it
    const updatedSlot = {
      date: iso,
      start: format(start, "HH:mm"),
      end: format(end, "HH:mm"),
    };
    const updatedAppointments = currentUser.appointments.map((appt) =>
      appt.id === event.id ? { ...appt, slot: updatedSlot } : appt
    );
    const updatedUserData = {
      ...currentUser,
      appointments: updatedAppointments,
    };

    try {
      await updateUser(currentUser.id, updatedUserData);
      dispatch(fetchUsers());
      setEvents((evts) =>
        evts.map((e) => (e.id === event.id ? { ...e, start, end } : e))
      );
      toast.success("Appointment moved");
    } catch (err) {
      console.error(err);
      toast.error("Could not move appointment");
    }
  };
  const handleEventResize = async ({ event, start, end }) => {
    const iso = format(start, "yyyy-MM-dd");

    // 1) Check for conflicts with other confirmed appointments
    const dayAppts = currentUser.appointments.filter(
      (a) => a.slot.date === iso && a.status === "Confirmed"
    );
    const conflict = dayAppts.some((a) => {
      const bs = +a.slot.start.slice(0, 2),
        be = +a.slot.end.slice(0, 2);
      const sH = +format(start, "HH"),
        eH = +format(end, "HH");
      return sH < be && bs < eH;
    });
    if (conflict) {
      return toast.error("Resizing would conflict with another appointment");
    }

    // 2) Apply validation rules
    const todayBlock = (selectedDoctor?.unavailableslots || [])?.find(
      (s) => s.date === iso
    );

    const reason = isSlotInvalid({
      start,
      end,
      date: start,
      todayBlock,
      hospitalHours,
    });
    if (reason) {
      return toast.info(reason);
    }

    // 3) Update the appointment
    const updatedSlot = {
      date: iso,
      start: format(start, "HH:mm"),
      end: format(end, "HH:mm"),
    };
    const updatedAppointments = currentUser.appointments.map((appt) =>
      appt.id === event.id ? { ...appt, slot: updatedSlot } : appt
    );
    const updatedUserData = {
      ...currentUser,
      appointments: updatedAppointments,
    };

    try {
      await updateUser(currentUser.id, updatedUserData);
      dispatch(fetchUsers());
      setEvents((evts) =>
        evts.map((e) => (e.id === event.id ? { ...e, start, end } : e))
      );
      toast.success("Appointment resized successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to resize appointment");
    }
  };

  const onSubmit = async (formdata) => {
    const newAppointment = {
      id: uuidv4(),
      service: formdata.appointments.service,
      doctor: formdata.appointments.doctor,
      status: "Pending",
      notes: formdata.appointments.notes,
      slot: {
        date: format(selectedDate, "yyyy-MM-dd"),
        start: formdata.appointments.slot?.start,
        end: formdata.appointments.slot.end,
      },
    };
    const start = parse(formdata.appointments.slot.start, "HH:mm", new Date());
    const end = parse(formdata.appointments.slot.end, "HH:mm", new Date());

    const isWorkingDay = hospitalHours.workingDays.includes(
      getDay(selectedDate)
    );
    const isInHospitalTime = isSlotWithinHospitalHours(start, end);
    const isDuringLunchBreak = isSlotDuringLunch(start, end);
    const isBlocked =
      todayBlock && isSlotInsideBlockedTime(start, end, todayBlock);

    const updatedAppointments = [
      ...(currentUser.appointments || []),
      newAppointment,
    ];

    const updatedUserData = {
      ...currentUser,
      appointments: updatedAppointments,
    };

    if (!isWorkingDay) {
      toast.info("Hospital is closed on this day");
      return;
    }

    if (!isInHospitalTime) {
      toast.info("Please choose a time within hospital working hours");
      return;
    }

    if (isDuringLunchBreak) {
      toast.info("Cannot book during lunch hours");
      return;
    }

    if (isBlocked) {
      toast.info("Doctor is unavailable at this time");
      return;
    }

    try {
      await updateUser(currentUser.id, updatedUserData);
      dispatch(fetchUsers());
      toast.success("Successfully Booked Appointment");
      // Close modal
      reset();
      setShowModal(false);
      navigate("/appointment/details");
    } catch (error) {
      console.error("Appointment Booking failed", error);
      reset();
      toast.error("Appointment Booking failed ");
      toast.info("Please try again");
    }
  };

  return (
    <div className="">
      {/* Displaying the Calendar */}
      <DragAndDropCalendar
        localizer={localizer}
        events={events}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
        // draggableAccessor={isDraggable}
        draggableAccessor={(event) => event.status === "Pending"} // Only allow dragging pending appointments
        min={new Date(0, 0, 0, 10, 0)}
        max={new Date(0, 0, 0, 19, 0)}
        step={60}
        timeslots={1}
        dayLayoutAlgorithm="no-overlap"
        onEventDrop={handleEventDrop}
        // onEventResize={handleEventResize}
        // resizable={true} // Changed to false unless you implement resize handling
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        date={currentDate}
        view={currentView}
        views={["month", "week", "day"]}
        onView={handleViewChange}
        onNavigate={(date) => setCurrentDate(date)}
        onSelectSlot={({ start }) => {
          const today = startOfDay(new Date());

          // if the slot is before the start of today, block it
          if (isBefore(start, today)) {
            // toast.info("Cannot book appointments in the past");
            return;
          }

          // otherwise it's today or in the future
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
                    disabled={!selectedSpecialty}
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
                    disabled={!selectedDoctor}
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
                    disabled={!selectedDoctor}
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
                    {/* 
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 AM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                    <option value="19:00">07:00 PM</option> */}
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
