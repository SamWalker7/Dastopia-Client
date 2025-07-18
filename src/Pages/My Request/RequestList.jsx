// RequestList.js

import React from "react";
import { IoFileTray } from "react-icons/io5";
import moment from "moment";
import image from "../../images/testimonials/avatar.png"; // Fallback image

const formatExpiryTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "Expired";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map((unit) => String(unit).padStart(2, "0")).join(":");
};

const RequestList = ({
  rentalRequests,
  selectedRequest,
  handleViewDetails,
  getStatusDisplay,
  currentTime,
  loading,
  error,
  carDetailsMap,
}) => {
  return (
    <div className="md:w-1/3 w-full bg-white p-6 rounded-xl shadow-md space-y-4 overflow-y-auto md:max-h-[calc(100vh-10rem)] mb-6 md:mb-0">
      <h2 className="text-xl font-bold text-[#00113D]">
        My Rental Requests ({rentalRequests.length})
      </h2>

      {loading && rentalRequests.length > 0 && (
        <p className="text-center text-gray-500">Updating...</p>
      )}
      {error && rentalRequests.length > 0 && (
        <p className="text-center text-red-500">Error: {error}</p>
      )}

      {rentalRequests.length === 0 && !loading ? (
        <div className="text-center py-8">
          <IoFileTray className="mx-auto text-4xl text-gray-400 mb-2" />
          <p className="text-gray-500">You have no rental requests.</p>
        </div>
      ) : (
        rentalRequests.map((request) => {
          const statusInfo = getStatusDisplay(request, currentTime);
          const isListItemExpired = statusInfo.isExpired;
          const detailedCarInfo = carDetailsMap[request.carId];
          const listImageUrl = detailedCarInfo?.vehicleImageKeys?.[0]?.key
            ? `https://d3imgazhy95l64.cloudfront.net/${detailedCarInfo.vehicleImageKeys[0].key}`
            : image;

          return (
            <div
              key={request.id}
              className={`p-4 w-full space-y-3 rounded-lg shadow-blue-100 shadow-md cursor-pointer transition-all duration-150 ${
                selectedRequest?.id === request.id
                  ? "border-2 border-[#00113D] bg-blue-50 scale-105"
                  : isListItemExpired
                  ? "border-2 border-red-300 bg-red-50 hover:bg-red-100"
                  : "hover:bg-gray-50 hover:shadow-lg"
              }`}
              onClick={() => handleViewDetails(request)}
            >
              <div
                className={`p-3 flex justify-between items-center border border-dashed rounded-lg ${
                  isListItemExpired
                    ? "border-red-500 bg-red-100 text-red-600"
                    : statusInfo.isPending && statusInfo.liveExpiresIn <= 0
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "border-blue-500 bg-blue-50 text-blue-600"
                }`}
              >
                <span
                  className={`font-semibold text-sm ${
                    isListItemExpired ||
                    (statusInfo.isPending && statusInfo.liveExpiresIn <= 0)
                      ? "text-red-700"
                      : "text-black"
                  }`}
                >
                  {isListItemExpired
                    ? "Expired"
                    : statusInfo.isPending
                    ? "Expires in"
                    : "Status"}
                </span>
                {statusInfo.isPending &&
                  !isListItemExpired &&
                  statusInfo.liveExpiresIn > 0 && (
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full text-white bg-blue-800`}
                    >
                      {formatExpiryTime(statusInfo.liveExpiresIn)}
                    </span>
                  )}
                {(!statusInfo.isPending ||
                  isListItemExpired ||
                  (statusInfo.isPending && statusInfo.liveExpiresIn <= 0)) && (
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${statusInfo.textColor} ${statusInfo.bgColor}`}
                  >
                    {statusInfo.text}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 text-xs text-gray-600 w-full gap-3 mt-2">
                <div className="flex items-center w-full gap-2">
                  <img
                    src={listImageUrl}
                    alt={request.make || "Car"}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <div className="w-full">
                    <span className="font-medium text-sm text-black block truncate">
                      Car
                    </span>
                    <p className="truncate">
                      {request.make || "N/A"} {request.model || ""}
                    </p>
                  </div>
                </div>
                <div className="h-full flex flex-col justify-center w-full">
                  <span className="font-medium text-sm text-black block">
                    Duration
                  </span>
                  <p>
                    {moment(request.startDate).format("MMM D")} -{" "}
                    {moment(request.endDate).format("MMM D, YYYY")}
                  </p>
                </div>
              </div>

              <div className="text-xs mt-2 space-y-1 w-full text-gray-600">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="font-medium text-sm text-black block">
                      Status
                    </span>
                    <p
                      className={`px-2 py-0.5 text-xs rounded-full w-fit ${statusInfo.bgColor} ${statusInfo.textColor}`}
                    >
                      {statusInfo.text}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-sm text-black block">
                      Total Payment
                    </span>
                    <p className="font-semibold text-black">
                      {request.amount
                        ? `${parseFloat(request.amount).toFixed(2)} ETB`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default RequestList;
