// PaymentDetailsModal.jsx
import React, { useState } from "react";
import PaymentTypeModal from "./PaymentTypeModal";

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

const PaymentDetailsModal = ({ onClose }) => {
  const [showPaymentType, setShowPaymentType] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-xl m-4 relative">
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
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

        <h2 className="text-3xl mb-8">Payment Details</h2>

        <div className="grid grid-cols-2 gap-6">
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

        <button
          onClick={() => setShowPaymentType(true)}
          className="w-full bg-[#0d1b3e] text-white text-xl font-medium py-4 rounded-full mt-8"
        >
          Choose Payment Method
        </button>

        {showPaymentType && (
          <PaymentTypeModal onClose={() => setShowPaymentType(false)} />
        )}
      </div>
    </div>
  );
};

export default PaymentDetailsModal;
