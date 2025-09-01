import React, { useMemo, useState } from "react";
import { FaRegCircle, FaSpinner } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import moment from "moment";
import ExtensionModal from "./ExtensionModal";
import image from "../../images/testimonials/avatar.png";

const formatExpiryTimeDetails = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "Expired";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map((unit) => String(unit).padStart(2, "0")).join(":");
};
const formatDateAndTime = (dateString) => {
  if (!dateString) return "N/A";
  return moment(dateString).format("MMM DD, YYYY HH:mm");
};
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return moment(dateString).format("MMM DD, YYYY");
};

// NEW: Helper function to format the service type for display
const formatServiceType = (serviceType) => {
  if (!serviceType) return "N/A";
  switch (serviceType) {
    case "self-drive":
      return "Self-Drive Only";
    case "with-driver":
      return "With Driver Only";
    case "both":
      return "Both Options Available";
    default:
      return serviceType;
  }
};

const RequestDetails = ({
  selectedRequest,
  selectedCarDetails,
  selectedRequestStatusInfo,
  rentalRequests,
  loading,
  handlePayNow,
  handlePayForExtension,
  isInitiatingPayment,
  paymentError,
  isSubmitting,
  actionError,
  handleStatusChange,
  handleCheckAvailability,
  handleRequestExtension,
  extensionData,
  setExtensionData,
}) => {
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);

  const { calculatedTotalAmount, rentalDurationText } = useMemo(() => {
    if (
      !selectedRequest?.startDate ||
      !selectedRequest.endDate ||
      selectedRequest.amount === undefined
    ) {
      return { calculatedTotalAmount: "N/A", rentalDurationText: "N/A" };
    }
    const startDateMoment = moment(selectedRequest.startDate);
    const endDateMoment = moment(selectedRequest.endDate);
    const amount = parseFloat(selectedRequest.amount);
    if (
      !startDateMoment.isValid() ||
      !endDateMoment.isValid() ||
      isNaN(amount) ||
      amount < 0
    ) {
      return {
        calculatedTotalAmount: "Invalid Data",
        rentalDurationText: "Invalid Data",
      };
    }
    const durationInDays = endDateMoment.diff(startDateMoment, "days") + 1;
    return {
      calculatedTotalAmount: `${amount.toFixed(2)}`,
      rentalDurationText: `${durationInDays} Day${
        durationInDays !== 1 ? "s" : ""
      }`,
    };
  }, [selectedRequest]);

  const handleOpenExtensionModal = () => {
    setExtensionData({
      newEndDate: null,
      isAvailable: null,
      availabilityLoading: false,
      availabilityError: null,
      additionalDays: 0,
      additionalAmount: 0,
    });
    setIsExtensionModalOpen(true);
  };

  const handleCloseExtensionModal = () => setIsExtensionModalOpen(false);

  // renderActionButtons function remains unchanged
  const renderActionButtons = () => {
    if (!selectedRequest || !selectedRequestStatusInfo) return null;
    const { key: statusKey, isPastStartDatePaymentDue } =
      selectedRequestStatusInfo;

    const canCancel =
      !moment(selectedRequest.startDate).isBefore(moment()) &&
      !["completed", "denied", "canceled", "active"].includes(statusKey);

    // Check for an approved extension with a pending payment
    const isExtensionPaymentDue =
      selectedRequest.extensionStatus?.toLowerCase() === "approved" &&
      !!selectedRequest.extensionPaymentUrl &&
      selectedRequest.extensions?.some(
        (ext) => ext.status === "approved" && ext.paymentStatus === "pending"
      );

    return (
      <div className="flex flex-col sm:flex-row text-base gap-4 pt-4 border-t border-gray-200">
        {/* Original "Pay Now" button */}
        {statusKey === "approved" && !isPastStartDatePaymentDue && (
          <button
            onClick={handlePayNow}
            className="flex-1 flex items-center justify-center py-2.5 px-4 rounded-full bg-[#00113D] text-white hover:bg-blue-800 transition-colors disabled:opacity-50"
            disabled={isInitiatingPayment || isSubmitting}
          >
            {isInitiatingPayment ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Processing...
              </>
            ) : (
              "Pay Now"
            )}
          </button>
        )}

        {/* --- ADDED: Pay for Extension button --- */}
        {isExtensionPaymentDue && (
          <button
            onClick={handlePayForExtension}
            className="flex-1 flex items-center justify-center py-2.5 px-4 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors disabled:opacity-50"
            disabled={isInitiatingPayment || isSubmitting}
          >
            {isInitiatingPayment ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Processing...
              </>
            ) : (
              "Pay for Extension"
            )}
          </button>
        )}

        {statusKey === "paid" &&
          moment().isSameOrAfter(moment(selectedRequest.startDate)) && (
            <button
              onClick={() => handleStatusChange(selectedRequest.id, "activate")}
              className="flex-1 flex items-center justify-center py-2.5 px-4 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Activating...
                </>
              ) : (
                "Activate Rental (I have the car)"
              )}
            </button>
          )}

        {statusKey === "active" && (
          <>
            <button
              onClick={() => handleStatusChange(selectedRequest.id, "complete")}
              className="flex-1 flex items-center justify-center py-2.5 px-4 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Completing...
                </>
              ) : (
                "Complete Rental (I returned the car)"
              )}
            </button>
            {/* Hide Request Extension button if one is already approved and waiting for payment */}
            {!isExtensionPaymentDue && (
              <button
                onClick={handleOpenExtensionModal}
                className="flex-1 py-2.5 px-4 rounded-full border border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors"
              >
                Request Extension
              </button>
            )}
          </>
        )}

        {canCancel && (
          <button
            onClick={() => handleStatusChange(selectedRequest.id, "cancel")}
            className="flex-1 flex items-center justify-center py-2.5 px-4 rounded-full border border-red-500 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Cancelling...
              </>
            ) : (
              "Cancel Request"
            )}
          </button>
        )}
      </div>
    );
  };

  const displayedError = paymentError || actionError;

  const primaryImageUrl = useMemo(() => {
    const firstImageKey = selectedCarDetails?.vehicleImageKeys?.[0]?.key;
    return firstImageKey
      ? `https://d3imgazhy95l64.cloudfront.net/${firstImageKey}`
      : image;
  }, [selectedCarDetails]);

  return (
    <>
      <ExtensionModal
        isOpen={isExtensionModalOpen}
        onClose={handleCloseExtensionModal}
        booking={selectedRequest}
        carDetails={selectedCarDetails}
        onCheckAvailability={handleCheckAvailability}
        onRequestExtension={handleRequestExtension}
        extensionData={extensionData}
        isSubmitting={isSubmitting}
      />
      <div className="md:w-2/3 md:pl-6 flex w-full space-y-6 flex-col">
        {selectedRequest ? (
          <>
            <div className="flex md:flex-row flex-col gap-6">
              <section className="md:w-1/2 w-full bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-lg font-semibold text-[#00113D] mb-6">
                  Request Summary
                </h2>
                <div className="flex items-start justify-between mb-4 text-sm">
                  <div>
                    <p className="font-medium text-[#00113D]">Status</p>
                    <p
                      className={`px-2 py-0.5 text-xs rounded-full w-fit mt-1 ${selectedRequestStatusInfo?.bgColor} ${selectedRequestStatusInfo?.textColor}`}
                    >
                      {selectedRequestStatusInfo?.text || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#00113D]">Request Date</p>
                    <p className="text-[#5A5A5A]">
                      {formatDateAndTime(selectedRequest.createdAt)}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-full text-center py-2 px-4 text-sm rounded-lg mt-4 ${
                    selectedRequestStatusInfo?.isExpired
                      ? "bg-red-100 text-red-700"
                      : selectedRequestStatusInfo?.liveExpiresIn <= 0 &&
                        selectedRequestStatusInfo?.isPending
                      ? "bg-red-100 text-red-700"
                      : "bg-[#E9F1FE] text-[#4478EB]"
                  }`}
                >
                  {selectedRequestStatusInfo?.isExpired
                    ? "Request Expired"
                    : selectedRequestStatusInfo?.isPending
                    ? selectedRequestStatusInfo?.liveExpiresIn <= 0
                      ? "Expired"
                      : `Expires in: ${formatExpiryTimeDetails(
                          selectedRequestStatusInfo?.liveExpiresIn
                        )}`
                    : "Status Confirmed"}
                </div>
                <h2 className="text-lg mt-8 mb-4 font-semibold text-[#00113D]">
                  Car Details
                </h2>
                {selectedCarDetails ? (
                  <div className="flex items-start gap-4">
                    <div className="text-sm space-y-2 text-gray-600 flex-1">
                      <div>
                        <span className="font-medium text-black block">
                          Brand
                        </span>
                        <p>{selectedCarDetails.make || "N/A"}</p>
                      </div>
                      <div>
                        <span className="font-medium text-black block">
                          Model
                        </span>
                        <p>{selectedCarDetails.model || "N/A"}</p>
                      </div>
                      <div>
                        <span className="font-medium text-black block">
                          Year
                        </span>
                        <p>{selectedCarDetails.year || "N/A"}</p>
                      </div>
                      <div>
                        <span className="font-medium text-black block">
                          Plate No.
                        </span>
                        <p>{selectedCarDetails.vehicleNumber || "N/A"}</p>
                      </div>
                      {/* --- NEW: Display Available Services --- */}
                      <div className="pt-2 border-t mt-2">
                        <span className="font-medium text-black block">
                          Available Services
                        </span>
                        <p className="font-semibold text-blue-700">
                          {formatServiceType(selectedCarDetails.serviceType)}
                        </p>
                      </div>
                      {selectedCarDetails.serviceType !== "self-drive" && (
                        <div>
                          <span className="font-medium text-black block">
                            Driver's Daily Price
                          </span>
                          <p className="text-green-700 font-semibold">
                            + {selectedCarDetails.driverPrice || "0"} ETB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Loading car details...</p>
                )}
              </section>

              <section className="md:w-1/2 w-full bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-lg font-semibold text-[#00113D] mb-6">
                  Rental Details
                </h2>
                <div className="flex flex-col text-sm text-[#5A5A5A]">
                  <div className="flex items-start gap-3 mb-4 relative">
                    <FaRegCircle className="text-blue-500 mt-1 flex-shrink-0" />
                    <div className="absolute left-[5.5px] top-5 bottom-[-1.5rem] w-px bg-gray-300"></div>
                    <div className="flex-grow">
                      <p className="font-semibold text-black">
                        Pick Up: {formatDate(selectedRequest.startDate)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedRequest.displayPickUpLocation ||
                          "Location not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 mt-4 relative">
                    <FaRegCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <div className="flex-grow">
                      <p className="font-semibold text-black">
                        Drop Off: {formatDate(selectedRequest.endDate)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedRequest.displayDropOffLocation ||
                          "Location not specified"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-sm">
                  <span className="font-medium text-black block">Duration</span>
                  <p className="text-gray-600">{rentalDurationText}</p>
                </div>
                {/* --- NEW: Display Requested Service Type --- */}
                <div className="mt-4 text-sm">
                  <span className="font-medium text-black block">
                    Service Type
                  </span>
                  <p className="font-semibold text-gray-800">
                    {selectedRequest.driverProvided
                      ? "With Driver"
                      : "Self-Drive"}
                  </p>
                </div>
                <div className="mt-4 text-sm">
                  <span className="font-medium text-black block">
                    Total Payment
                  </span>
                  <p className="text-gray-600 font-semibold">
                    {calculatedTotalAmount} ETB
                  </p>
                </div>
              </section>
            </div>
            <section className="h-fit bg-white p-6 rounded-xl shadow-lg">
              {renderActionButtons()}
              {displayedError && (
                <div
                  className="mt-4 p-3 flex items-center gap-3 bg-red-50 text-red-800 rounded-lg border border-red-200"
                  role="alert"
                >
                  <MdErrorOutline size={24} className="flex-shrink-0" />
                  <span className="text-sm font-semibold">
                    {displayedError}
                  </span>
                </div>
              )}
            </section>
          </>
        ) : (
          !loading &&
          rentalRequests.length > 0 && (
            <div className="md:w-2/3 w-full bg-white p-6 rounded-xl shadow-lg h-[400px] flex justify-center items-center">
              <p className="text-gray-500">
                Select a request from the left to see details.
              </p>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default RequestDetails;
