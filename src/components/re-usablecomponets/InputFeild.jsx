import React from "react";

const Input = ({ label, type = "text", className = "", ...props }, ref) => {
  return (
    <div className="w-full">
      {label ? (
        <label className="inline-block mb-1 text-black pl-1">{label}</label>
      ) : (
        ""
      )}

      <input
        type={type}
        className={`w-full px-4 py-2 mt-1 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
        ref={ref}
        {...props}
      />
    </div>
  );
};

export default React.forwardRef(Input);
