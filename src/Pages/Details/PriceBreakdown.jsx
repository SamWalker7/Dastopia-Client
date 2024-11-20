// PriceBreakdown.jsx
import React, { useState } from "react";
import PaymentDetailsModal from "./PaymentDetailsModal";

const PriceBreakdown = () => {
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  return (
    <div className=" flex items-center justify-center ">
      <div className="bg-[#0d1b3e] text-gray-300 shadow-lg p-8 rounded-3xl w-full max-w-xl">
        <h1 className="text-4xl text-white mb-8">Price Breakdown</h1>

        <div className="space-y-4">
          <div className="flex justify-between text-xl">
            <span>Daily Fee</span>
            <span>2,450 birr</span>
          </div>

          <div className="flex justify-between text-xl">
            <span>Rental days</span>
            <span>3 days</span>
          </div>

          <div className="h-px bg-white/20 my-4" />

          <div className="flex justify-between font-semibold text-white text-xl">
            <span>Total Cost</span>
            <span>5,395 Birr</span>
          </div>

          <div className="flex justify-between text-xl">
            <span>Basic Insurance Plan</span>
            <span>1,000 birr</span>
          </div>

          <div className="flex justify-between text-xl">
            <span>Legal contract Fee</span>
            <span>1,000 birr</span>
          </div>

          <div className="flex justify-between text-xl">
            <span>Registration Fee</span>
            <span>1,200 birr</span>
          </div>

          <div className="h-px bg-white/20 my-4" />

          <div className="flex justify-between text-xl font-semibold text-white">
            <span>Total cost</span>
            <span>$7,700 birr</span>
          </div>
        </div>

        <button
          onClick={() => setShowPaymentDetails(true)}
          className="w-full bg-white text-[#0d1b3e] text-xl font-medium py-4 rounded-full mt-8"
        >
          Pay Now
        </button>
      </div>

      {showPaymentDetails && (
        <PaymentDetailsModal onClose={() => setShowPaymentDetails(false)} />
      )}
    </div>
  );
};

export default PriceBreakdown;
