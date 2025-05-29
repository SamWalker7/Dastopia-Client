import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FaRegCircle } from "react-icons/fa";
// Use the fallback image directly now
import image from "../../images/testimonials/avatar.png";
import {
  IoChatboxOutline,
  IoFileTray,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { MdOutlineLocalPhone, MdOutlineMail } from "react-icons/md";
import useVehicleFormStore from "../../store/useVehicleFormStore";
import { useNavigate } from "react-router-dom";

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "Expired";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60); // Ensure 's' is an integer for padStart
  return [h, m, s].map((unit) => String(unit).padStart(2, "0")).join(":");
};

const RentalRequests = () => {
  const navigate = useNavigate();

  const [rentalRequests, setRentalRequests] = useState([]);
  const [vehicleDetailsMap, setVehicleDetailsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const { apiCallWithRetry } = useVehicleFormStore();
  const [selectedRequest, setSelectedRequest] = useState(null);

  const customer = useMemo(
    () => JSON.parse(localStorage.getItem("customer")) || {},
    []
  );

  const ownerId = useMemo(() => customer?.username || customer?.id, [customer]);
  // ownerGivenName and ownerFamilyName are not used in handleChatWithRentee if not part of URL
  // const ownerGivenName = useMemo(() => customer?.given_name || customer?.firstName || "", [customer]);
  // const ownerFamilyName = useMemo(() => customer?.family_name || customer?.lastName || "", [customer]);

  const handleChatWithRentee = useCallback(
    (booking) => {
      const renteeId = booking?.renteeId;
      const bookingId = booking?.id;
      const carId = booking?.carId;
      const renteeInfo = booking?.renteeInfo;
      const renteeGivenName = renteeInfo?.given_name || "";
      const renteeFamilyName = renteeInfo?.family_name || "";
      console.error("Chat with rentee clicked", renteeId);

      if (!ownerId) {
        console.error("Chat Error: Owner ID not found in localStorage.");
        alert("Your user ID is missing. Cannot initiate chat.");
        return;
      }
      if (!renteeId) {
        console.error("Chat Error: Rentee ID not found for this request.");
        alert("Rentee details missing. Cannot initiate chat.");
        return;
      }

      // const chatUrl = `/chat?userId1=${encodeURIComponent(
      //   ownerId
      // )}&userId2=${encodeURIComponent(renteeId)}&bookingId=${encodeURIComponent(
      //   bookingId
      // )}&carId=${encodeURIComponent(carId)}&given_name=${encodeURIComponent(
      //   renteeGivenName
      // )}&family_name=${encodeURIComponent(renteeFamilyName)}`;

      // console.log(
      //   `Navigating to chat: Owner ID=${ownerId}, Rentee ID=${renteeId}, Booking ID=${bookingId}, Car ID=${carId}`
      // );
      navigate(
        `/chat?renteeId=${renteeId}&reservationId=${renteeId}&given_name=${renteeGivenName}&family_name=${renteeFamilyName}`
      );
      // navigate(chatUrl);
    },
    [navigate, ownerId]
  );

  const handleApproveRequest = useCallback(
    async (bookingId) => {
      setActionLoading(true);
      setActionError(null);
      try {
        const response = await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/approve_booking/${bookingId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${customer.AccessToken}`,
            },
          }
        );

        if (response && response.statusCode === 200) {
          console.log(`Booking ${bookingId} approved successfully.`);
          setRentalRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== bookingId)
          );
          if (selectedRequest?.id === bookingId) {
            setSelectedRequest(null);
          }
        } else {
          const errorMessage = `Failed to approve booking ${bookingId}. ${
            response?.body?.message || "Unknown error"
          }`;
          console.error("Approve failed:", response);
          setActionError(errorMessage);
        }
      } catch (err) {
        console.error("Error approving booking:", err);
        setActionError(`Error approving booking ${bookingId}: ${err.message}`);
      } finally {
        setActionLoading(false);
      }
    },
    [apiCallWithRetry, customer?.AccessToken, selectedRequest?.id]
  );

  const handleRejectRequest = useCallback(
    async (bookingId) => {
      setActionLoading(true);
      setActionError(null);
      try {
        const response = await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/deny_booking/${bookingId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${customer.AccessToken}`,
            },
          }
        );

        if (response && response.statusCode === 200) {
          console.log(`Booking ${bookingId} rejected successfully.`);
          setRentalRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== bookingId)
          );
          if (selectedRequest?.id === bookingId) {
            setSelectedRequest(null);
          }
        } else {
          const errorMessage = `Failed to reject booking ${bookingId}. ${
            response?.body?.message || "Unknown error"
          }`;
          console.error("Reject failed:", response);
          setActionError(errorMessage);
        }
      } catch (err) {
        console.error("Error rejecting booking:", err);
        setActionError(`Error rejecting booking ${bookingId}: ${err.message}`);
      } finally {
        setActionLoading(false);
      }
    },
    [apiCallWithRetry, customer?.AccessToken, selectedRequest?.id]
  );

  const fetchVehicleDetails = useCallback(
    async (carId) => {
      if (!carId || !customer?.AccessToken) return null;
      try {
        const vehicleResponse = await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/${carId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${customer.AccessToken}`,
            },
          }
        );
        if (vehicleResponse && vehicleResponse.body) {
          return vehicleResponse.body;
        }
        console.warn(
          `Vehicle details not found for carId: ${carId}`,
          vehicleResponse
        );
        return null;
      } catch (error) {
        console.error(
          `Error fetching vehicle details for carId ${carId}:`,
          error
        );
        return null;
      }
    },
    [apiCallWithRetry, customer?.AccessToken]
  );

  const fetchRentalRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    setActionError(null);
    setRentalRequests([]);
    setVehicleDetailsMap({});
    setSelectedRequest(null);

    if (!customer?.AccessToken) {
      setError("Authentication failed: Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await apiCallWithRetry(
        "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/get_all_owner_booking",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${customer.AccessToken}`,
          },
        }
      );

      if (response && Array.isArray(response.body)) {
        const pendingRequests = response.body.filter(
          (request) => request.approvedStatus?.toLowerCase() === "pending"
        );

        pendingRequests.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const vehicleIds = [
          ...new Set(pendingRequests.map((req) => req.carId).filter(Boolean)),
        ];

        const vehicleResults = await Promise.all(
          vehicleIds.map(fetchVehicleDetails)
        );

        const fetchedVehicleDetailsMap = {};
        vehicleResults.filter(Boolean).forEach((detail) => {
          if (detail?.id) fetchedVehicleDetailsMap[detail.id] = detail;
        });
        setVehicleDetailsMap(fetchedVehicleDetailsMap);

        const requestsWithExpiryAndDetails = pendingRequests.map((request) => {
          const createdAt = new Date(request.createdAt);
          const expiryTime = new Date(
            createdAt.getTime() + 24 * 60 * 60 * 1000
          );
          const expiresInSeconds = Math.max(
            0,
            Math.floor((expiryTime.getTime() - new Date().getTime()) / 1000)
          );

          const renteeName = `${request.renteeInfo?.given_name || ""} ${
            request.renteeInfo?.family_name || ""
          }`.trim();

          // --- START: Location Data Processing ---
          let displayPickUp = "Location not specified";
          if (
            request.pickUp &&
            Array.isArray(request.pickUp) &&
            request.pickUp.length > 0
          ) {
            if (
              typeof request.pickUp[0] === "object" &&
              request.pickUp[0] !== null &&
              "lng" in request.pickUp[0]
            ) {
              // First element is coordinates object
              if (
                request.pickUp.length > 1 &&
                typeof request.pickUp[1] === "string"
              ) {
                displayPickUp = request.pickUp[1]; // Assume address string is the second element
              } else {
                displayPickUp = "Coordinates available"; // No string address found with coordinates
              }
            } else if (typeof request.pickUp[0] === "string") {
              displayPickUp = request.pickUp[0]; // First element is already a string
            }
          } else if (typeof request.pickUp === "string") {
            displayPickUp = request.pickUp;
          } else if (
            request.pickUp &&
            typeof request.pickUp === "object" &&
            request.pickUp.name
          ) {
            // Check if pickUp is an object with a name property
            displayPickUp = request.pickUp.name;
          }

          let displayDropOff = "Location not specified";
          if (
            request.dropOff &&
            Array.isArray(request.dropOff) &&
            request.dropOff.length > 0
          ) {
            if (
              typeof request.dropOff[0] === "object" &&
              request.dropOff[0] !== null &&
              "lng" in request.dropOff[0]
            ) {
              if (
                request.dropOff.length > 1 &&
                typeof request.dropOff[1] === "string"
              ) {
                displayDropOff = request.dropOff[1];
              } else {
                displayDropOff = "Coordinates available";
              }
            } else if (typeof request.dropOff[0] === "string") {
              displayDropOff = request.dropOff[0];
            }
          } else if (typeof request.dropOff === "string") {
            displayDropOff = request.dropOff;
          } else if (
            request.dropOff &&
            typeof request.dropOff === "object" &&
            request.dropOff.name
          ) {
            // Check if dropOff is an object with a name property
            displayDropOff = request.dropOff.name;
          }
          // --- END: Location Data Processing ---

          return {
            ...request,
            expiresInSeconds,
            vehicleDetail: fetchedVehicleDetailsMap[request.carId],
            renterName: renteeName || "Unknown Rentee",
            renterPhone: request.renteeInfo?.phone_number || "Unknown",
            renterAvatarUrl: image,
            displayPickUpLocation: displayPickUp, // Add processed location
            displayDropOffLocation: displayDropOff, // Add processed location
          };
        });

        setRentalRequests(requestsWithExpiryAndDetails);
      } else {
        const msg =
          "Failed to fetch rental requests or invalid response format.";
        console.error(msg, response);
        setError(msg);
        setRentalRequests([]);
      }
    } catch (err) {
      const msg = "Error fetching rental requests: " + err.message;
      console.error(msg, err);
      setError(msg);
      setRentalRequests([]);
    } finally {
      setLoading(false);
    }
  }, [apiCallWithRetry, customer?.AccessToken, fetchVehicleDetails]);

  useEffect(() => {
    fetchRentalRequests();
  }, [fetchRentalRequests]);

  useEffect(() => {
    if (!loading && rentalRequests.length > 0 && selectedRequest === null) {
      setSelectedRequest(rentalRequests[0]);
    } else if (
      !loading &&
      rentalRequests.length === 0 &&
      selectedRequest !== null
    ) {
      setSelectedRequest(null);
    }
    if (
      selectedRequest &&
      !rentalRequests.find((req) => req.id === selectedRequest.id)
    ) {
      setSelectedRequest(rentalRequests.length > 0 ? rentalRequests[0] : null);
    }
  }, [loading, rentalRequests, selectedRequest]);

  if (loading && rentalRequests.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading rental requests...
      </div>
    );
  }

  if (error && rentalRequests.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex md:flex-row flex-col justify-center md:pt-32 px-4 sm:px-10 md:px-20 p-6 pt-28 bg-[#F8F8FF] min-h-screen">
      <div className="md:w-1/3 w-full bg-white p-6 rounded-xl shadow-lg space-y-4 overflow-y-auto md:max-h-[calc(100vh-10rem)] mb-6 md:mb-0">
        <h2 className="text-xl font-bold text-[#00113D]">
          Rental Requests ({rentalRequests.length})
        </h2>
        {loading && rentalRequests.length > 0 && (
          <p className="text-center text-gray-500">Updating list...</p>
        )}
        {error && rentalRequests.length > 0 && (
          <p className="text-center text-red-500">
            Error updating list: {error}
          </p>
        )}

        {rentalRequests.length === 0 && !loading ? (
          <div className="text-center py-8">
            <IoFileTray className="mx-auto text-4xl text-gray-400 mb-2" />
            <p className="text-gray-500">
              You have no pending rental requests.
            </p>
            {error && (
              <p className="text-red-500 text-sm mt-2">
                Could not load requests: {error}
              </p>
            )}
          </div>
        ) : (
          rentalRequests.map((request) => (
            <div
              key={request.id}
              className={`p-4 w-full space-y-3 rounded-lg shadow-blue-100 shadow-md cursor-pointer transition-all duration-150 ${
                selectedRequest?.id === request.id
                  ? "border-2 border-[#00113D] bg-blue-50 scale-105"
                  : "hover:bg-gray-50 hover:shadow-lg"
              }`}
              onClick={() => setSelectedRequest(request)}
            >
              <div
                className={`p-3 flex justify-between items-center border border-dashed ${
                  request.expiresInSeconds <= 0
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "border-blue-500 bg-blue-50 text-blue-600"
                } rounded-lg`}
              >
                <span className="font-semibold text-sm text-black">
                  Expires in
                </span>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full text-white ${
                    request.expiresInSeconds <= 0 ? "bg-red-700" : "bg-blue-800"
                  }`}
                >
                  {formatTime(request.expiresInSeconds)}
                </span>
              </div>
              <div className="grid grid-cols-2 text-xs text-gray-600 w-full gap-3 mt-2">
                <div className="flex items-center w-full gap-2">
                  <img
                    src={request.renterAvatarUrl}
                    alt="Renter Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="w-full">
                    <span className="font-medium text-sm text-black block truncate">
                      Rentee
                    </span>
                    <p className="truncate">{request.renterName}</p>
                  </div>
                </div>
                <div className="h-full flex flex-col justify-center w-full">
                  <span className="font-medium text-sm text-black block">
                    Duration
                  </span>
                  <p>
                    {request.startDate && request.endDate
                      ? `${Math.ceil(
                          (new Date(request.endDate) -
                            new Date(request.startDate)) /
                            (1000 * 60 * 60 * 24)
                        )} Days`
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="text-xs mt-2 space-y-1 w-full text-gray-600">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="font-medium text-sm text-black block">
                      Car
                    </span>
                    <p className="truncate">
                      {request.vehicleDetail?.make || "N/A"}{" "}
                      {request.vehicleDetail?.model || ""}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-sm text-black block">
                      Total Payment
                    </span>
                    <p className="font-semibold text-black">
                      {request.amount ? `${request.amount} ETB` : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

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
                    <p className="text-[#5A5A5A] capitalize">
                      {selectedRequest.approvedStatus || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#00113D]">Request Date</p>
                    <p className="text-[#5A5A5A]">
                      {selectedRequest.createdAt
                        ? new Date(
                            selectedRequest.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                      <br />
                      {selectedRequest.createdAt
                        ? new Date(
                            selectedRequest.createdAt
                          ).toLocaleTimeString()
                        : ""}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-full text-center py-2 px-4 text-sm rounded-lg mt-4 ${
                    selectedRequest.expiresInSeconds <= 0
                      ? "bg-red-100 text-red-700"
                      : "bg-[#E9F1FE] text-[#4478EB]"
                  }`}
                >
                  {selectedRequest.expiresInSeconds <= 0
                    ? "Request Expired"
                    : `Expires in: ${formatTime(
                        selectedRequest.expiresInSeconds
                      )}`}
                </div>
                <h2 className="text-lg mt-8 mb-4 font-semibold text-[#00113D]">
                  Car Details
                </h2>
                <div className="text-sm space-y-2 text-gray-600">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-black block">
                        Brand
                      </span>
                      <p>{selectedRequest.vehicleDetail?.make || "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-black block">
                        Model
                      </span>
                      <p>{selectedRequest.vehicleDetail?.model || "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-black block">Year</span>
                      <p>{selectedRequest.vehicleDetail?.year || "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-black block">
                        Plate No.
                      </span>
                      <p>
                        {selectedRequest.vehicleDetail?.vehicleNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="md:w-1/2 w-full bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-lg font-semibold text-[#00113D] mb-6">
                  Rental Details
                </h2>
                <div className="flex flex-col text-sm text-[#5A5A5A]">
                  <div className="flex items-start gap-3 mb-4">
                    <FaRegCircle className="text-blue-500 mt-1 flex-shrink-0" />
                    <div className="flex-grow">
                      <p className="font-semibold text-black">Pick Up</p>
                      <p>
                        {selectedRequest.startDate
                          ? new Date(selectedRequest.startDate).toLocaleString()
                          : "N/A"}
                      </p>
                      {/* Use processed location string */}
                      <p className="text-xs text-gray-500">
                        {selectedRequest.displayPickUpLocation}
                      </p>
                    </div>
                  </div>
                  <div className="ml-[7px] h-8 w-px bg-gray-300 mb-0"></div>
                  <div className="flex items-start gap-3">
                    <FaRegCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <div className="flex-grow">
                      <p className="font-semibold text-black">Drop Off</p>
                      <p>
                        {selectedRequest.endDate
                          ? new Date(selectedRequest.endDate).toLocaleString()
                          : "N/A"}
                      </p>
                      {/* Use processed location string */}
                      <p className="text-xs text-gray-500">
                        {selectedRequest.displayDropOffLocation}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-sm">
                  <span className="font-medium text-black block">
                    Driver Requested
                  </span>
                  <p className="text-gray-600">
                    {selectedRequest.driverRequest ? "Yes" : "No"}
                  </p>
                </div>
                <div className="mt-4 text-sm">
                  <span className="font-medium text-black block">
                    Total Payment
                  </span>
                  <p className="text-gray-600 font-semibold">
                    {selectedRequest.amount
                      ? `${selectedRequest.amount} ETB`
                      : "N/A"}
                  </p>
                </div>
              </section>
            </div>

            <section className="h-fit bg-white p-6 space-y-6 rounded-xl shadow-lg">
              <h2 className="text-lg font-semibold text-[#00113D] mb-6">
                Rentee Details
              </h2>
              <div className="items-center flex md:flex-row flex-col gap-6 md:gap-8">
                <img
                  src={selectedRequest.renterAvatarUrl}
                  alt="Renter Profile"
                  className="w-12 h-12 md:w-12 md:h-12 rounded-full object-cover"
                />
                <div className="grid gap-x-6 gap-y-3 md:grid-cols-2 grid-cols-1 w-full">
                  <div className="flex items-center gap-3 text-sm text-[#5A5A5A]">
                    <IoPersonOutline size={18} className="text-gray-500" />
                    <span>{selectedRequest.renterName}</span>
                  </div>
                  {/* <div className="flex items-center gap-3 text-sm text-[#5A5A5A]">
                    <MdOutlineLocalPhone size={18} className="text-gray-500" />
                    <span>{selectedRequest.renterPhone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#5A5A5A]">
                    <MdOutlineMail size={18} className="text-gray-500" />
                    <span>{selectedRequest.renteeInfo?.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#5A5A5A]">
                    <IoLocationOutline size={18} className="text-gray-500" />
                    <span>Address N/A</span>
                  </div> */}
                </div>
              </div>
              {/* <button
                className="w-full md:w-auto mt-4 px-8 py-3 text-sm border rounded-full border-[#00113D] text-[#00113D] bg-white hover:bg-[#00113D] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={() => handleChatWithRentee(selectedRequest)}
                disabled={
                  !ownerId ||
                  !selectedRequest?.renteeId ||
                  !selectedRequest?.id ||
                  actionLoading
                }
              >
                <IoChatboxOutline size={16} />
                Chat With Rentee
              </button> */}
              {actionError && (
                <p className="text-red-500 text-sm text-center mt-2">
                  {actionError}
                </p>
              )}
              <div className="flex text-base gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleRejectRequest(selectedRequest.id)}
                  className="flex-1 py-3 rounded-full bg-red-50 text-red-700 border border-red-600 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    actionLoading ||
                    !selectedRequest?.id ||
                    selectedRequest.expiresInSeconds <= 0
                  }
                >
                  {actionLoading && selectedRequest.id === selectedRequest?.id
                    ? "Rejecting..."
                    : "Reject Request"}
                </button>
                <button
                  className="flex-1 py-3 rounded-full bg-[#00113D] text-white hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleApproveRequest(selectedRequest.id)}
                  disabled={
                    actionLoading ||
                    !selectedRequest?.id ||
                    selectedRequest.expiresInSeconds <= 0
                  }
                >
                  {actionLoading && selectedRequest.id === selectedRequest?.id
                    ? "Approving..."
                    : "Approve Request"}
                </button>
              </div>
            </section>
          </>
        ) : (
          <div className="md:w-2/3 w-full bg-white p-6 rounded-xl shadow-lg h-[400px] flex justify-center items-center">
            <p className="text-gray-500">
              {rentalRequests.length > 0
                ? "Select a rental request from the left to see details."
                : "No pending requests."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalRequests;
