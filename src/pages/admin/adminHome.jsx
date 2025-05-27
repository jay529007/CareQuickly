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

const AdminHome = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const dispatch = useDispatch();
  const doctors = useSelector((state) => state.doctors.doctors);

  useEffect(() => {
    dispatch(fetchDoctor());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
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

  const handleSlotSubmit = async (data) => {
    try {
      const newSlot = { date: data.date, start: data.start, end: data.end };
      const updatedDoctor = {
        ...selectedDoctor,
        availableslots: [...(selectedDoctor.availableslots || []), newSlot],
      };

      await updateDoctorSlot(selectedDoctor.id, updatedDoctor);
      toast.success("Slot added successfully");
      reset();
      dispatch(fetchDoctor());
      setIsSlotModalOpen(false);
    } catch (error) {
      toast.error("Failed to add slot");
    }
  };

  const SortIndicator = ({ column }) => (
    <span className="ml-2">
      {sortConfig.key === column &&
        (sortConfig.direction === "asc" ? "↑" : "↓")}
    </span>
  );

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
                      {doctor.unavailableslots?.some((s) => s.date === today)
                        ? "Busy"
                        : "Available"}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <HiCalendar className="text-blue-500" />
                        <span>{doctor.availableslots?.length || 0} slots</span>
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
                        <HiPencilAlt />
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

      {/* Add Slot Modal */}
      <AnimatePresence>
        {isSlotModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Add Time Slot</h3>
                <button
                  onClick={() => setIsSlotModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HiX className="text-xl" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit(handleSlotSubmit)}
                className="p-4 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    onChange={(e) =>
                      setSelectedDoctor(
                        doctors.find((d) => d.id === e.target.value)
                      )
                    }
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} ({doctor.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <div className="relative">
                      <HiCalendar className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="date"
                        className="pl-10 w-full px-4 py-2 border border-gray-200 rounded-lg"
                        {...register("date", { required: "Date is required" })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Range
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <HiClock className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="time"
                          className="pl-10 w-full px-4 py-2 border border-gray-200 rounded-lg"
                          {...register("start", {
                            required: "Start time required",
                          })}
                        />
                      </div>
                      <div className="relative flex-1">
                        <HiClock className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="time"
                          className="pl-10 w-full px-4 py-2 border border-gray-200 rounded-lg"
                          {...register("end", {
                            required: "End time required",
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium flex items-center justify-center gap-2"
                  >
                    <HiPlus className="text-lg" />
                    Confirm Slot
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminHome;
