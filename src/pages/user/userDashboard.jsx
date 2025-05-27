import React, { useEffect, useMemo, useState } from "react";
import { loadState } from "../../store/localstorage";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../functions/userSlice";
import { updateUser } from "../../functions/userAPI";
import { toast } from "react-toastify";

const UserDashboard = () => {
  // fetchUsers
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

  // canceling booking
  const cancelBooking = async (data) => {
    const updatedAppointments = allAppointments.filter(
      (app) => app.id !== data.id
    );

    const updatedUser = {
      ...currentUser,
      appointments: updatedAppointments,
    };
    try {
      await updateUser(currentUser.id, updatedUser);
      dispatch(fetchUsers());
      toast.success("Appointments Booking cancelled successfully!");
      setSelectedBooking(null);
    } catch (error) {
      console.error("Cancel Appointments booking failed:", error);
      toast.error("Failed to cancel Appointments booking. Please try again.");
    }
  };

  const sortedBookings = useMemo(() => {
    return [...(filteredBookings || [])].sort((a, b) => {
      // ascending if sortAsc, else descending
      return sortAsc
        ? a.slot.date.localeCompare(b.slot.date)
        : b.slot.date.localeCompare(a.slot.date);
    });
  }, [filteredBookings, sortAsc]);
  const toggleSort = () => setSortAsc((s) => !s);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-blue-900">
              My Appointments
            </h2>
            <p className="text-blue-600 mt-1">
              Manage your upcoming consultations
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <div className="relative">
              <select
                value={filter.status}
                onChange={(e) =>
                  setFilter({ ...filter, status: e.target.value })
                }
                className="appearance-none bg-white pl-4 pr-10 py-2.5 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-800"
              >
                <option value="">All Status</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-700">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="relative">
              <input
                type="date"
                value={filter.date}
                className="bg-white pl-4 pr-10 py-2.5 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-800"
                onChange={(e) => setFilter({ ...filter, date: e.target.value })}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-700">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <button
              onClick={() => setFilter({ date: "", status: "" })}
              className="flex items-center justify-center px-4 py-2.5 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Clear
            </button>
          </div>
        </div>

        {/* Appointment Cards */}
        <div className="grid grid-cols-1 gap-4">
          {sortedBookings?.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
            >
              <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-semibold text-blue-900">
                      {app.doctor || "N/A"}
                    </h3>
                    <p className="text-blue-600">
                      {app.service || "General Consultation"}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        app.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : app.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : app.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {app.status || "N/A"}
                    </span>

                    <div className="hidden sm:block text-blue-700">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    <div className="text-blue-900 font-medium">
                      {app.slot.date} • {app.slot.start} - {app.slot.end}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => {
                      setSelectedBooking(app);
                      setIsOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Details
                  </button>

                  {app.status === "Pending" &&
                    app.slot.date !== todayFormatted && (
                      <button
                        onClick={() => cancelBooking(app)}
                        disabled={
                          app.status !== "Pending" ||
                          app.slot.date === todayFormatted
                        }
                        className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Cancel
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
            <div className="mx-auto w-24 h-24 text-blue-200">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-blue-900">
              No appointments found
            </h3>
            <p className="mt-1 text-blue-600">
              Try adjusting your filters or book a new appointment
            </p>
          </div>
        )}

        {/* Appointment Details Modal */}
        {isOpen && selectedBooking && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
              <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">
                  Appointment Details
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-blue-200 transition"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-blue-600">
                        Specialist
                      </p>
                      <p className="text-lg font-semibold text-blue-900">
                        {selectedBooking.service || "General Consultation"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-blue-600">
                        Doctor
                      </p>
                      <p className="text-lg font-semibold text-blue-900">
                        {selectedBooking.doctor || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-blue-600">
                        Status
                      </p>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          selectedBooking.status === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : selectedBooking.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedBooking.status || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Date</p>
                      <p className="text-lg text-blue-900">
                        {selectedBooking.slot.date}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-blue-600">Time</p>
                      <p className="text-lg text-blue-900">
                        {selectedBooking.slot.start} -{" "}
                        {selectedBooking.slot.end}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-blue-600">
                      Doctor's Notes
                    </p>
                    <div className="mt-2 p-4 bg-blue-50 rounded-lg text-blue-900">
                      {selectedBooking.notes}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
