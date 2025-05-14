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
    <div className="max-h-screen px-[15%]  p-6">
      <h2 className="text-3xl text-gray-800 font-bold mb-4">My Appointments</h2>
      <div className="flex my-2  gap-3">
        <div className="">
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="px-4 py-2 border rounded shadow"
          >
            <option value="">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <input
            type="date"
            value={filter.date}
            className="p-2 border rounded"
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          />
        </div>
        <button
          onClick={() => setFilter({ date: "", status: "" })}
          className=" py-2 px-4 border bg-red-500 text-white hover:text-black rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Clean
        </button>
      </div>
      <div className="flex items-center mb-2"></div>
      <div className="overflow-x-auto  shadow rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-sky-200 text-gray-800">
            <tr>
              <th className=" py-3 px-6">Doctor</th>
              <th
                className=" py-3 px-6 cursor-pointer select-none"
                onClick={toggleSort}
              >
                Date
                {/* <span className="ml-2 inline-block bg-blue-300 px-1 rounded-2xl text-xs font-bold transition-transform">
                  {sortAsc ? "↑" : "↓"}
                </span> */}
              </th>
              <th className=" py-3 px-6">Time</th>
              <th className=" py-3 px-6">Status</th>
              <th className=" py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-center">
            {sortedBookings?.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50 border-b">
                <td className="py-3 px-6">{app.doctor || "N/A"}</td>
                <td className="py-3 px-6">{app.slot.date || "N/A"}</td>
                <td className="py-3 px-6">
                  {app.slot.start || "N/A"} - {app.slot.end || "N/A"}
                </td>

                <td
                  className={`text-sm py-1.5 px-2 my-3 font-bold inline-block  rounded-full ${
                    app.status === "Confirmed"
                      ? "bg-green-100 text-green-700"
                      : app.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : app.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-white"
                  }`}
                >
                  {app.status || "N/A"}
                </td>

                <td className="py-3 px-6 space-x-2">
                  <button
                    className={`px-3 py-1 bg-blue-600 text-white rounded ${
                      app.status !== "Pending" ||
                      app.slot.date === todayFormatted
                        ? "w-[50%]"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedBooking(app);
                      setIsOpen(true);
                    }}
                  >
                    View
                  </button>
                  {app.status === "Pending" &&
                    app.slot.date !== todayFormatted && (
                      <button
                        onClick={() => cancelBooking(app)}
                        disabled={
                          app.status !== "Pending" ||
                          app.slot.date === todayFormatted
                        }
                        className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50 "
                      >
                        Cancel
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                  <p className="text-sm font-medium text-gray-500">
                    Spacialist
                  </p>
                  <p className="text-lg font-semibold">
                    {selectedBooking.service || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Doctor</p>
                  <p className="text-lg font-semibold">
                    {selectedBooking.doctor || "N/A"}
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
                    {selectedBooking.status || "N/A"}
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
  );
};

export default UserDashboard;
