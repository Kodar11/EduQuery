import React,{ useState } from "react";

const Input = ({ placeholder, value, onChange, className = "" }) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-lg border border-green-200 bg-white/90 backdrop-blur-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all duration-300 shadow-sm hover:shadow-md ${className}`}
      />
      <div className="absolute inset-0 rounded-lg pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
    </div>
  );
};

export default Input;
