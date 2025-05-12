import React from "react";
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

const AppointmentModal = ({
  appointment,
  onClose,
  newNote,
  onNoteChange,
  onAddNote,
  onCancel,
  calculateAge,
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
            <div className="p-2 bg-gradient-to-b from-white to-white/80">
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <FiX
                  size={24}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                />
              </button>
            </div>
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
                value={patient.number || "N/A"}
              />
              <InfoItem
                icon={<FiHome />}
                label="Address"
                value={patient.address || "N/A"}
              />
              <InfoItem
                icon={<FiAlertTriangle />}
                label="Medical History"
                value={patient.medical_history || "N/A"}
              />
              <div className="space-y-4">
                {/* Emergency Contect Inforamation */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Emergency Contact Name
                    </label>
                    <p className="text-gray-800 font-medium">
                      {patient.emergency_contact.name || (
                        <span className="text-gray-400">Not provided</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Contact Number
                    </label>
                    <p className="text-gray-800 font-medium">
                      {patient.emergency_contact.phone || (
                        <span className="text-gray-400">Not provided</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
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
                  `${slot.date || "N/A"}T${slot.start || "N/A"}`
                ).toLocaleDateString()}
              />
              <InfoItem
                icon={<FiClock />}
                label="Time"
                value={`${slot.start || "N/A"} - ${slot.end || "N/A"}`}
              />
              <InfoItem
                icon={<FiUser />}
                label="specialty"
                value={service || "N/A"}
              />
              <InfoItem
                icon={<FiAlertTriangle />}
                label="Status"
                value={status || "N/A"}
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
          {status === "" && (
            <div className="mt-8 pt-6 border-t flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
              >
                Cancel Appointment
              </button>
              {/* <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
              Close
              </button> */}
            </div>
          )}
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

export default AppointmentModal;
