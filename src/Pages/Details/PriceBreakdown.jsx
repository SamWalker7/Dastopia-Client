import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchReferral } from "../../api";

// A simple Popup Notification Component (remains the same)
const PopupNotification = ({ message, type, visible, onClose }) => {
  useEffect(() => {
    let timer;
    if (visible) {
      timer = setTimeout(() => {
        onClose();
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  if (!visible) return null;

  const baseStyle =
    "fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl text-white text-sm z-50 transition-all duration-300 ease-in-out";
  const typeStyle = type === "error" ? "bg-red-500" : "bg-gray-700";

  return (
    <div className={`${baseStyle} ${typeStyle}`}>
      {message}
      <button onClick={onClose} className="ml-4 font-bold">
        ×
      </button>
    </div>
  );
};

// PaymentDetailsModal updated to handle the new API structure
const PaymentDetailsModal = ({
  price,
  subtotal,
  days,
  id,
  ownerId,
  owenerId,
  dropOffTime,
  pickUpTime,
  pickUpLocation,
  dropOffLocation,
  driverProvided,
  onClose,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });
  const [viewMode, setViewMode] = useState("details");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const customer = JSON.parse(localStorage.getItem("customer"));
  const USER_ID =
    customer?.userAttributes?.find((attr) => attr.Name === "sub")?.Value || "";

  const handleCheckboxChange = (event) => setIsChecked(event.target.checked);
  const showErrorPopup = (message) =>
    setPopup({ visible: true, message, type: "error" });
  const closeErrorPopup = () =>
    setPopup({ visible: false, message: "", type: "" });

  const handleApproveBooking = async () => {
    if (!pickUpLocation || !dropOffLocation) {
      showErrorPopup("Pickup and Dropoff locations are required.");
      return;
    }
    if (!USER_ID || !customer?.AccessToken) {
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
      const key = ownerId ? "ownerId" : "owenerId";

      const requestBody = {
        [key]: ownerId || owenerId,
        renteeId: USER_ID,
        carId: id,
        startDate: pickUpTime,
        endDate: dropOffTime,
        // rentalDays: days,
        pickUp: pickUpArray,
        dropOff: dropOffArray,
        selectedServiceType: driverProvided ? "with-driver" : "self-drive",
        // --- FIX: Convert price and finalPrice numbers to strings to match API requirements ---
        finalPrice: String(subtotal),
        price: String(price),
        cancelUrl: "https://app.example.com/cancel",
        returnUrl: "https://app.example.com/return",
      };

      const bookingResponse = await fetch(
        "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${customer.AccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const responseData = await bookingResponse.json();

      if (bookingResponse.ok) {
        const checkoutUrl = responseData?.body?.checkoutUrl;
        if (checkoutUrl) {
          setSuccessMessage("Redirecting to secure payment page...");
          setViewMode("success");
          window.location.href = checkoutUrl;
        } else {
          console.error(
            "Booking created, but checkout URL is missing.",
            responseData
          );
          showErrorPopup(
            "Booking created, but payment failed. Please contact support."
          );
          setIsLoading(false);
        }
      } else {
        const errorMessage =
          responseData?.body?.message ||
          responseData?.message ||
          "An unknown error occurred.";
        showErrorPopup(`Booking failed: ${errorMessage}`);
        setIsLoading(false);
      }
    } catch (error) {
      showErrorPopup(
        `Booking request failed: ${error.message || "Network error"}`
      );
      setIsLoading(false);
    }
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
            confirmation.
          </li>
          <li>
            Usage: The vehicle is to be used for personal use only and not for
            commercial purposes.
          </li>
          <li>
            Responsibility: You are responsible for the vehicle and any damage
            that occurs.
          </li>
        </ol>
        <h3 className="font-semibold text-black mt-3 mb-2">Payment Terms</h3>
        <ol className="list-decimal pl-5 text-gray-700 space-y-1">
          <li>
            Charges: The rental fee includes the daily rate and applicable
            taxes.
          </li>
          <li>
            Security Deposit: A security deposit may be held and refunded upon
            safe return.
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
          <li>Insurance: Basic insurance coverage is included.</li>
          <li>
            Accidents: In the event of an accident, contact local authorities
            and inform the owner.
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
        className={`w-full py-2.5 mt-3 text-white text-sm font-medium rounded-full transition-colors duration-150 ${isChecked && !isLoading
          ? "bg-blue-950 hover:bg-blue-900"
          : "bg-gray-400 cursor-not-allowed"
          }`}
        disabled={!isChecked || isLoading}
      >
        {isLoading ? "Processing..." : "Confirm Booking"}
      </button>
    </>
  );

  const renderSuccessView = () => (
    <div className="flex flex-col items-center justify-center text-center h-full p-4">
      <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
        Booking Confirmed!
      </h3>
      <p className="text-gray-600 text-sm md:text-base">{successMessage}</p>
    </div>
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-50 z-20"
        onClick={viewMode === "details" && !isLoading ? onClose : undefined}
      ></div>
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-start p-6 gap-4 w-11/12 md:w-2/4 lg:w-1/3 ${viewMode === "success"
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

// PriceBreakdown Component (with 1-day minimum logic)
export default function PriceBreakdown({
  days,
  selfDriveDailyPrice,
  driverDailyPrice,
  serviceOption,
  id,
  ownerId,
  owenerId,
  dropOffTime,
  pickUpTime,
  pickUpLocation,
  dropOffLocation,
}) {
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    const getReferralCode = async () => {
      const code = await fetchReferral();
      setReferralCode(code);
    };

    getReferralCode();
  }, []);

  const {
    carRentalPrice,
    driverServicePrice,
    subtotal,
    serviceFee,
    turnoverTax,
    finalTotalPrice,
    effectiveDays,
  } = useMemo(() => {
    // Enforce a minimum of 1 day for all calculations.
    const effectiveDays = Math.max(days || 0, 1);

    const carPrice = effectiveDays * (selfDriveDailyPrice || 0);
    const driverPrice =
      serviceOption === "with-driver"
        ? effectiveDays * (driverDailyPrice || 0)
        : 0;

    const totalRental = carPrice + driverPrice;
    const service = totalRental * 0.1;
    const sub = totalRental + service;
    const tax = sub * 0.1;
    const finalTotal = sub + tax;

    return {
      carRentalPrice: carPrice,
      driverServicePrice: driverPrice,
      subtotal: sub,
      serviceFee: service,
      turnoverTax: tax,
      finalTotalPrice: finalTotal,
      effectiveDays: effectiveDays,
    };
  }, [days, selfDriveDailyPrice, driverDailyPrice, serviceOption]);

  const handleRequestBooking = () => {
    if (!pickUpLocation || !dropOffLocation) {
      alert(
        "Please ensure pickup and dropoff locations are selected before booking."
      );
      return;
    }
    setShowPaymentDetails(true);
  };

  const canRequestBooking =
    pickUpLocation && dropOffLocation && id && (ownerId || owenerId);

  return (
    <div className="flex items-center justify-center">
      <div className="bg-[#0d1b3e] text-gray-300 shadow-lg p-6 rounded-2xl w-full max-w-md">
        <h1 className="text-xl md:text-2xl text-white mb-2">Price Breakdown</h1>

        <div
          className={`text-center py-1 px-3 text-xs font-semibold rounded-full mb-4 inline-block ${serviceOption === "with-driver"
            ? "bg-green-500 text-white"
            : "bg-blue-500 text-white"
            }`}
        >
          Service:{" "}
          {serviceOption === "with-driver" ? "With Driver" : "Self-Drive"}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs md:text-sm">
            <span>Car Rental Fee (x{effectiveDays} days)</span>
            <span>{carRentalPrice.toFixed(2)} birr</span>
          </div>

          {serviceOption === "with-driver" && (
            <div className="flex justify-between text-xs md:text-sm">
              <span>Driver Service Fee (x{effectiveDays} days)</span>
              <span>{driverServicePrice.toFixed(2)} birr</span>
            </div>
          )}

          <div className="flex justify-between text-xs md:text-sm">
            <span>Service Fee</span>
            <span>{serviceFee.toFixed(2)} birr</span>
          </div>
          <div className="flex justify-between text-xs md:text-sm">
            <span>Sub Total</span>
            <span>{subtotal.toFixed(2)} birr</span>
          </div>
          <div className="flex justify-between text-xs md:text-sm">
            <span>Tax</span>
            <span>{turnoverTax.toFixed(2)} birr</span>
          </div>
          <div className="flex justify-between text-xs md:text-sm">
            <span>Referral Code</span>
            <span>{referralCode}</span>
          </div>
          <div className="h-px bg-white/20 my-3" />
          <div className="flex justify-between text-sm font-semibold text-white">
            <span>Total cost</span>
            <span>{finalTotalPrice.toFixed(2)} birr</span>
          </div>
        </div>

        <button
          onClick={handleRequestBooking}
          disabled={!canRequestBooking}
          className={`w-full text-[#0d1b3e] font-medium py-2 text-xs md:text-sm rounded-full mt-4 transition-colors duration-150 ${canRequestBooking
            ? "bg-white hover:bg-gray-200"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Continue
        </button>
        {!canRequestBooking && (
          <p className="text-red-300 text-xs text-center mt-2">
            Booking details incomplete. Please select dates and locations.
          </p>
        )}
      </div>
      {showPaymentDetails && canRequestBooking && (
        <PaymentDetailsModal
          price={finalTotalPrice}
          subtotal={subtotal}
          days={effectiveDays}
          id={id}
          ownerId={ownerId}
          owenerId={owenerId}
          dropOffTime={dropOffTime}
          pickUpTime={pickUpTime}
          pickUpLocation={pickUpLocation}
          dropOffLocation={dropOffLocation}
          driverProvided={serviceOption === "with-driver"}
          onClose={() => setShowPaymentDetails(false)}
        />
      )}
    </div>
  );
}
