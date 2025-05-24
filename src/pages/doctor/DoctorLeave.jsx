import { useState, useMemo, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
  parse,
} from "date-fns";
import { Calendar, Edit, Trash, Plus, Flag } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { loadState } from "../../store/localstorage";
import { fetchDoctor } from "../../functions/doctorSlice";
import { useForm } from "react-hook-form";
import { updateDoctorSlot } from "../../functions/doctorAPI";
import { toast } from "react-toastify";
import { Trash2 } from "react-feather";

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

const DoctorLeave = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [SelectedDate, setSelectedDate] = useState();
  const [editingLeave, setEditingLeave] = useState(null);
  // At top of component
  const [pendingDelete, setPendingDelete] = useState(null);

  const authdata = loadState();
  const doctorId = authdata.id;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDoctor());
  }, [dispatch]);
  const doctors = useSelector((state) => state.doctors.doctors);
  const currentDoctor = doctors?.find((doctor) => doctor.id === doctorId);
  const Unavailableslots = currentDoctor?.unavailableslots || [];

  const formatedSelectedDate = SelectedDate
    ? format(SelectedDate, "yyyy-MM-dd")
    : "";

  // ------------------------- converting in 12 hours formate -------------------------
  const Availableslot = slotsTimeValue?.map((time) => {
    const parsed = parse(time, "HH:mm", new Date());

    const time12 = format(parsed, "hh:mm a");
    return time12;
  });

  // ------------------------------ edit delete ------------------------------

  const deleteleave = async (info) => {
    try {
      const filteredSlots = (currentDoctor.unavailableslots || []).filter(
        (slot) => slot.date !== info.date
      );

      const updatedDoctor = {
        ...currentDoctor,
        unavailableslots: filteredSlots,
      };

      await updateDoctorSlot(currentDoctor.id, updatedDoctor);
      toast.success("Leave deleted");
      dispatch(fetchDoctor());
    } catch (error) {
      console.error("Deleting Leave failed:", error);
      toast.error("Something went wrong while deleting.");
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // for prefild form
  useEffect(() => {
    if (!showForm) return;

    if (editingLeave) {
      // Edit mode: populate fields
      setValue("unavailableslots.start", editingLeave.start);
      setValue("unavailableslots.end", editingLeave.end);
      setValue("unavailableslots.reason", editingLeave.reason);
    } else {
      // Add mode: clear fields
      reset();
    }
  }, [showForm, editingLeave]);

  // Memoize days to avoid recalculation on every render
  const daysInMonth = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  }, [currentMonth]);

  const navigateMonth = (direction) => {
    setCurrentMonth(
      direction === "next"
        ? addMonths(currentMonth, 1)
        : subMonths(currentMonth, 1)
    );
  };

  const onSubmit = async (formData) => {
    try {
      console.log("Form data:", formData);
      const newSlot = {
        date: formatedSelectedDate,
        start: formData.unavailableslots.start,
        end: formData.unavailableslots.end,
        reason: formData.unavailableslots.reason,
      };

      const updatedDoctor = { ...currentDoctor };
      const existingSlots = [...(updatedDoctor.unavailableslots || [])];
      // if slotalrady available it'l have -1 index
      const index = existingSlots.findIndex(
        (slot) => slot.date === newSlot.date
      );

      if (index !== -1) {
        existingSlots[index] = newSlot;
      } else {
        existingSlots.push(newSlot);
      }

      updatedDoctor.unavailableslots = existingSlots;

      // console.log("Updated Doctor:", updatedDoctor);
      await updateDoctorSlot(updatedDoctor.id, updatedDoctor);
      //   toast.info("Leave Will be Approved Shortly");
      toast.success("Leave Scheduled");
      reset();
      setShowForm(false);
      dispatch(fetchDoctor());
    } catch (error) {
      console.error("Leave Scheduling failed:", error);
      toast.error("Something went wrong while Scheduling.");
      setShowForm(false);
      reset();
    }
  };

  const getLeaveForDate = (date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return Unavailableslots.find((slot) => slot.date === dateString);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            Manage Availability
          </h1>
          <p className="text-slate-600 mt-2">
            Mark your unavailable dates and time slots
          </p>
        </div>
        {/* <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Leave
        </button> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                ←
              </button>
              <button
                onClick={() => navigateMonth("next")}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-slate-500 text-sm font-medium py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map((day) => {
              const leave = getLeaveForDate(day);
              const hasLeave = Boolean(leave);

              return (
                <div
                  key={day}
                  className={`min-h-[80px] p-2 text-sm rounded-lg border transition-colors cursor-pointer
                    ${
                      isSameMonth(day, currentMonth)
                        ? "bg-white"
                        : "bg-slate-50 text-slate-400"
                    }
                    ${
                      hasLeave
                        ? "border-red-200 bg-red-50"
                        : "border-transparent hover:border-blue-300"
                    }
                  `}
                  onClick={() => {
                    setSelectedDate(day);
                    setShowForm(true);
                    setEditingLeave(null);
                  }}
                >
                  <div className="font-medium">{format(day, "d")}</div>
                  {hasLeave && (
                    <div className="text-xs mt-1 text-red-600">
                      {leave.start} - {leave.end}
                      {leave.reason && (
                        <div className="text-xs text-red-500 mt-1 truncate">
                          {leave.reason || "N/A"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Leave List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-lg mb-4">Scheduled Leaves</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {Unavailableslots.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                No scheduled leaves
              </p>
            ) : (
              Unavailableslots.map((leave, index) => (
                <div
                  key={leave.id || index}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200 group hover:border-blue-200 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-slate-800">
                        {format(new Date(leave.date), "MMM dd, yyyy")}
                      </div>
                      <div className="text-sm text-slate-600">
                        {leave.start} - {leave.end}
                      </div>
                      {leave.reason && (
                        <div className="text-sm text-slate-500 mt-2">
                          {leave.reason || "N/A"}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ">
                      {/* <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"> */}
                      <button
                        onClick={() => {
                          setEditingLeave(leave); // leave is the object from Unavailableslots
                          setSelectedDate(new Date(leave.date));
                          setShowForm(true);
                        }}
                        className="text-blue-600 p-1"
                        // className="text-slate-600 hover:text-blue-600 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setPendingDelete(leave)}
                        className="text-slate-600 hover:text-red-600 p-1"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {pendingDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Flag className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Deletion
                </h3>
              </div>
              <p className="text-gray-600">
                Are you sure you want to delete your leave on{" "}
                <span className="font-medium">{pendingDelete.date}</span>?
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setPendingDelete(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await deleteleave(pendingDelete);
                    setPendingDelete(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Leave Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="font-semibold text-lg mb-4">Create New Leave</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date:
                </label>
                <p className="text-sm mb-1">{format(SelectedDate, "PPP")}</p>
              </div>

              {/* time */}
              <div className="flex gap-3">
                {/* Stating Time */}
                <div className="flex-1">
                  <label className="block text-md font-sm text-black">
                    Select Stating Time
                  </label>
                  <select
                    // disabled={!selectedDoctor}
                    className="mt-2.5 block  bg-white w-full p-2  border  rounded-md"
                    {...register("unavailableslots.start", {
                      required: "Enter Starting Time",
                    })}
                  >
                    <option hidden value="">
                      Select Time
                    </option>
                    {slotsTimeValue.map((value, i) => {
                      // i is the index into both arrays
                      const display = Availableslot[i];
                      return (
                        <option key={value} value={value}>
                          {display}
                        </option>
                      );
                    })}
                  </select>
                  {errors.unavailableslots?.start && (
                    <p className={errorClass}>
                      {errors.unavailableslots?.start.message}
                    </p>
                  )}
                </div>
                {/* Ending Time */}
                <div className="flex-1">
                  <label className="block text-md font-sm text-black">
                    Select Ending Time
                  </label>
                  <select
                    // disabled={!selectedDoctor}
                    className="mt-2.5 block  bg-white w-full p-2  border rounded-md"
                    {...register("unavailableslots.end", {
                      required: "Enter Ending Time",
                    })}
                  >
                    <option hidden value="">
                      Select Time
                    </option>
                    {slotsTimeValue.map((value, i) => {
                      // i is the index into both arrays
                      const display = Availableslot[i];
                      return (
                        <option key={value} value={value}>
                          {display}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {errors.unavailableslots?.end && (
                  <p className={errorClass}>
                    {errors.unavailableslots?.end.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason
                </label>
                <textarea
                  placeholder="Enter reason for leave"
                  rows="3"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  {...register("unavailableslots.reason", {
                    required: "Reason is required",
                  })}
                />
                {errors.unavailableslots?.reason && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.unavailableslots?.reason.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                  onClick={() => {
                    reset();
                    setShowForm(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorLeave;
