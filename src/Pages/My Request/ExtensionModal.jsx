// ExtensionModal.js
import React, { useState, useMemo } from "react";
import moment from "moment";
import { FaSpinner } from "react-icons/fa";

const ExtensionModal = ({
  isOpen,
  onClose,
  booking,
  onCheckAvailability,
  onRequestExtension,
  extensionData,
  isSubmitting,
}) => {
  // All hooks are called unconditionally at the top of the component.
  const [newEndDate, setNewEndDate] = useState("");

  const dailyRate = useMemo(() => {
    if (!booking || !booking.startDate || !booking.endDate || !booking.amount) {
      return 0;
    }
    const originalDuration =
      moment(booking.endDate).diff(moment(booking.startDate), "days") + 1;
    return originalDuration > 0
      ? parseFloat(booking.amount) / originalDuration
      : 0;
  }, [booking]);

  const { additionalDays, additionalAmount, isCheckDisabled } = useMemo(() => {
    if (!newEndDate || !dailyRate) {
      return {
        additionalDays: 0,
        additionalAmount: "0.00",
        isCheckDisabled: true,
      };
    }
    const currentEnd = moment(booking.endDate);
    const newEnd = moment(newEndDate);

    if (newEnd.isSameOrBefore(currentEnd)) {
      return {
        additionalDays: 0,
        additionalAmount: "0.00",
        isCheckDisabled: true,
      };
    }
    const days = newEnd.diff(currentEnd, "days");
    const amount = days * dailyRate;
    return {
      additionalDays: days,
      additionalAmount: amount.toFixed(2),
      isCheckDisabled: false,
    };
  }, [newEndDate, booking, dailyRate]);

  // Early return happens AFTER all hooks have been called.
  if (!isOpen) {
    return null;
  }

  if (!booking) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  const handleCheckClick = () => {
    onCheckAvailability(newEndDate, additionalDays, additionalAmount);
  };

  const handleRequestClick = () => {
    onRequestExtension(newEndDate, additionalDays, additionalAmount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
        <h2 className="text-xl font-bold text-[#00113D] mb-4">
          Request Rental Extension
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current End Date
            </label>
            <input
              type="text"
              readOnly
              value={moment(booking.endDate).format("MMMM DD, YYYY")}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="new-end-date"
              className="block text-sm font-medium text-gray-700"
            >
              New End Date
            </label>
            <input
              type="date"
              id="new-end-date"
              value={newEndDate}
              min={moment(booking.endDate).add(1, "days").format("YYYY-MM-DD")}
              onChange={(e) => setNewEndDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleCheckClick}
            disabled={isCheckDisabled || extensionData.availabilityLoading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 focus:outline-none"
          >
            {extensionData.availabilityLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Checking...
              </>
            ) : (
              "Check Availability"
            )}
          </button>

          {extensionData.availabilityError && (
            <p className="text-sm text-red-600 text-center">
              {extensionData.availabilityError}
            </p>
          )}
        </div>

        {extensionData.isAvailable === true && (
          <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-400">
            <h3 className="text-lg font-semibold text-green-800">
              Vehicle is Available!
            </h3>
            <div className="mt-2 space-y-1 text-sm text-green-700">
              <p>
                <strong>Additional Days:</strong> {additionalDays}
              </p>
              <p>
                <strong>Estimated Additional Cost:</strong> {additionalAmount}{" "}
                ETB
              </p>
            </div>
            <button
              onClick={handleRequestClick}
              disabled={isSubmitting}
              className="mt-4 w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300 focus:outline-none"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Submitting...
                </>
              ) : (
                "Submit Extension Request"
              )}
            </button>
          </div>
        )}

        {extensionData.isAvailable === false && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400">
            <h3 className="text-lg font-semibold text-red-800">
              Not Available
            </h3>
            <p className="text-sm text-red-700">
              The vehicle is not available for the selected dates. Please try
              another date.
            </p>
          </div>
        )}

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            aria-label="Close"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtensionModal;
