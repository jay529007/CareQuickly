import {
  FiX,
  FiHome,
  FiUser,
  FiSettings,
  FiLock,
  FiCalendar,
  FiPlus,
  FiLogOut,
  FiActivity,
  FiHeart,
  FiShield,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { clearState, loadState } from "../store/localstorage";
import { toast } from "react-toastify";

const Slidbar = ({ setSlidebarOpen, type, id }) => {
  const navigate = useNavigate();

  const isUser = type === "user";
  const isAdmin = type === "admin";
  const isDoctor = type === "doctor";
  const Logout = () => {
    try {
      clearState();
      toast.success("Logged out successfully!");
      setSlidebarOpen(false);
      // setTimeout(() => window.location.reload(), 1000);
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
      console.error("Logout error:", error);
    }
  };

  const MenuItem = ({ to, text, icon: Icon, onClick }) => (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className="flex items-center p-3 space-x-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 group"
      >
        <Icon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
        <span className="font-medium">{text}</span>
      </Link>
    </li>
  );
  const SLidebarButton =
    "block px-3 py-2 rounded text-black cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-100 ";
  return (
    <>
      <div className="fixed inset-0 flex justify-end z-50">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Sidebar Panel */}
        <div className="relative bg-gradient-to-b from-white to-blue-50 w-80 h-full p-6 shadow-2xl transform transition-transform duration-300">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-lg">
                <FiActivity className="text-white w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Navigation</h2>
            </div>
            <button
              onClick={() => setSlidebarOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <FiX className="w-6 h-6 text-gray-600 hover:text-gray-800" />
            </button>
          </div>

          {/* Menu Items */}
          <ul className="space-y-2">
            {isUser && (
              <>
                <MenuItem
                  to="/"
                  text="Home"
                  icon={FiHome}
                  onClick={() => setSlidebarOpen(false)}
                />
                <MenuItem
                  to="/services"
                  text="Services"
                  icon={FiHeart}
                  onClick={() => setSlidebarOpen(false)}
                />
                <MenuItem
                  to="/doctors"
                  text="Doctors"
                  icon={FiUser}
                  onClick={() => setSlidebarOpen(false)}
                />
                <MenuItem
                  to="/appointment/details"
                  text="Appointments"
                  icon={FiCalendar}
                  onClick={() => setSlidebarOpen(false)}
                />
              </>
            )}

            {isDoctor && (
              <>
                <MenuItem
                  to="/doctor/dashboard"
                  text="Dashboard"
                  icon={FiHome}
                  onClick={() => setSlidebarOpen(false)}
                />
                <MenuItem
                  to="/doctor/appointments"
                  text="Appointments"
                  icon={FiCalendar}
                  onClick={() => setSlidebarOpen(false)}
                />
                <MenuItem
                  to={`/doctor/profile/${id}`}
                  text="Profile"
                  icon={FiUser}
                  onClick={() => setSlidebarOpen(false)}
                />
              </>
            )}

            {isAdmin && (
              <>
                <MenuItem
                  to="/patient/details"
                  text="Patients"
                  icon={FiUser}
                  onClick={() => setSlidebarOpen(false)}
                />
                <MenuItem
                  to="/admin/dashboard"
                  text="Dashboard"
                  icon={FiHome}
                  onClick={() => setSlidebarOpen(false)}
                />
              </>
            )}

            {(isUser || isAdmin || isDoctor) && (
              <MenuItem
                to="/account/change-password"
                text="Security"
                icon={FiLock}
                onClick={() => setSlidebarOpen(false)}
              />
            )}
          </ul>

          {/* Logout Button */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={Logout}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Slidbar;
