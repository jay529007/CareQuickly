import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiPhone,
  FiMail,
  FiUser,
  FiHome,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";
import { loadState } from "../../store/localstorage";
import { fetchDoctor } from "../../functions/doctorSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../functions/userSlice";
import StatCard from "../../components/StartedCards";

const DoctorAppointments = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filter, setFilter] = useState("Upcoming");
  const [newNote, setNewNote] = useState("");
  const dispatch = useDispatch();

  //   ---------------------------- Filtering Current Doctor ----------------------------
  const authdata = loadState();
  const doctorId = authdata.id;

  const doctors = useSelector((doctor) => doctor.doctors.doctors);
  useEffect(() => {
    dispatch(fetchDoctor());
  }, []);
  const currentDoctor = doctors?.find((doctors) => doctors.id === doctorId);

  //   ---------------------------- Filtering Appointments ----------------------------
  const users = useSelector((user) => user.users.users);
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);
  // const currentDoctorName = "Dr. Rohan Mehta"
  //   ---------------------------- Filtering Appointments ----------------------------
  // Process and filter appointments
  const filteredAppointments = users
    .flatMap((patient) =>
      patient.appointments
        .filter((appt) => appt.doctor === currentDoctor?.name)
        .map((appt) => ({
          ...appt,
          patient,
          datetime: new Date(`${appt.slot.date}T${appt.slot.start}`),
        }))
    )
    .filter((appt) => {
      const now = new Date();
      if (filter === "Upcoming") return appt.datetime >= now;
      if (filter === "past") return appt.datetime < now;
      if (filter === "cancelled") return appt.status === "Cancelled";
      return true;
    })
    .sort((a, b) => a.datetime - b.datetime);

  //   ---------------------------- onClick handleAddNote ----------------------------
  const handleAddNote = () => {
    // In a real app, you would update the appointment in your state/backend here
    setSelectedAppointment((prev) => ({
      ...prev,
      notes: newNote,
    }));
    setNewNote("");
  };

  //   ---------------------------- onClick handleCancelAppointment ----------------------------
  const handleCancelAppointment = (appointmentId) => {
    // In a real app, you would update the status in your state/backend here
    console.log("Cancelling appointment:", appointmentId);
    closeModal();
  };

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
  };

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Appointment Dashboard
            </h1>
            <p className="text-gray-600">
              {`${filter} appointments for ${currentDoctor?.name}`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {["Upcoming", "past", "cancelled", "all"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                  filter === f
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Appointments"
            value={filteredAppointments.length}
            icon={<FiCalendar className="text-blue-500" />}
          />

          <StatCard
            title="Upcoming"
            value={
              filteredAppointments.filter(
                (a) => a.status === "Confirmed" && a.datetime >= new Date()
              ).length
            }
            icon={<FiClock className="text-green-500" />}
          />
          <StatCard
            title="Cancelled"
            value={
              filteredAppointments.filter((a) => a.status === "Cancelled")
                .length
            }
            icon={<FiX className="text-red-500" />}
          />
          <StatCard
            title="Completed"
            value={
              filteredAppointments.filter(
                (a) => a.status === "Confirmed" && a.datetime < new Date()
              ).length
            }
            icon={<FiUser className="text-purple-500" />}
          />
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <TableHeader>Date & Time</TableHeader>
                  <TableHeader>Patient</TableHeader>
                  <TableHeader>Service</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">
                          {appointment.datetime.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <FiClock className="mr-1" size={14} />
                          {appointment.slot.start} - {appointment.slot.end}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                            {appointment.patient.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium">
                              {appointment.patient.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {`${appointment.patient.gender},${calculateAge(
                                appointment.patient.dob
                              )}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {appointment.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : appointment.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : appointment.status === "Completed" &&
                                "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => openModal(appointment)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No {filter} appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Appointment Detail Modal */}
        {selectedAppointment && (
          <AppointmentModal
            appointment={selectedAppointment}
            onClose={closeModal}
            newNote={newNote}
            onNoteChange={setNewNote}
            onAddNote={handleAddNote}
            onCancel={() => handleCancelAppointment(selectedAppointment.id)}
          />
        )}
      </div>
    </>
  );
};

const TableHeader = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const AppointmentModal = ({
  appointment,
  onClose,
  newNote,
  onNoteChange,
  onAddNote,
  onCancel,
}) => {
  const { patient, service, status, slot, notes } = appointment;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {patient.name}
              </h2>
              <p className="text-gray-600 flex items-center">
                <FiUser className="mr-1" size={16} />
                {patient.gender}, {calculateAge(patient.dob)} years
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Patient Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b flex items-center">
                <FiUser className="mr-2" /> Patient Information
              </h3>

              <InfoItem icon={<FiMail />} label="Email" value={patient.email} />
              <InfoItem
                icon={<FiPhone />}
                label="Phone"
                value={patient.number}
              />
              <InfoItem
                icon={<FiHome />}
                label="Address"
                value={patient.address}
              />
              <InfoItem
                icon={<FiUser />}
                label="Emergency Contact"
                value={`${patient.emergency_contact.name} (${patient.emergency_contact.phone})`}
              />
              <InfoItem
                icon={<FiAlertTriangle />}
                label="Medical History"
                value={patient.medical_history || "None recorded"}
              />
            </div>

            {/* Appointment Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b flex items-center">
                <FiCalendar className="mr-2" /> Appointment Details
              </h3>

              <InfoItem
                icon={<FiCalendar />}
                label="Date"
                value={new Date(
                  `${slot.date}T${slot.start}`
                ).toLocaleDateString()}
              />
              <InfoItem
                icon={<FiClock />}
                label="Time"
                value={`${slot.start} - ${slot.end}`}
              />
              <InfoItem icon={<FiUser />} label="specialty" value={service} />
              <InfoItem
                icon={<FiAlertTriangle />}
                label="Status"
                value={status}
              />

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor Notes
                </label>
                <p className="text-gray-800 mb-2 bg-gray-50 p-3 rounded">
                  {notes || "No notes available"}
                </p>

                <div className="mt-4">
                  <label
                    htmlFor="newNote"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Add New Note
                  </label>
                  <textarea
                    id="newNote"
                    rows={3}
                    value={newNote}
                    onChange={(e) => onNoteChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your notes here..."
                  />
                  <button
                    onClick={onAddNote}
                    disabled={!newNote.trim()}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t flex justify-end space-x-3">
            {status === "Confirmed" && (
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
              >
                Cancel Appointment
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="mb-4">
    <div className="flex items-center text-sm text-gray-500 mb-1">
      <span className="mr-2">{icon}</span>
      {label}
    </div>
    <div className="text-gray-800 font-medium pl-6">
      {typeof value === "string" || typeof value === "number" ? value : value}
    </div>
  </div>
);

// Helper function to calculate age from DOB
function calculateAge(dob) {
  const age = new Date().getFullYear() - new Date(dob).getFullYear();
  return age;
}

export default DoctorAppointments;
