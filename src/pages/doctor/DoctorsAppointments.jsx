import { useEffect, useState } from "react";
import { FiCalendar, FiClock, FiUser, FiX } from "react-icons/fi";
import { loadState } from "../../store/localstorage";
import { fetchDoctor } from "../../functions/doctorSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../functions/userSlice";
import StatCard from "../../components/StartedCards";
import AppointmentModal from "../../components/AppointmentModel";

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

  const calculateAge = (dob) => {
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    return age;
  };
  const tableHeadclass =
    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
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
                  <th className={tableHeadclass}>Date & Time</th>
                  <th className={tableHeadclass}>Patient</th>
                  <th className={tableHeadclass}>Service</th>
                  <th className={tableHeadclass}>Status</th>
                  <th className={tableHeadclass}>Actions</th>
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
            calculateAge={calculateAge}
          />
        )}
      </div>
    </>
  );
};

export default DoctorAppointments;
