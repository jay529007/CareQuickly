import { FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

const Slidbar = ({ setSlidebarOpen }) => {
  const SLidebarButton =
    "block px-3 py-2 rounded text-black cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-100 ";
  return (
    <>
      <div className="fixed inset-0 flex justify-end z-50">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Sidebar Panel */}
        <div className="relative bg-white w-64 h-full p-4 shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button
              onClick={() => setSlidebarOpen(false)}
              aria-label="Close sidebar"
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FiX size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Menu Items */}
          <ul className="space-y-4">
            <li>
              <Link
                to="/home"
                onClick={() => setSlidebarOpen(false)}
                className={SLidebarButton}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setSlidebarOpen(false)}
                to="/appointment/calendar"
                className={SLidebarButton}
              >
                Appointments
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setSlidebarOpen(false)}
                to="/appointment/details"
                className={SLidebarButton}
              >
                Appointment Details
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                onClick={() => setSlidebarOpen(false)}
                className={SLidebarButton}
              >
                Profile
              </Link>
            </li>
          </ul>

          {/* Footer Button */}
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={() => setSlidebarOpen(false)}
              className="w-full py-2 text-center bg-gray-100 duration-150 text-black hover:text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Slidbar;
