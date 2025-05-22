import React, { useState, useEffect } from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Input from "../components/re-usablecomponets/InputFeild";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { loadState } from "../store/localstorage";
import { fetchUsers } from "../functions/userSlice";
import { useForm } from "react-hook-form";
import { updateUser } from "../functions/userAPI";
import { fetchDoctor } from "../functions/doctorSlice";
import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, setDate } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { toast } from "react-toastify";
import { isAfter, startOfDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import { createSerializableStateInvariantMiddleware } from "@reduxjs/toolkit";

const locales = { "en-US": enUS };

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
  const currentUser = users.find((user) => user.id === id);
  const allAppointments = currentUser?.appointments;

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
  //  Find any block for today
  const blocked = (selectedDoctor?.unavailableslots || []).find(
    (slot) => slot.date === isoDate
  );

  const AvailableslotValue = slotsTimeValue.filter((time) => {
    if (!blocked) return true; // no block today → keep all
    return !(time <= blocked.end && time >= blocked.start);
    // return time !== blocked.start && time !== blocked.end;
  });
  // converting in 12 hours formate
  const Availableslot = AvailableslotValue.map((time) => {
    const parsed = parse(time, "HH:mm", new Date());

    const time12 = format(parsed, "hh:mm a");
    return time12;
  });

  // ----------------------------------------------------------------------------------------

  const handleDoctorChange = (e) => {
    const doctor = FilterdDoctersbySpecialty.find(
      (doctor) => doctor.name === e.target.value
    );
    setselectedDoctor(doctor);
  };
  // --------------------------- disable clicks according days -------------------------
  const isDraggable = (event) => {
    const now = startOfDay(new Date());
    return isAfter(event.start, now);
  };

  // const isDisabledDate = (date) => {
  //   const today = startOfDay(new Date());
  //   return isBefore(date, today);
  // };

  const dayPropGetter = (date) => {
    if (date.getDay() === 0) {
      return {
        style: {
          backgroundColor: "#e0e0e0",
          pointerEvents: "none",
          cursor: "not-allowed",
        },
      };
    }
    return {};
  };

  // changeing color events
  const eventStyleGetter = (event) => {
    let backgroundColor;

    if (event.status === "Confirmed") {
      backgroundColor = "#1fc640";
    } else if (event.status === "Pending") {
      backgroundColor = "orange";
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
        pointerEvents: event.status === "Pending" ? "auto" : "none",
        borderRadius: "5px",
        border: "none",
        padding: "2px 5px",
      },
    };
  };
  // -------------------  TESTING  -----------------------------------
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

  const isSlotInsideBlockedTime = (start, end, blocked) => {
    const bStart = parseInt(blocked.start.slice(0, 2), 10);
    const bEnd = parseInt(blocked.end.slice(0, 2), 10);
    const s = parseInt(format(start, "HH"), 10);
    const e = parseInt(format(end, "HH"), 10);
    return s < bEnd && bStart < e;
  };

  // -------------------  dnd and form logic -----------------------------------
  const selectedDoctorslot = selectedDoctor?.availableslots?.find(
    (slots) => slots.date === format(selectedDate, "yyyy-MM-dd")
  );

  // Function to check if requested slot fits inside available slot
  const isSlotAvailable = (requestedSlot) => {
    const availableStart = parseInt(selectedDoctorslot?.start.slice(0, 2));
    const availableEnd = parseInt(selectedDoctorslot?.end.slice(0, 2));
    const requestedStart = parseInt(requestedSlot?.start.slice(0, 2));
    const requestedEnd = parseInt(requestedSlot?.end.slice(0, 2));
    return availableStart <= requestedStart && availableEnd >= requestedEnd;
  };
  const seletcedUserSlot = currentUser?.appointments?.filter((slot) => {
    return slot.slot.date === format(selectedDate, "yyyy-MM-dd");
  });

  const isSlotBlock = (requestedSlot) => {
    if (!seletcedUserSlot?.length) return false;
    // filter   confirmed
    const confirmedSlots = seletcedUserSlot?.filter(
      (slot) => slot.status === "Confirmed"
    );
    if (confirmedSlots.length === 0) return false;

    const isBlocked = confirmedSlots.some((apt) => {
      // extracting the hour in numeric from
      const blockedStart = parseInt(apt?.slot?.start.slice(0, 2), 10);
      const blockedEnd = parseInt(apt.slot.end.slice(0, 2), 10);

      const reqStart = parseInt(requestedSlot?.start.slice(0, 2), 10);
      const reqEnd = parseInt(requestedSlot.end.slice(0, 2), 10);

      return reqStart < blockedEnd && blockedStart < reqEnd;
    });
    return isBlocked;
  };

  // dnd

  const isDnDBlocked = (start, end, confirmedSlots) => {
    if (!confirmedSlots?.length) return false;

    const reqStartHour = parseInt(format(start, "HH"), 10);
    const reqEndHour = parseInt(format(end, "HH"), 10);
    return confirmedSlots.some((apt) => {
      const blockedStart = parseInt(apt?.slot?.start.slice(0, 2), 10);
      const blockedEnd = parseInt(apt?.slot?.end.slice(0, 2), 10);

      return reqStartHour < blockedEnd && blockedStart < reqEndHour;
    });
  };

  const isDnDSlotUnavailable = (start, end, doctorslot) => {
    if (!doctorslot) {
      // no availability record = unavailable
      return true;
    }

    const blockedStart = parseInt(doctorslot.start.slice(0, 2), 10);
    const blockedEnd = parseInt(doctorslot.end.slice(0, 2), 10);

    const reqStart = parseInt(format(start, "HH"), 10);
    const reqEnd = parseInt(format(end, "HH"), 10);

    // return true if the requested interval lies outside the availability window
    return reqStart < blockedEnd && blockedStart < reqEnd;
    // requestedStart < blockedEnd && blockedStart < requestedEnd;
  };

  const handleEventDrop = async ({ event, start, end }) => {
    const doctorslot = selectedDoctor?.unavailableslots?.find(
      (s) => s.date === isoDate
    );

    // conflict with other appointments?
    const slotsForDay = currentUser?.appointments?.filter(
      (slot) => slot.slot.date === format(start, "yyyy-MM-dd")
    );
    const confirmedSlots = slotsForDay?.filter(
      (slot) => slot.status === "Confirmed"
    );

    if (isDnDBlocked(start, end, confirmedSlots)) {
      toast.error("Slot is already booked");
      return;
    }

    // outside doctor's available window
    if (isDnDSlotUnavailable(start, end, doctorslot)) {
      toast.info("Doctor is not available at that time");
      return;
    }
    if (!isWithinAllowedHours(start, end)) {
      alert("You can only book between 10:00 AM and 7:00 PM");
      return;
    }

    const updatedSlot = {
      date: format(start, "yyyy-MM-dd"),
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
      // Update UI
      setEvents((prev) =>
        prev.map((evt) => (evt.id === event.id ? { ...evt, start, end } : evt))
      );
      toast.success("Appointment moved");
    } catch (error) {
      console.error("Drag update failed", error);
      toast.error("Could not move appointment");
    }
  };
  // document.onkeydown:("esc", setShowModal(false));

  const handleEventResize = async ({ event, start, end }) => {
    const dropDate = format(start, "yyyy-MM-dd");
    const doctorslot = selectedDoctor?.availableslots?.find(
      (s) => s.date === dropDate
    );

    // conflict with other appointments?
    const slotsForDay = currentUser?.appointments?.filter(
      (slot) => slot.slot.date === format(start, "yyyy-MM-dd")
    );
    const confirmedSlots = slotsForDay?.filter(
      (slot) => slot.status === "Confirmed"
    );

    if (isDnDBlocked(start, end, confirmedSlots)) {
      toast.error("Slot is already booked");
      return;
    }
    // outside doctor's available window
    if (isDnDSlotUnavailable(start, end, doctorslot)) {
      toast.info("Doctor is not available at that time");
      return;
    }

    if (!isWithinAllowedHours(start, end)) {
      alert("You can only book between 10:00 AM and 7:00 PM");
      return;
    }

    // find the original appointment so we can keep its original date
    const originalAppt = currentUser.appointments.find(
      (a) => a.id === event.id
    );
    const updatedSlot = {
      date: originalAppt.slot.date, //  preserve original date
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

      // Update UI
      const updated = events.map((evt) =>
        evt.id === event.id ? { ...evt, start, end } : evt
      );
      onEventsChange(updated);
      toast.success("Appointment resized");
    } catch (error) {
      console.error("Resize update failed", err);
      toast.error("Could not resize appointment");
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
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
    const isBlockedByDoctor =
      blocked && isSlotInsideBlockedTime(start, end, blocked);

    // const isSlotAv = isSlotAvailable(formdata.appointments?.slot);

    // const isSlotbl = isSlotBlock(formdata.appointments?.slot);

    const updatedAppointments = [
      ...(currentUser.appointments || []),
      newAppointment,
    ];

    const updatedUserData = {
      ...currentUser,
      appointments: updatedAppointments,
    };
    // if (!isSlotAv) {
    //   toast.info(`${newAppointment.doctor} is not available`);
    //   toast.info("Please Choose any other Slot");
    //   reset();
    //   return;
    // }
    // if (isSlotbl) {
    //   toast.info("Slot is already Booked");
    //   reset();
    //   return;
    // }
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

    if (isBlockedByDoctor) {
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
        draggableAccessor={isDraggable}
        min={new Date(0, 0, 0, 10, 0)}
        max={new Date(0, 0, 0, 19, 0)}
        step={60}
        timeslots={1}
        dayLayoutAlgorithm="no-overlap"
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        resizable
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
