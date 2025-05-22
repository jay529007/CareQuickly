import React, { useEffect } from "react";
import { loadState } from "../../store/localstorage";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctor } from "../../functions/doctorSlice";
import {
  FiCalendar,
  FiUser,
  FiClock,
  FiStar,
  FiSettings,
  FiBell,
  FiArrowUpRight,
} from "react-icons/fi";
import { fetchUsers } from "../../functions/userSlice";
import { format } from "date-fns";

const DoctorHomePage = () => {
  const authdata = loadState();
  const doctorId = authdata.id;
  const dispatch = useDispatch();
  const doctors = useSelector((state) => state.doctors.doctors);
  const users = useSelector((state) => state.users.users);
  useEffect(() => {
    dispatch(fetchDoctor());
    dispatch(fetchUsers());
  }, [dispatch]);
  const today = format(new Date(), "yyyy-MM-dd");

  const currentDoctor = doctors?.find((doctor) => doctor.id === doctorId);

  if (!currentDoctor || !users || !Array.isArray(users)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Flatten all appointments across users
  const allAppointments = users?.flatMap((user) => user.appointments || []);

  // Filter appointments by current doctor
  const currentDoctorAppointments = allAppointments?.filter(
    (appointment) => appointment.doctor === currentDoctor?.name
  );

  // ------------------------------------ Total slots ------------------------------------
  const totalSlots = currentDoctorAppointments?.length || 0;

  // ------------------------------------ Total Patients ------------------------------------

  const patientnames = new Set();

  users.forEach((user) => {
    const hasToday = user.appointments?.some(
      (appt) => appt.doctor === currentDoctor?.name
      // && appt.slot.date === today
    );
    if (hasToday) patientnames.add(user?.name);
  });

  const totalPatientsToday = patientnames.size;
  console.log(currentDoctorAppointments);

  // ------------------------------- Upcoming appointments -------------------------------
  const now = new Date();

  // Filter only future appointments (start time after now)
  const upcomingAppointments = currentDoctorAppointments?.filter(
    (appointment) => {
      const appointmentDateTime = new Date(
        `${appointment.slot.date}T${appointment.slot.start}`
      );
      return appointmentDateTime >= now;
    }
  );

  // Optional: Sort upcoming appointments by date/time
  const sortedUpcomingAppointments = upcomingAppointments?.sort(
    (a, b) =>
      new Date(`${a.slot.date}T${a.slot.start}`) -
      new Date(`${b.slot.date}T${b.slot.start}`)
  );

  const upcomingCount = sortedUpcomingAppointments?.length || 0;

  //  data for demonstration
  const stats = [
    {
      title: "Upcoming Appointments",
      value: `${upcomingCount}`,
      icon: FiCalendar,
      color: "bg-blue-100",
      text: "text-blue-600",
    },
    {
      title: "Total Patients",
      value: `${totalPatientsToday}`,
      icon: FiUser,
      color: "bg-green-100",
      text: "text-green-600",
    },
    {
      title: "Availability",
      value: `${totalSlots} slots`,
      icon: FiClock,
      color: "bg-purple-100",
      text: "text-purple-600",
    },
    {
      title: "Average Rating",
      value: "4.8",
      icon: FiStar,
      color: "bg-yellow-100",
      text: "text-yellow-600",
    },
  ];

  const quickActions = [
    {
      title: "Update Profile",
      icon: FiUser,
      link: `/doctor/Profile/update/${doctorId}`,
    },
    {
      title: "Set Availability",
      icon: FiCalendar,
      link: "/doctor/availability",
    },
    { title: "View Appointments", icon: FiClock, link: "/doctor/appointments" },
    { title: "Notifications", icon: FiBell, link: "/doctor/notifications" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {currentDoctor?.name}
            </h1>
            <p className="text-gray-600">{currentDoctor?.specialty}</p>
          </div>
          {/* <div className="flex items-center space-x-4">
            <img
              src={currentDoctor?.image}
              alt={currentDoctor?.name}
              className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
            />
          </div> */}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
                <stat.icon
                  className={`w-12 h-12 p-3 rounded-full ${stat.color} ${stat.text}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Profile Overview
              </h2>
              <button className="text-blue-600 hover:text-blue-800 flex items-center">
                <FiSettings className="mr-2" /> Settings
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-gray-500 text-sm">Experience</p>
                  <p className="text-lg font-medium text-gray-800">
                    {currentDoctor?.experience}+ years
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm">Education</p>
                  <p className="text-lg font-medium text-gray-800">
                    {currentDoctor?.education}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-sm mb-2">About Me</p>
                <p className="text-gray-800">
                  {currentDoctor?.about ||
                    "Dedicated medical professional with extensive experience..."}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.link}
                  className="group flex items-center p-4 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <action.icon className={`w-6 h-6 mr-4 text-blue-600`} />
                  <span className="text-gray-800 group-hover:text-blue-600">
                    {action.title}
                  </span>
                  <FiArrowUpRight className="ml-auto text-gray-400 group-hover:text-blue-600" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Recent Appointments
          </h2>
          <div className="space-y-4">
            {currentDoctorAppointments ? (
              currentDoctorAppointments?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {patientnames || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item?.slot?.start || "N/A"} - {item?.slot?.end || "N/A"}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 bg-green-100  rounded-full text-sm ${
                      item.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Pending"
                        ? "bg-yellow-100  text-yellow-700"
                        : item.status === "Cancelled"
                        ? "bg-red-100  text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item?.status || "N/A"}
                  </span>
                </div>
              ))
            ) : (
              <p className="font-bold underline">No Recent Appointments</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorHomePage;
