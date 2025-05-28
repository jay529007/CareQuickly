import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctor } from "../../functions/doctorSlice";
import { useForm } from "react-hook-form";
import { updateDoctorSlot } from "../../functions/doctorAPI";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  HiPlus,
  HiUser,
  HiCalendar,
  HiClock,
  HiSearch,
  HiFilter,
  HiX,
  HiStatusOnline,
  HiPencilAlt,
  HiTrash,
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { fetchUsers } from "../../functions/userSlice";
import { FaEye } from "react-icons/fa";

const AdminHome = () => {
  // const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const dispatch = useDispatch();
  const doctors = useSelector((state) => state.doctors.doctors);
  const users = useSelector((state) => state.users.users);
  useEffect(() => {
    dispatch(fetchDoctor());
    dispatch(fetchUsers());
  }, [dispatch]);

  const allAppointments = users?.flatMap((user) => user.appointments || []);
  console.log(allAppointments);

  // const currentDoctorAppointments = allAppointments?.filter(
  // (appointment) => appointment.doctor === currentDoctor?.name
  // );

  const today = new Date().toISOString().split("T")[0];

  // Enhanced filtering and sorting
  const processedDoctors = doctors
    .filter((doctor) => {
      const matchesSearch = doctor.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesSpecialty =
        selectedSpecialty === "all" || doctor.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    })
    .sort((a, b) => {
      if (sortConfig.key === "experience") {
        return sortConfig.direction === "asc"
          ? a.experience - b.experience
          : b.experience - a.experience;
      }
      return sortConfig.direction === "asc"
        ? a[sortConfig.key]?.localeCompare(b[sortConfig.key])
        : b[sortConfig.key]?.localeCompare(a[sortConfig.key]);
    });

  const specialties = [...new Set(doctors.map((d) => d.specialty))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Doctor Management</h1>
            <p className="text-gray-300 mt-1">
              {doctors.length} registered professionals
            </p>
          </div>
          <div className="flex gap-4">
            {/* <button
              onClick={() => setIsSlotModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              <HiPlus className="text-xl" />
              Add Slot
            </button> */}
            <Link
              to="/admin/doctors/new"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
            >
              <HiPlus className="text-xl" />
              New Doctor
            </Link>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <HiSearch className="absolute left-3 top-3 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search doctors..."
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <HiFilter className="absolute left-3 top-3 text-gray-400 text-xl" />
            <select
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg bg-white"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="all">All Specialties</option>
              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">Sort by:</span>
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
              value={`${sortConfig.key}-${sortConfig.direction}`}
              onChange={(e) => {
                const [key, direction] = e.target.value.split("-");
                setSortConfig({ key, direction });
              }}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="experience-asc">Experience (Low-High)</option>
              <option value="experience-desc">Experience (High-Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="max-w-7xl mx-auto p-6">
        {processedDoctors.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {processedDoctors.map((doctor) => (
                <motion.div
                  key={doctor.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{doctor.name}</h3>
                      <p className="text-gray-500 text-sm">
                        {doctor.specialty}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        doctor.unavailableslots?.some((s) => s.date === today)
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {/* {doctor.unavailableslots[1]} */}
                      {doctor.unavailableslots?.some((s) => s.date === today)
                        ? "Busy"
                        : // : doctor.unavailableslots?.length >= 0
                          // ? "Unavailable"
                          "Available"}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <HiCalendar className="text-blue-500" />
                        <span>
                          {
                            allAppointments.filter(
                              (allappt) => allappt.doctor === doctor.name
                            ).length
                          }{" "}
                          slots
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <HiStatusOnline className="text-green-500" />
                        <span>{doctor.experience} yrs exp</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/admin/doctors/${doctor.id}`}
                        className="flex-1 flex items-center gap-2 justify-center px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                      >
                        <FaEye />
                        View
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                        <HiTrash />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-6xl text-gray-200 mb-4 flex justify-center">
              <HiUser className="w-24 h-24" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
