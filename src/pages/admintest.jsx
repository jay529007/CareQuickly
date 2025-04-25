import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../functions/userSlice";

const AdminHome = () => {
  const [filter, setFilter] = useState({ user: "", date: "", status: "" });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [blockedSlots, setBlockedSlots] = useState(["10:00", "15:30"]);
  const [slots, setSlots] = useState({
    start: ["10:00", "11:00", "12:00", "13:00"],
    end: ["11:00", "12:00", "13:00", "14:00"],
  });

  // fetching appointment
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users?.users);
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const allAppointments = users.flatMap(
    (user) =>
      user.appointments?.map((appointment) => ({
        ...appointment,
        name: user.name,
        userEmail: user.email,
        userId: user.id,
      })) || []
  );

  const filteredallAppointments = allAppointments.filter(
    (apt) =>
      (!filter.name ||
        apt.name.toLowerCase().includes(filter.name.toLowerCase())) &&
      (!filter.date || apt.slot?.date === filter.date) &&
      (!filter.status || apt.status === filter.status)
  );

  return (
    <>
      <div className="min-h-[100dvh] h-fit p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by user"
              className="block w-full p-4 border rounded"
              onChange={(e) => setFilter({ ...filter, name: e.target.value })}
            />
            <button
              type="submit"
              className="text-black absolute end-2.5 bottom-2.5 bg-gray-300/50  font-medium rounded-lg text-sm px-2 py-1 "
              onClick={() => window.location.reload()}
              //   onClick={(e) => {
              // setFilter({ ...filter, name: "" });
              //   }}
            >
              ✕
            </button>
          </div>
          <input
            type="date"
            className="p-2 border rounded"
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          />
          <select
            className="p-2 border rounded"
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button></button>
        </div>

        {/* Booking Table */}
        <div className="bg-indigo-200 p-4 rounded shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">All Bookings</h2>
          {filteredallAppointments.length > 0 ? (
            <table className="w-full table-auto border border-gray-200 shadow-sm rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
                <tr>
                  <th className="p-3 text-center">User</th>
                  <th className="p-3 text-center">Date</th>
                  <th className="p-3 text-center">Service</th>
                  <th className="p-3 text-center">Time</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">View</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 text-sm">
                {filteredallAppointments.map((user) => (
                  <tr
                    key={user.id}
                    className="bg-white border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3 text-center">{user.name || "N/A"}</td>
                    <td className="p-3 text-center">
                      {user.slot?.date || "N/A"}
                    </td>
                    <td className="p-3 text-center">{user.service}</td>
                    <td className="p-3 text-center">
                      {user.slot.start || "N/A"} - {user.slot.end || "N/A"}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full font-medium text-xs ${
                          user.status === "Confirmed"
                            ? "bg-green-100 text-green-700"
                            : user.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : user.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.status || "N/A"}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        onClick={() => {
                          setSelectedBooking(user);
                          setIsOpen(true);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center p-4 bg-white rounded">
              No bookings found
            </p>
          )}
        </div>

        {/* Slot Management */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Manage Time Slots</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"></div>
        </div>
        {/* Selected Appoinment Details */}
        {isOpen && selectedBooking && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-gray-800">
                  Appointment Details
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-red-500 transition"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-lg font-semibold">
                      {selectedBooking.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg font-semibold">
                      {selectedBooking.userEmail}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Doctor</p>
                    <p className="text-lg font-semibold">
                      {selectedBooking.service}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span
                      className={`text-sm font-bold inline-block px-3 py-1 rounded-full ${
                        selectedBooking.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : selectedBooking.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="text-lg">{selectedBooking.slot.date}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Time</p>
                    <p className="text-lg">
                      {selectedBooking.slot.start} - {selectedBooking.slot.end}
                    </p>
                  </div>
                </div>
                {selectedBooking.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Notes</p>
                    <p className="text-base">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminHome;
