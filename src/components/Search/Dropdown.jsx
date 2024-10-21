import React, { useState } from "react";

const Dropdown = ({ label, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block my-3 text-lg w-full ">
      {/* Label inside box */}
      <label className="absolute -top-2 left-3 text-sm bg-white px-1  text-gray-500">
        {label}
      </label>
      <div className="border  border-gray-400 rounded-md bg-white">
        <button
          onClick={toggleDropdown}
          className="flex justify-between w-full p-3 py-4 bg-white text-gray-500 rounded-md hover:bg-gray-100 focus:outline focus:outline-1 focus:outline-blue-400 "
        >
          <span className="">{selectedOption || "Select your car type"}</span>
          {/* Arrow icon */}
          <svg
            className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 010-1.06z" />
          </svg>
        </button>
        {/* Dropdown options */}
        {isOpen && (
          <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md max-h-60 overflow-y-auto z-10">
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleOptionClick(option)}
                className="p-2  text-gray-700 hover:bg-gray-200 cursor-pointer"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
