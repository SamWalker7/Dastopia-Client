import React, { useState } from "react";

const InputField = ({ label, placeholder }) => (
  <div className="w-full">
    <p className="text-gray-600 text-xl mb-2">{label}</p>
    <input
      type="text"
      placeholder={placeholder}
      className="w-full p-4 text-xl border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
    />
  </div>
);

const PaymentTypeModal = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]"
      onClick={onClose} // Close modal if overlay is clicked
    >
      <div
        className="bg-white rounded-3xl p-8 w-full max-w-xl m-4 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-3xl mb-8">Payment Type</h2>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <InputField label="First Name" placeholder="Enter your first name" />
          <InputField label="Last Name" placeholder="Enter your last name" />

          <div className="w-full">
            <p className="text-gray-600 text-xl mb-2">Payment Option</p>
            <div className="relative">
              <select className="w-full p-4 text-xl border border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-gray-400">
                <option>Weekly</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <InputField
            label="Phone Number"
            placeholder="Enter your mobile number"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Telebirr or Chapa</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-center">
                <img src="chapa-logo.png" alt="Chapa" className="h-8" />
              </div>
              <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-center">
                <img src="telebirr-logo.png" alt="Telebirr" className="h-8" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Card Payment</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#0d1b3e] text-white text-xl font-medium py-4 rounded-full mt-8"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentTypeModal;
