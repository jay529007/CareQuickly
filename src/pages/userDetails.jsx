import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../functions/userSlice";
import PaginatedAppointmentTable from "../components/pagginationtable";
import Input from "../components/re-usablecomponets/InputFeild";
import { generateCSV, downloadCSV } from "../functions/exportAppointments";
import { updateUser } from "../functions/userAPI";
import { useNavigate } from "react-router-dom";

const UserDetails = () => {
  const [filter, setFilter] = useState({ user: "", date: "", status: "" });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [userStatus, setUserStatus] = useState(selectedBooking?.status);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // fetching appointment
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users?.users);
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const allAppointments = users.flatMap(
    (user) =>
      user.appointments?.map((appointment) => ({
        ...appointment,
        name: user.name,
        userEmail: user.email,
        userId: user.id,
      })) || []
  );

  // user Appointment status
  useEffect(() => {
    if (selectedBooking?.status) {
      setUserStatus(selectedBooking.status);
    }
  }, [selectedBooking]);

  const handleStatusChange = (e) => {
    setUserStatus(e.target.value);
  };
  useEffect(() => {
    // find the full user object from Redux
    const user = users.find((u) => u.id === selectedBooking?.userId);
    if (!user) return;

    // produce a brand‑new appointments array
    const updatedAppointments = user.appointments.map((apt) =>
      apt.id === selectedBooking?.id ? { ...apt, status: userStatus } : apt
    );
    console.log(updatedAppointments);
    if (!selectedBooking) return;

    const doUpdate = async () => {
      // 1) send the PUT and wait for it
      await updateUser(selectedBooking.userId, {
        ...user,
        appointments: updatedAppointments,
      });
      // 2) now that the server is updated, re‑fetch your users
      dispatch(fetchUsers());
    };

    doUpdate();
  }, [userStatus]);

  // filters
  const filteredallAppointments = allAppointments.filter(
    (apt) =>
      (!filter.name ||
        apt.name.toLowerCase().includes(filter.name.toLowerCase())) &&
      (!filter.date || apt.slot?.date === filter.date) &&
      (!filter.status || apt.status === filter.status)
  );
  return (
    <div className="p-6">
      <div className="flex justify-between pr-2">
        <h1 className="text-3xl font-bold mb-6">User Details</h1>
        <div>
          <button
            onClick={() => {
              const csv = generateCSV(users);
              downloadCSV(csv);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1   md:grid-cols-4 gap-4 mb-6">
        {/* Search by user */}
        <div className=" relative">
          <Input
            type="text"
            placeholder="Search by user"
            value={filter.name}
            className="w-full py-3 pr-10 pl-4 rounded-lg shadow-sm"
            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
          />
          {filter.name && (
            <button
              className="absolute right-2.5 bottom-2.5 text-gray-600 hover:text-black text-sm bg-gray-200 rounded px-2 py-0.5"
              onClick={() => setFilter((prev) => ({ ...prev, name: "" }))}
            >
              ✕
            </button>
          )}
        </div>

        {/* Date filter */}
        <Input
          type="date"
          value={filter.date}
          className="w-full py-3 px-4 rounded-lg text-gray-500 shadow-sm"
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
        />

        {/* Status filter */}
        <select
          value={filter.status}
          className="w-full pl-4 border my-0.5 text-gray-500 border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option className="text-black" value="">
            All Status
          </option>
          <option className="text-black" value="Confirmed">
            Confirmed
          </option>
          <option className="text-black" value="Pending">
            Pending
          </option>
          <option className="text-black" value="Cancelled">
            Cancelled
          </option>
        </select>

        {/* Reset Button */}
        <button
          onClick={() => setFilter({ name: "", date: "", status: "" })}
          className="w-[25%] h-[80%] my-1 bg-red-500 text-white hover:text-black rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Clean
        </button>
      </div>
      {/* Booking Table */}
      <div className="">
        {filteredallAppointments.length > 0 ? (
          <PaginatedAppointmentTable
            appointments={filteredallAppointments}
            setSelectedBooking={setSelectedBooking}
            setIsOpen={setIsOpen}
          />
        ) : (
          <p className="text-center p-4 bg-white rounded">No bookings found</p>
        )}
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
                    {selectedBooking.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg font-semibold">
                    {selectedBooking.userEmail || "N/A"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Specialist
                  </p>
                  <p className="text-lg font-semibold">
                    {selectedBooking.service || "N/A"}
                  </p>
                  <br />
                  <p className="text-sm font-medium mb-1 text-gray-500">
                    Status
                  </p>

                  <span
                    className={`text-sm font-bold inline-block  rounded-full ${
                      userStatus === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : userStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : userStatus === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-white"
                    }`}
                  >
                    {/* {selectedBooking.status || "N/A"} */}
                    <select
                      className="px-2 py-2 "
                      onChange={handleStatusChange}
                      // value={selectedBooking.status || "N/A"}
                      value={userStatus || "N/A"}
                    >
                      <option
                        className="px-2 border my-3 text-red-600"
                        value="Cancelled"
                      >
                        Cancelled
                      </option>
                      <option
                        className="px-2 border my-3 text-yellow-500"
                        value="Pending"
                      >
                        Pending
                      </option>
                      <option
                        className="px-2 border my-3 text-green-600"
                        value="Confirmed"
                      >
                        Confirmed
                      </option>
                    </select>
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Doctor</p>
                  <p className="text-lg font-semibold">
                    {selectedBooking.doctor || "N/A"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-lg">
                    {selectedBooking.slot.date || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Time</p>
                  <p className="text-lg">
                    {selectedBooking.slot.start || "N/A"} -{" "}
                    {selectedBooking.slot.end || "N/A"}
                  </p>
                </div>
              </div>
              {selectedBooking.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <p className="text-base">{selectedBooking.notes || "N/A"}</p>
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

export default UserDetails;
