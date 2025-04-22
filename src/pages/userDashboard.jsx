import React, { useState } from "react";

const dummyAppointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Connor",
    date: "2025-04-25",
    time: "10:00 AM",
    status: "Confirmed",
    notes: "General checkup",
  },
  {
    id: 2,
    doctor: "Dr. Alan Grant",
    date: "2025-04-28",
    time: "03:30 PM",
    status: "Pending",
    notes: "Follow-up",
  },
  {
    id: 3,
    doctor: "Dr. Ellie Sattler",
    date: "2025-05-01",
    time: "01:00 PM",
    status: "Cancelled",
    notes: "Consultation",
  },
];

const UserDashboard = () => {
  const [filter, setFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const filteredAppointments = dummyAppointments.filter((app) => {
    return filter === "" || app.status.toLowerCase() === filter.toLowerCase();
  });

  const cancelBooking = (id) => {
    alert(`Booking with ID ${id} cancelled.`);
    // Update state or trigger API here
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-4">My Appointments</h2>

      <div className="mb-4 flex gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded shadow"
        >
          <option value="">All Status</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white shadow rounded p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">Doctor</th>
              <th className="border-b p-2">Date</th>
              <th className="border-b p-2">Time</th>
              <th className="border-b p-2">Status</th>
              <th className="border-b p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="p-2">{app.doctor}</td>
                <td className="p-2">{app.date}</td>
                <td className="p-2">{app.time}</td>
                <td className="p-2">{app.status}</td>
                <td className="p-2 space-x-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                    onClick={() => {
                      setSelectedBooking(app);
                      setIsOpen(true);
                    }}
                  >
                    View
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                    onClick={() => cancelBooking(app.id)}
                    disabled={
                      app.status !== "Confirmed" && app.status !== "Pending"
                    }
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDashboard;
