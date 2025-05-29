import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaCogs,
  FaGasPump,
  FaTag,
  FaUserFriends,
  FaCheckCircle, // For success popup
} from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import useVehicleFormStore from "../../store/useVehicleFormStore";

const SuccessPopup = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl text-center max-w-md w-full">
      <FaCheckCircle className="text-green-500 text-5xl sm:text-6xl mx-auto mb-4 sm:mb-6" />
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
        Vehicle Submitted Successfully!
      </h2>
      <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">
        Your vehicle listing has been submitted and it will go live after
        review.
      </p>
      <button
        onClick={onClose}
        className="bg-navy-900 hover:bg-navy-800 text-white font-medium py-2.5 px-6 rounded-lg text-sm sm:text-base w-full sm:w-auto transition-colors"
      >
        Done
      </button>
    </div>
  </div>
);

const Step5 = (/* { prevStep } */) => {
  // prevStep is no longer needed
  const { vehicleData, uploadedPhotos, resetStore } = useVehicleFormStore();
  const [showSuccessPopup, setShowSuccessPopup] = useState(true); // Show popup on mount

  // Get all uploaded images (base64 for display)
  const getAllImages = () => {
    const mainImages = [
      uploadedPhotos.front,
      uploadedPhotos.back,
      uploadedPhotos.left,
      uploadedPhotos.right,
      uploadedPhotos.interior,
    ].filter((img) => img !== null && img.base64); // Ensure img and base64 exist

    const additionalImages = uploadedPhotos.additional.filter(
      (img) => img !== null && img.base64
    );

    return [...mainImages, ...additionalImages];
  };

  const allImages = getAllImages();
  const [selectedImage, setSelectedImage] = useState(
    allImages[0]?.base64 || "/default-car.jpg" // Default if no images
  );

  useEffect(() => {
    // Update selectedImage if allImages changes and selectedImage is no longer valid
    if (
      allImages.length > 0 &&
      !allImages.find((img) => img.base64 === selectedImage)
    ) {
      setSelectedImage(allImages[0].base64);
    } else if (allImages.length === 0 && selectedImage !== "/default-car.jpg") {
      setSelectedImage("/default-car.jpg");
    }
  }, [allImages, selectedImage]);

  // Helper function to format ISO date strings
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    // Check if date is valid, and specifically if it's not the Unix epoch (which can indicate an error or empty date)
    if (isNaN(date.getTime()) || date.getTime() === 0) return "Invalid date";
    return date.toLocaleDateString(undefined, {
      // undefined for locale uses browser default
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Reset store on component unmount (when user navigates away from this success page)
  useEffect(() => {
    return () => {
      console.log("Step5 unmounting, resetting store...");
      resetStore();
    };
  }, [resetStore]);

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    // Optionally, navigate to a dashboard or listings page here
    // e.g., history.push('/dashboard');
  };

  // Price from vehicleData, ensure it's a string for display.
  // The store already handles making it a string for submission if it's a number.
  const displayPrice =
    vehicleData.price !== null && vehicleData.price !== undefined
      ? String(vehicleData.price)
      : "0";

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 bg-[#F8F8FF] min-h-screen p-4 sm:p-6 lg:p-8">
      {showSuccessPopup && <SuccessPopup onClose={handleClosePopup} />}

      {/* Main Content Area */}
      <div className="w-full lg:w-8/12 xl:w-9/12 bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-12 text-sm sm:text-base">
        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-full border-b-4 border-[#00113D]"></div>
        </div>
        <div className="flex justify-between w-full mb-4 sm:mb-6">
          <p className="text-lg sm:text-xl text-gray-800 font-medium">
            Step 5 of 5
          </p>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold mt-4 sm:mt-6 mb-6 sm:mb-8">
          Summary
        </h1>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Image Gallery */}
          <div className="w-full md:w-5/12 lg:w-4/12">
            <img
              src={selectedImage}
              alt={`${vehicleData.make || "Vehicle"} ${
                vehicleData.model || ""
              }`}
              className="w-full aspect-[4/3] object-cover rounded-lg mb-3 sm:mb-4 shadow-md"
            />
            {allImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {allImages.map((img, index) => (
                  <img
                    key={img.key || `thumb-${index}`} // Use S3 key if available, else index
                    src={img.base64}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => setSelectedImage(img.base64)}
                    className={`w-full aspect-square cursor-pointer object-cover rounded-md hover:opacity-80 transition-opacity
                                ${
                                  selectedImage === img.base64
                                    ? "ring-2 ring-navy-700"
                                    : "ring-1 ring-gray-300"
                                }`}
                  />
                ))}
              </div>
            )}
            {allImages.length === 0 && (
              <p className="text-gray-500 text-center">No images uploaded.</p>
            )}
          </div>

          {/* Vehicle Details */}
          <div className="w-full md:w-7/12 lg:w-8/12">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
              {vehicleData.make || "N/A"} {vehicleData.model || "N/A"}
            </h3>
            <p className="text-gray-500 mb-4 text-xs sm:text-sm">
              Model Year: {vehicleData.year || "N/A"}
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-2 items-center mb-6 sm:mb-8 text-gray-700 text-xs sm:text-sm">
              <div className="bg-blue-100 flex items-center text-blue-700 py-1.5 px-2.5 rounded-md">
                <FaTag size={12} className="mr-1.5" /> ETB {displayPrice} / day
              </div>
              <div className="flex items-center">
                <FaGasPump size={12} className="mr-1.5" />
                <span>{vehicleData.fuelType || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <FaCogs size={12} className="mr-1.5" />
                <span>{vehicleData.transmission || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <FaUserFriends size={13} className="mr-1.5" />
                <span>{vehicleData.seats || "N/A"} Seats</span>
              </div>
            </div>

            <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
              Car Specifications
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 mb-6 text-xs sm:text-sm">
              <div>
                <span className="text-gray-500 block">Brand</span>
                <p className="font-medium text-gray-700">
                  {vehicleData.make || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-gray-500 block">Model</span>
                <p className="font-medium text-gray-700">
                  {vehicleData.model || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-gray-500 block">Year</span>
                <p className="font-medium text-gray-700">
                  {vehicleData.year || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-gray-500 block">Color</span>
                <p className="font-medium text-gray-700">
                  {vehicleData.color || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-gray-500 block">Doors</span>
                <p className="font-medium text-gray-700">
                  {vehicleData.doors || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-gray-500 block">Mileage</span>
                <p className="font-medium text-gray-700">
                  {vehicleData.mileage || "N/A"} km
                </p>
              </div>
            </div>

            {vehicleData.carFeatures && vehicleData.carFeatures.length > 0 && (
              <section>
                <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                  Features
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vehicleData.carFeatures.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 text-xs sm:text-sm px-2.5 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-full lg:w-4/12 xl:w-3/12 flex flex-col gap-4 sm:gap-6">
        <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            Booking Settings
          </h3>
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Booking Type:</span>
              <span className="font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                {vehicleData.instantBooking ? "Instant" : "Manual"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Notice Period:</span>
              <span className="font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                {vehicleData.advanceNoticePeriod || "Not specified"}
              </span>
            </div>
          </div>
        </div>

        {(vehicleData.pickUp && vehicleData.pickUp.length > 0) ||
        (vehicleData.dropOff && vehicleData.dropOff.length > 0) ? (
          <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
              Locations
            </h3>
            {vehicleData.pickUp && vehicleData.pickUp.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Pick-up:
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-gray-600">
                  {vehicleData.pickUp.map((location, index) => (
                    <li
                      key={`pickup-${index}`}
                      className="flex items-start gap-2"
                    >
                      <IoLocationOutline
                        size={16}
                        className="text-navy-700 mt-0.5 shrink-0"
                      />
                      <span>
                        {location.address ||
                          location.name ||
                          `Location ${index + 1}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {vehicleData.dropOff && vehicleData.dropOff.length > 0 && (
              <div>
                <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Drop-off:
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-gray-600">
                  {vehicleData.dropOff.map((location, index) => (
                    <li
                      key={`dropoff-${index}`}
                      className="flex items-start gap-2"
                    >
                      <IoLocationOutline
                        size={16}
                        className="text-navy-700 mt-0.5 shrink-0"
                      />
                      <span>
                        {location.address ||
                          location.name ||
                          `Location ${index + 1}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}

        <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            Vehicle Unavailability
          </h3>
          {vehicleData.unavailableDates &&
          vehicleData.unavailableDates.length > 0 ? (
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-2">
              {vehicleData.unavailableDates.map((dateString, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-xs sm:text-sm text-gray-600"
                >
                  <FaCalendarAlt size={14} className="text-red-500 shrink-0" />
                  <span>{formatDate(dateString)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-gray-500">
              No specific unavailable dates set. <br /> (Assumed generally
              available subject to notice period)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step5;
