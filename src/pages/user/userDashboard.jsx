import React, { useEffect, useMemo, useState } from "react";
import { loadState } from "../../store/localstorage";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../functions/userSlice";
import { updateUser } from "../../functions/userAPI";
import { toast } from "react-toastify";
import {
  FaFilter,
  FaCalendarAlt,
  FaTimes,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

const UserDashboard = () => {
  const authdata = loadState();
  const id = authdata.id;
  const dispatch = useDispatch();
  const [sortAsc, setSortAsc] = useState(false);
  const users = useSelector((state) => state.users.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const currentUser = users.find((user) => user.id === id);
  const allAppointments = currentUser?.appointments;
  const [filter, setFilter] = useState({ status: "", date: "" });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const todayFormatted = new Date().toISOString().split("T")[0];

  const filteredBookings = allAppointments?.filter(
    (b) =>
      (!filter.date || b.slot.date === filter.date) &&
      (!filter.status || b.status === filter.status)
  );

  const cancelBooking = async (data) => {
    const updatedAppointments = allAppointments.filter(
      (app) => app.id !== data.id
    );
    const updatedUser = { ...currentUser, appointments: updatedAppointments };

    try {
      await updateUser(currentUser.id, updatedUser);
      dispatch(fetchUsers());
      toast.success("Appointment cancelled successfully!");
      setSelectedBooking(null);
    } catch (error) {
      toast.error("Failed to cancel appointment. Please try again.");
    }
  };

  const sortedBookings = useMemo(() => {
    return [...(filteredBookings || [])].sort((a, b) => {
      return sortAsc
        ? a.slot.date.localeCompare(b.slot.date)
        : b.slot.date.localeCompare(a.slot.date);
    });
  }, [filteredBookings, sortAsc]);

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            My Appointments
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Manage your upcoming consultations and medical visits
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Filter Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <FaFilter className="text-blue-600" />
              <select
                value={filter.status}
                onChange={(e) =>
                  setFilter({ ...filter, status: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <FaCalendarAlt className="text-blue-600" />
              <input
                type="date"
                value={filter.date}
                onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => setFilter({ date: "", status: "" })}
              className="w-full md:w-auto px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition"
            >
              Clear Filters
            </button>

            <button
              onClick={() => setSortAsc((s) => !s)}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium flex items-center gap-2 transition"
            >
              Sort by Date {sortAsc ? <FiArrowUp /> : <FiArrowDown />}
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="grid grid-cols-1 gap-4">
          {sortedBookings?.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left Section */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    {app.doctor || "N/A"}
                  </h3>
                  <p className="text-blue-600">
                    {app.service || "General Consultation"}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        app.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : app.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {app.status}
                    </span>
                    <span className="text-gray-600">
                      {app.slot.date} • {app.slot.start} - {app.slot.end}
                    </span>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedBooking(app);
                      setIsOpen(true);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition"
                  >
                    <FaEye /> View
                  </button>

                  {app.status === "Pending" &&
                    app.slot.date !== todayFormatted && (
                      <button
                        onClick={() => cancelBooking(app)}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition"
                      >
                        <FaTrash /> Cancel
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedBookings?.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-blue-200 text-6xl mb-4">
              <FaCalendarAlt className="mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Appointments Found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or schedule a new appointment
            </p>
          </div>
        )}

        {/* Appointment Details Modal */}
        {isOpen && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
                <h3 className="text-2xl font-bold">Appointment Details</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:text-blue-200 transition"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">
                        Specialist
                      </label>
                      <p className="text-lg font-semibold">
                        {selectedBooking.service}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Doctor</label>
                      <p className="text-lg font-semibold">
                        {selectedBooking.doctor}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">
                        Date & Time
                      </label>
                      <p className="text-lg font-semibold">
                        {selectedBooking.slot.date} •{" "}
                        {selectedBooking.slot.start} -{" "}
                        {selectedBooking.slot.end}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Status</label>
                      <span
                        className={`px-3 py-1 rounded-full ${
                          selectedBooking.status === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : selectedBooking.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedBooking.status}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div>
                    <label className="text-sm text-gray-600">
                      Doctor's Notes
                    </label>
                    <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                      {selectedBooking.notes}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
