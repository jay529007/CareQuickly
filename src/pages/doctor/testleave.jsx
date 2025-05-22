import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths
} from "date-fns";
import { Calendar, Edit, Trash, Plus } from "react-feather";

const DoctorLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [newLeave, setNewLeave] = useState({
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "17:00",
    reason: "",
  });

  // Calendar logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleAddLeave = () => {
    // Add leave logic here
    setShowForm(false);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(direction === 'next' ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1));
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
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Leave
        </button>
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
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                ←
              </button>
              <button
                onClick={() => navigateMonth('next')}
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
            {daysInMonth.map((day) => (
              <div
                key={day}
                className={`min-h-[80px] p-2 text-sm rounded-lg border transition-colors
                  ${isSameMonth(day, currentMonth) ? 'bg-white' : 'bg-slate-50 text-slate-400'}
                  ${leaves.some((l) => l.date === format(day, "yyyy-MM-dd")) 
                    ? 'border-blue-200 bg-blue-50' : 'border-transparent'}
                  hover:border-blue-300 cursor-pointer`}
                onClick={() => {
                  setSelectedDate(day);
                  setShowForm(true);
                }}
              >
                <div className="font-medium">{format(day, "d")}</div>
                {leaves.some((l) => l.date === format(day, "yyyy-MM-dd")) && (
                  <div className="text-xs mt-1 text-blue-600">Unavailable</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Leave List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[calc(100vh-180px)] overflow-y-auto">
          <h3 className="font-semibold text-lg mb-4">Scheduled Leaves</h3>
          <div className="space-y-3">
            {leaves.map((leave) => (
              <div
                key={leave.id}
                className="p-4 bg-slate-50 rounded-lg border border-slate-200 group hover:border-blue-200 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-slate-800">{leave.date}</div>
                    <div className="text-sm text-slate-600">
                      {leave.startTime} - {leave.endTime}
                    </div>
                    {leave.reason && (
                      <div className="text-sm text-slate-500 mt-2">
                        {leave.reason}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-slate-600 hover:text-blue-600 p-1">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-slate-600 hover:text-red-600 p-1">
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Leave Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="font-semibold text-lg mb-4">Create New Leave</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newLeave.startDate}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, startDate: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newLeave.endDate}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Time Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newLeave.startTime}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, startTime: e.target.value })
                    }
                  >
                    {[...Array(24).keys()].map((h) => (
                      <option
                        key={h}
                        value={`${h.toString().padStart(2, "0")}:00`}
                      >
                        {h % 12 || 12}:00 {h >= 12 ? "PM" : "AM"}
                      </option>
                    ))}
                  </select>
                  <select
                    className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newLeave.endTime}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, endTime: e.target.value })
                    }
                  >
                    {[...Array(24).keys()].map((h) => (
                      <option
                        key={h}
                        value={`${h.toString().padStart(2, "0")}:00`}
                      >
                        {h % 12 || 12}:00 {h >= 12 ? "PM" : "AM"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={handleAddLeave}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                  onClick={() => setShowForm(false)}
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