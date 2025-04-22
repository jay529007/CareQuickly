import React, {useState} from "react";

const AdminHome = () => {
  const [filter, setFilter] = useState({ user: "", date: "", status: "" });
  const [blockedSlots, setBlockedSlots] = useState(["10:00", "15:30"]);
  const [slots, setSlots] = useState(["09:00", "10:00", "11:30", "13:00", "15:30", "17:00"]);

  const bookings = [
    { id: 1, user: "Jay", date: "2025-04-22", time: "10:00", status: "Confirmed" },
    { id: 2, user: "Aarav", date: "2025-04-22", time: "15:30", status: "Pending" },
    { id: 3, user: "Pooja", date: "2025-04-23", time: "09:00", status: "Cancelled" },
  ];

  const filteredBookings = bookings.filter(
    (b) =>
      (!filter.user || b.user.toLowerCase().includes(filter.user.toLowerCase())) &&
      (!filter.date || b.date === filter.date) &&
      (!filter.status || b.status === filter.status)
  );

  const toggleBlockSlot = (time) => {
    setBlockedSlots((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  return (
    <>
      <div className="min-h-screen p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by user"
            className="p-2 border rounded"
            onChange={(e) => setFilter({ ...filter, user: e.target.value })}
          />
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
        </div>

        {/* Booking Table */}
        <div className="bg-indigo-200 p-4 rounded shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">All Bookings</h2>
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-white">
                <th className="p-2">ID</th>
                <th className="p-2">User</th>
                <th className="p-2">Date</th>
                <th className="p-2">Time</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id} className="bg-white border-t">
                  <td className="p-2">{b.id}</td>
                  <td className="p-2">{b.user}</td>
                  <td className="p-2">{b.date}</td>
                  <td className="p-2">{b.time}</td>
                  <td className="p-2">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Slot Management */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Manage Time Slots</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {slots.map((slot) => (
              <button
                key={slot}
                onClick={() => toggleBlockSlot(slot)}
                className={`p-2 rounded text-sm font-medium border ${
                  blockedSlots.includes(slot)
                    ? "bg-red-100 text-red-600 border-red-400"
                    : "bg-green-100 text-green-600 border-green-400"
                }`}
              >
                {slot} -{" "}
                {blockedSlots.includes(slot) ? "Unavailable" : "Available"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
