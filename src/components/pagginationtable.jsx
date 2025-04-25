import React, { useState } from "react";

const PaginatedAppointmentTable = ({
  appointments,
  setSelectedBooking,
  setIsOpen,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(appointments.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = appointments.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="relative max-w-full  overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full table-auto border border-gray-200">
        <thead className="bg-gray-100 text-gray-700 text-sm font-semibold sticky top-0 z-10">
          <tr>
            <th className="p-3 text-center">User</th>
            <th className="p-3 text-center">Date</th>
            <th className="p-3 text-center">Service</th>
            <th className="p-3 text-center">Time</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">View</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-800">
          {currentRows.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 border-t transition">
              <td className="p-3 text-center">{user.name || "N/A"}</td>
              <td className="p-3 text-center">{user.slot?.date || "N/A"}</td>
              <td className="p-3 text-center">{user.service}</td>
              <td className="p-3 text-center">
                {user.slot?.start || "N/A"} - {user.slot?.end || "N/A"}
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

      {/* Pagination Controls */}
      <div className="flex py-3 justify-center items-center gap-4 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="text-sm">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginatedAppointmentTable;
