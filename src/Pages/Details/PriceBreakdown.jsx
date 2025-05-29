import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// A simple Popup Notification Component (remains the same, for errors)
const PopupNotification = ({ message, type, visible, onClose }) => {
  useEffect(() => {
    let timer;
    if (visible) {
      timer = setTimeout(() => {
        onClose();
      }, 3000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [visible, onClose]);

  if (!visible) return null;

  const baseStyle =
    "fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl text-white text-sm z-50 transition-all duration-300 ease-in-out";
  const typeStyle =
    type === "success" // Should not be used by PaymentDetailsModal for success anymore
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-gray-700";

  return (
    <div className={`${baseStyle} ${typeStyle}`}>
      {message}
      <button onClick={onClose} className="ml-4 font-bold">
        ×
      </button>
    </div>
  );
};

const PaymentDetailsModal = ({
  totalPrice,
  id, // carId
  ownerId,
  dropOffTime,
  pickUpTime,
  pickUpLocation,
  dropOffLocation,
  onClose,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({
    // For error popups
    visible: false,
    message: "",
    type: "",
  });
  const [viewMode, setViewMode] = useState("details"); // 'details' or 'success'
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const customer = JSON.parse(localStorage.getItem("customer"));
  const USER_ID =
    customer?.userAttributes?.find((attr) => attr.Name === "sub")?.Value || "";

  // Effect to handle auto-navigation after success view is shown
  useEffect(() => {
    let redirectTimer;
    if (viewMode === "success") {
      redirectTimer = setTimeout(() => {
        handleProceedAfterSuccess();
      }, 3200); // Auto-proceed after 3.2 seconds
    }
    return () => clearTimeout(redirectTimer);
  }, [viewMode]); // Only re-run if viewMode changes

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const showErrorPopup = (message) => {
    setPopup({ visible: true, message, type: "error" });
  };

  const closeErrorPopup = () => {
    setPopup({ visible: false, message: "", type: "" });
  };

  const handleProceedAfterSuccess = () => {
    onClose(); // Close the modal
    navigate("/"); // Navigate to the homepage
  };

  const handleApproveBooking = async () => {
    if (!pickUpLocation || !dropOffLocation) {
      showErrorPopup("Pickup and Dropoff locations are required.");
      return;
    }
    if (!USER_ID) {
      showErrorPopup("User not identified. Please log in again.");
      return;
    }
    if (!customer || !customer.AccessToken) {
      showErrorPopup("Authentication error. Please log in again.");
      return;
    }

    setIsLoading(true);
    try {
      const pickUpArray = Array.isArray(pickUpLocation)
        ? pickUpLocation
        : [pickUpLocation];
      const dropOffArray = Array.isArray(dropOffLocation)
        ? dropOffLocation
        : [dropOffLocation];

      const bookingResponse = await fetch(
        "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${customer.AccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ownerId: ownerId,
            renteeId: USER_ID,
            carId: id,
            startDate: pickUpTime,
            endDate: dropOffTime,
            price: totalPrice.toString(),
            pickUp: pickUpArray,
            dropOff: dropOffArray,
          }),
        }
      );

      if (bookingResponse.ok) {
        const bookingData = await bookingResponse.json();
        console.log("Booking created successfully", bookingData);
        setSuccessMessage("Booking successful! Redirecting to homepage...");
        setViewMode("success"); // Switch to success view
        // setIsLoading(false); // Keep loading true to disable original modal interaction
        // until navigation or modal closure
      } else {
        const errorData = await bookingResponse.json().catch(() => ({
          message: "Failed to create booking. Server returned an error.",
        }));
        console.error(
          "Failed to create booking",
          bookingResponse.status,
          errorData
        );
        showErrorPopup(
          `Booking failed: ${errorData.message || bookingResponse.statusText}`
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      showErrorPopup(`Booking failed: ${error.message || "Network error"}`);
      setIsLoading(false);
    }
    // No finally setIsLoading(false) here as success view handles UI state
  };

  const renderDetailsView = () => (
    <>
      <div className="flex items-center w-full mb-2">
        <button
          onClick={!isLoading ? onClose : undefined}
          className="text-xl font-semibold text-black mr-3 disabled:opacity-50"
          disabled={isLoading}
        >
          {"←"}
        </button>
        <h2 className="text-lg font-semibold text-black">Booking Details</h2>
      </div>
      <h1 className="text-lg md:text-xl font-bold text-black">
        Terms and Conditions
      </h1>
      <h2 className="text-base md:text-lg font-semibold text-black">
        Renting a Car
      </h2>
      <p className="text-sm text-gray-600">
        Please read and accept the terms and conditions before confirming your
        booking.
      </p>
      <div className="text-sm text-black leading-relaxed overflow-y-auto max-h-[35vh] pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <h3 className="font-semibold text-black mb-2">General Terms</h3>
        <ol className="list-decimal pl-5 text-gray-700 space-y-1">
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
            that occurs during the rental period. Report any issues immediately.
          </li>
        </ol>
        <h3 className="font-semibold text-black mt-3 mb-2">Payment Terms</h3>
        <ol className="list-decimal pl-5 text-gray-700 space-y-1">
          <li>
            Charges: The rental fee includes the daily rate, any additional
            mileage charges, and applicable taxes.
          </li>
          <li>
            Security Deposit: A security deposit may be held and refunded upon
            safe return of the vehicle.
          </li>
          <li>
            Payment Method: Payments are processed via our integrated payment
            gateway.
          </li>
        </ol>
        <h3 className="font-semibold text-black mt-3 mb-2">
          Insurance and Liability
        </h3>
        <ol className="list-decimal pl-5 text-gray-700 space-y-1">
          <li>
            Insurance: Basic insurance coverage is included. Additional options
            may be available.
          </li>
          <li>
            Accidents: In the event of an accident, contact local authorities
            and inform the car owner immediately.
          </li>
          <li>
            Damages: Any damages not covered by insurance may be your
            responsibility.
          </li>
        </ol>
      </div>
      <div className="flex items-center mt-3">
        <input
          type="checkbox"
          id="acceptTerms"
          checked={isChecked}
          onChange={handleCheckboxChange}
          disabled={isLoading}
          className="w-4 h-4 mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="acceptTerms" className="text-sm font-medium text-black">
          I accept the terms and conditions
        </label>
      </div>
      <button
        onClick={handleApproveBooking}
        className={`w-full py-2.5 mt-3 text-white text-sm font-medium rounded-full transition-colors duration-150 ${
          isChecked && !isLoading
            ? "bg-blue-950 hover:bg-blue-900"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={!isChecked || isLoading}
      >
        {isLoading ? "Processing..." : "Book Now"}
      </button>
    </>
  );

  const renderSuccessView = () => (
    <div className="flex flex-col items-center justify-center text-center h-full p-4">
      <svg
        className="mx-auto mb-4 w-16 h-16 text-green-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
        Success!
      </h3>
      <p className="text-gray-600 text-sm md:text-base mb-6">
        {successMessage}
      </p>
      <button
        onClick={handleProceedAfterSuccess}
        className="bg-blue-950 hover:bg-blue-900 text-white font-semibold py-2.5 px-8 rounded-lg transition-colors text-sm md:text-base"
      >
        OK
      </button>
    </div>
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-50 z-20"
        onClick={viewMode === "details" && !isLoading ? onClose : undefined} // Only allow close from backdrop in details view and not loading
      ></div>
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-start p-6 gap-4 w-11/12 md:w-2/4 lg:w-1/3 ${
          viewMode === "success"
            ? "max-h-[50vh] justify-center"
            : "max-h-[85vh]"
        } bg-white rounded-lg shadow-xl`}
      >
        {viewMode === "details" && renderDetailsView()}
        {viewMode === "success" && renderSuccessView()}
      </div>
      <PopupNotification
        message={popup.message}
        type={popup.type}
        visible={popup.visible}
        onClose={closeErrorPopup}
      />
    </>
  );
};

// The PriceBreakdown component remains the same
export default function PriceBreakdown({
  days,
  dailyPrice,
  totalPrice,
  id,
  ownerId,
  dropOffTime,
  pickUpTime,
  pickUpLocation,
  dropOffLocation,
}) {
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  const handleRequestBooking = () => {
    if (!pickUpLocation || !dropOffLocation) {
      alert(
        "Please ensure pickup and dropoff locations are selected for the car before booking."
      );
      return;
    }
    setShowPaymentDetails(true);
  };

  const canRequestBooking =
    pickUpLocation &&
    dropOffLocation &&
    id &&
    ownerId &&
    pickUpTime &&
    dropOffTime;

  return (
    <div className="flex items-center justify-center ">
      <div className="bg-[#0d1b3e] text-gray-300 shadow-lg p-6 rounded-2xl w-full max-w-md">
        <h1 className="text-xl md:text-2xl text-white mb-4">Price Breakdown</h1>
        <div className="space-y-3">
          <div className="flex justify-between text-xs md:text-sm">
            <span>Daily Fee</span>
            <span>{dailyPrice} birr</span>
          </div>
          <div className="flex justify-between text-xs md:text-sm">
            <span>Rental days</span>
            <span>{days} days</span>
          </div>
          <div className="flex justify-between text-xs md:text-sm">
            <span>Service Fee</span>
            <span>0 birr</span>
          </div>
          <div className="h-px bg-white/20 my-3" />
          <div className="flex justify-between text-sm font-semibold text-white">
            <span>Total cost</span>
            <span>{totalPrice} birr</span>
          </div>
        </div>
        <button
          onClick={handleRequestBooking}
          disabled={!canRequestBooking}
          className={`w-full text-[#0d1b3e] font-medium py-2 text-xs md:text-sm rounded-full mt-6 transition-colors duration-150 ${
            canRequestBooking
              ? "bg-white hover:bg-gray-200"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
        {!canRequestBooking && (
          <p className="text-red-300 text-xs text-center mt-2">
            Booking details incomplete. Please ensure all car information is
            available.
          </p>
        )}
      </div>
      {showPaymentDetails && canRequestBooking && (
        <PaymentDetailsModal
          totalPrice={totalPrice}
          id={id}
          ownerId={ownerId}
          dropOffTime={dropOffTime}
          pickUpTime={pickUpTime}
          pickUpLocation={pickUpLocation}
          dropOffLocation={dropOffLocation}
          onClose={() => setShowPaymentDetails(false)}
        />
      )}
    </div>
  );
}
