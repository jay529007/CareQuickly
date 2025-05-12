import React from "react";

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="p-3 rounded-full bg-gray-50">{icon}</div>
    </div>
  </div>
);

export default StatCard;
