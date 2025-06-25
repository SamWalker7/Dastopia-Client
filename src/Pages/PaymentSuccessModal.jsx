import React from "react";
import { useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

const PaymentSuccessModal = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 relative">
        {/* Close Icon */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            Payment Successful
          </h2>
          <p className="text-gray-700 mb-6">
            Your payment has been completed successfully.
          </p>

          <button
            onClick={handleClose}
            className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
