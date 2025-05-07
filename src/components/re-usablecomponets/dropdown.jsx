import React from "react";

const Dropdown = ({ label, className = "", options = [], ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="inline-block mb-1 text-black pl-1">{label}</label>
      )}

      <select
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-1 focus:ring-black focus:border-black block w-full p-2.5 ${className}`}
        ref={ref}
        {...props}
      >
        {options.map(({ value, label }, index) => (
          <option key={index} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default React.forwardRef(Dropdown);
