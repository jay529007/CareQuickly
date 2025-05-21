import React from "react";

const Input = ({ label, type = "text", className = "", ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="inline-block mb-1 text-[#000000] pl-1">{label}</label>
      )}

      <input
        type={type}
        className={`w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-gray-400 ${className}`}
        ref={ref}
        {...props}
      />
    </div>
  );
};

export default React.forwardRef(Input);
