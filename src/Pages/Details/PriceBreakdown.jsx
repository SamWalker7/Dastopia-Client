import React, { useState } from "react";

const PaymentDetailsModal = ({ onClose }) => {
  const [isChecked, setIsChecked] = useState(false);
  // const [approved, setApproved] = useState(true); // Visibility is controlled by PriceBreakdown
  // const [handleRedirect, setHandleRedirect] = useState(() => {}); // Assuming handleRedirect is passed as a prop or defined in the parent

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  // Assuming handleRedirect is defined in the parent component and you might need to pass it down or handle the logic there
  const handleRedirect = () => {
    console.log("Redirecting after approval");
    // Add your redirection logic here
  };

  return (
    <div>
      {/* Overlay background */}
      <div
        className="fixed inset-0 bg-black opacity-50 z-20"
        onClick={onClose}
      ></div>
      {/* Modal content */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-start p-6 gap-4 w-11/12 md:w-2/4 lg:w-1/3 max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="flex items-center w-full mb-4">
          <button
            onClick={onClose}
            className="text-base font-semibold text-black mr-2"
          >
            {"←"}
          </button>
          <h2 className="text-base font-semibold text-black">
            Booking Details
          </h2>
        </div>

        {/* Title */}
        <h1 className="text-base md:text-lg font-bold text-black">
          Terms and Conditions
        </h1>
        <h2 className="text-base md:text-lg font-semibold text-black">
          Renting a Car
        </h2>
        <p className="text-sm md:text-sm text-gray-600">
          Please read and accept the terms and conditions before confirming your
          booking.
        </p>

        {/* Terms Content */}
        <div className="text-sm md:text-sm text-black leading-relaxed overflow-y-auto max-h-[40vh]">
          <h3 className="font-semibold text-black mb-2">General Terms</h3>
          <ol className="list-decimal pl-6 text-gray-700">
            <li>
              Eligibility: You must be at least 21 years old and hold a valid
              driver's license.
            </li>
            <li>
              Rental Period: The rental period is defined in the booking
              confirmation. Early returns will not be refunded.
            </li>
            <li>
              Usage: The vehicle is to be used for personal use only and not for
              commercial purposes.
            </li>
            <li>
              Responsibility: You are responsible for the vehicle and any damage
              that occurs during the rental period. Report any issues
              immediately.
            </li>
          </ol>

          <h3 className="font-semibold text-black mt-4 mb-2">Payment Terms</h3>
          <ol className="list-decimal pl-6 text-gray-700">
            <li>
              Charges: The rental fee includes the daily rate, any additional
              mileage charges, and applicable taxes.
            </li>
            <li>
              Security Deposit: A security deposit will be held on your credit
              card and refunded upon safe return of the vehicle.
            </li>
            <li>
              Payment Method: Payments are processed via our integrated payment
              gateway. No cash payments are accepted.
            </li>
          </ol>

          <h3 className="font-semibold text-black mt-4 mb-2">
            Insurance and Liability
          </h3>
          <ol className="list-decimal pl-6 text-gray-700">
            <li>
              Insurance: Basic insurance coverage is included in your rental
              fee. Additional insurance options are available.
            </li>
            <li>
              Accidents: In the event of an accident, contact local authorities
              and inform the car owner immediately.
            </li>
            <li>
              Damages: Any damages not covered by insurance will be deducted
              from the security deposit. Excessive damage may incur additional
              charges.
            </li>
          </ol>
        </div>

        {/* Checkbox */}
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="w-4 h-4 mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="acceptTerms"
            className="text-sm md:text-sm font-medium text-black"
          >
            I accept the terms and conditions
          </label>
        </div>

        {/* Approve Button */}
        <button
          onClick={() => {
            onClose();
            handleRedirect();
          }}
          className={`w-full py-1 md:py-2 mt-2 text-white text-sm md:text-sm rounded-full ${
            isChecked
              ? "bg-blue-950 hover:bg-blue-900"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isChecked}
        >
          Approve Booking
        </button>
      </div>
    </div>
  );
};

const PriceBreakdown = () => {
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-[#0d1b3e] text-gray-300 shadow-lg p-6 rounded-2xl w-full max-w-md">
        <h1 className="text-xl md:text-2xl text-white mb-4">Price Breakdown</h1>

        <div className="space-y-3">
          <div className="flex justify-between text-xs md:text-sm">
            <span>Daily Fee</span>
            <span>2,450 birr</span>
          </div>

          <div className="flex justify-between text-xs md:text-sm">
            <span>Rental days</span>
            <span>3 days</span>
          </div>

          <div className="h-px bg-white/20 my-3" />

          <div className="flex justify-between font-semibold text-white text-xs md:text-sm">
            <span>Total Cost</span>
            <span>5,395 Birr</span>
          </div>

          <div className="flex justify-between text-xs md:text-sm">
            <span>Basic Insurance Plan</span>
            <span>1,000 birr</span>
          </div>

          <div className="flex justify-between text-xs md:text-sm">
            <span>Legal contract Fee</span>
            <span>1,000 birr</span>
          </div>

          <div className="flex justify-between text-xs md:text-sm">
            <span>Registration Fee</span>
            <span>1,200 birr</span>
          </div>

          <div className="h-px bg-white/20 my-3" />

          <div className="flex justify-between text-sm font-semibold text-white">
            <span>Total cost</span>
            <span>$7,700 birr</span>
          </div>
        </div>

        <button
          onClick={() => setShowPaymentDetails(true)}
          className="w-full bg-white text-[#0d1b3e] font-medium py-2 text-xs md:text-sm rounded-full mt-6"
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
