const CustomToolbar = ({ label, onNavigate, onView }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-2  items-center">
          <>
            <button
              className="px-3 py-2 bg-white border border-gray-300 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() => onNavigate("PREV")}
            >
              {/* < */}
              &lt;
              {/* Back */}
            </button>
            <h3 className="px-3 py-2 bg-gray-100 border border-gray-300 rounded">
              {label}
            </h3>
            <button
              className="px-3 py-2 bg-white border border-gray-300 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() => onNavigate("NEXT")}
            >
              {/* > */}
              &gt;
              {/* Next */}
            </button>
          </>
        </div>

        <div className="space-x-2">
          <button
            onClick={() => onView("month")}
            className="py-2 px-3 bg-white border border-gray-300 hover:bg-gray-100 rounded-md cursor-pointer"
          >
            Month
          </button>
          <button
            onClick={() => onView("week")}
            className="py-2 px-3 bg-white border border-gray-300 hover:bg-gray-100 rounded cursor-pointer"
          >
            Weeks
          </button>
          <button
            onClick={() => onView("day")}
            className="py-2 px-3 bg-white border border-gray-300 hover:bg-gray-100 rounded cursor-pointer"
          >
            Day
          </button>
        </div>
      </div>
    </>
  );
};
export default CustomToolbar;
