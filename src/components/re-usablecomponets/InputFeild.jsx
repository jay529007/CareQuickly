import React from "react";

const Input = ({ label, type = "text", className = "", ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="inline-block mb-1 text-[#000000] pl-1">{label}</label>
      )}

      <input
        type={type}
        className={`bg-white border border-[#CBD5E0] text-[#4A5568] text-sm rounded-lg focus:ring-1 focus:ring-[#3182CE] focus:border-[#3182CE] block w-full p-2.5 ${className}`}
        ref={ref}
        {...props}
      />
    </div>
  );
};

export default React.forwardRef(Input);
