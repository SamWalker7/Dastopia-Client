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

// getDownloadUrl is no longer needed if we only use renteeInfo from booking response
// import { getDownloadUrl } from "../api"; // Assuming this is the same function as in Account1.js

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "Expired";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((unit) => String(unit).padStart(2, "0")).join(":");
};

const RentalRequests = () => {
  const navigate = useNavigate();
  // Remove unused state variables related to old modal/checkbox logic
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const [approved, setApproved] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);

  const [rentalRequests, setRentalRequests] = useState([]);
  const [vehicleDetailsMap, setVehicleDetailsMap] = useState({});
  // Remove renteeDetailsMap as we'll use renteeInfo directly from the request object
  // const [renteeDetailsMap, setRenteeDetailsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { apiCallWithRetry } = useVehicleFormStore();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const customer = JSON.parse(localStorage.getItem("customer")) || {};

  const ownerId = customer?.username || customer?.id;
  const ownerGivenName = customer?.given_name || customer?.firstName || "";
  const ownerFamilyName = customer?.family_name || customer?.lastName || "";

  // Remove unused constants
  // const conditions = [ ... ];
  // Remove unused handlers
  // const handleCheckboxChange = useCallback(() => { ... }, []);
  // const handleConfirmBooking = async () => { ... };
  // const handleCancelBooking = async () => { ... };

  // Chat handler modified to use renteeInfo from the booking object
  const handleChatWithRentee = useCallback(
    (booking) => {
      const renteeId = booking?.renteeId;
      const bookingId = booking?.id;
      const carId = booking?.carId;
      // Access renteeInfo directly from the booking object
      const renteeInfo = booking?.renteeInfo;
      const renteeGivenName = renteeInfo?.given_name || "";
      const renteeFamilyName = renteeInfo?.family_name || "";

      const currentOwnerId = ownerId;
      const currentOwnerGivenName = ownerGivenName; // Still need owner name for chat context if backend uses it
      const currentOwnerFamilyName = ownerFamilyName; // Still need owner name for chat context

      if (!currentOwnerId) {
        console.error("Chat Error: Owner ID not found in localStorage.");
        alert("Your user ID is missing. Cannot initiate chat.");
        return;
      }
      if (!renteeId) {
        console.error("Chat Error: Rentee ID not found for this request.");
        alert("Rentee details missing. Cannot initiate chat.");
        return;
      }
      if (!renteeInfo) {
        console.warn("Chat Warning: renteeInfo missing for this request.");
        // Continue, but maybe show a warning to the user or log
      }

      const chatUrl = `/chat?userId1=${encodeURIComponent(
        currentOwnerId || ""
      )}&userId2=${encodeURIComponent(
        renteeId || ""
      )}&bookingId=${encodeURIComponent(
        bookingId || ""
      )}&carId=${encodeURIComponent(
        carId || ""
      )}&given_name=${encodeURIComponent(
        renteeGivenName || "" // Use given_name from renteeInfo
      )}&family_name=${encodeURIComponent(
        renteeFamilyName || "" // Use family_name from renteeInfo
      )}`;

      console.log(
        `Navigating to chat: Owner ID=${currentOwnerId}, Rentee ID=${renteeId}, Booking ID=${bookingId}, Car ID=${carId}`
      );

      navigate(chatUrl);
    },
    [navigate, ownerId, ownerGivenName, ownerFamilyName] // Dependencies updated
  );

  // Re-implement approval/rejection handlers as they were removed in prompt
  const handleApproveRequest = useCallback(
    async (bookingId) => {
      setLoading(true); // Maybe use a separate loading state for actions
      setError(null);
      try {
        const response = await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/approve_booking/${bookingId}`,
          {
            method: "GET", // Or POST, depending on your API
            headers: {
              "Content-Type": "application/json", // Needed for POST, maybe not GET
              Authorization: `Bearer ${customer.AccessToken}`,
            },
          }
        );

        if (response && response.statusCode === 200) {
          console.log(`Booking ${bookingId} approved successfully.`);
          // Remove the approved request from the list
          setRentalRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== bookingId)
          );
          setSelectedRequest(null); // Deselect the request
        } else {
          console.error("Approve failed:", response);
          // Assuming response includes an error message
          setError(
            `Failed to approve booking ${bookingId}. ${
              response?.body?.message || ""
            }`
          );
        }
      } catch (err) {
        console.error("Error approving booking:", err);
        setError(`Error approving booking ${bookingId}: ${err.message}`);
      } finally {
        // Instead of setting main loading to false, update the request status in place
        // or refetch the list to show changes. Removing from list is simpler here.
        // setLoading(false); // Don't turn off main loading unless it's the only thing happening
      }
    },
    [apiCallWithRetry, customer?.AccessToken]
  );

  const handleRejectRequest = useCallback(
    async (bookingId) => {
      setLoading(true); // Maybe use a separate loading state for actions
      setError(null);
      try {
        const response = await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/deny_booking/${bookingId}`,
          {
            method: "GET", // Or POST
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${customer.AccessToken}`,
            },
          }
        );

        if (response && response.statusCode === 200) {
          console.log(`Booking ${bookingId} rejected successfully.`);
          // Remove the rejected request from the list
          setRentalRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== bookingId)
          );
          setSelectedRequest(null); // Deselect the request
        } else {
          console.error("Reject failed:", response);
          setError(
            `Failed to reject booking ${bookingId}. ${
              response?.body?.message || ""
            }`
          );
        }
      } catch (err) {
        console.error("Error rejecting booking:", err);
        setError(`Error rejecting booking ${bookingId}: ${err.message}`);
      } finally {
        // setLoading(false); // Don't turn off main loading unless it's the only thing happening
      }
    },
    [apiCallWithRetry, customer?.AccessToken]
  );

  // Keep fetchVehicleDetails as it's needed for car details
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

  // Remove fetchRenteeDetails as it's no longer needed
  // const fetchRenteeDetails = useCallback( ... );

  const fetchRentalRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    setRentalRequests([]); // Clear existing requests
    setVehicleDetailsMap({});
    // setRenteeDetailsMap({}); // No longer needed
    setSelectedRequest(null); // Deselect any request

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

        // Collect unique vehicle IDs (still needed)
        const vehicleIds = [
          ...new Set(pendingRequests.map((req) => req.carId).filter(Boolean)),
        ];
        // No need to collect renteeIds or fetch rentee details separately

        // Fetch vehicle details in parallel
        const vehicleResults = await Promise.all(
          vehicleIds.map(fetchVehicleDetails)
        );

        // Create map for vehicle details
        const fetchedVehicleDetailsMap = {};
        vehicleResults.filter(Boolean).forEach((detail) => {
          if (detail?.id) fetchedVehicleDetailsMap[detail.id] = detail;
        });
        setVehicleDetailsMap(fetchedVehicleDetailsMap);

        // No map needed for rentee details - they are already in renteeInfo

        const requestsWithExpiryAndDetails = pendingRequests.map((request) => {
          const createdAt = new Date(request.createdAt);
          // Assuming expiry is 24 hours from creation time
          const expiryTime = new Date(
            createdAt.getTime() + 24 * 60 * 60 * 1000
          );
          const expiresInSeconds = Math.max(
            0,
            Math.floor((expiryTime.getTime() - new Date().getTime()) / 1000)
          );

          // Access renteeInfo directly from the request object
          const renteeName =
            (request.renteeInfo?.given_name || "") +
            " " +
            (request.renteeInfo?.family_name || "");

          return {
            ...request, // Includes renteeInfo
            expiresInSeconds,
            vehicleDetail: fetchedVehicleDetailsMap[request.carId],
            // Add flattened rentee info for list item display convenience
            renterName: renteeName.trim() || "Unknown Rentee",
            renterPhone: request.renteeInfo?.phone_number || "Unknown",
            // Profile picture key is not in renteeInfo, so we can't fetch it.
            // The list item will just use the fallback image.
            // The details panel will also use the fallback image.
            // renterAvatarUrl: request.renteeInfo?.profilePicture || image, // ProfilePicture is not in the renteeInfo object from the booking response
            renterAvatarUrl: image, // Always use fallback as key is not in renteeInfo
          };
        });

        setRentalRequests(requestsWithExpiryAndDetails);
      } else {
        console.error(
          "Failed to fetch rental requests or invalid response format:",
          response
        );
        setError("Failed to fetch rental requests or invalid response format.");
        setRentalRequests([]); // Ensure list is empty on error/bad format
      }
    } catch (err) {
      console.error("Error fetching rental requests:", err);
      setError("Error fetching rental requests: " + err.message);
      setRentalRequests([]); // Ensure list is empty on error
    } finally {
      setLoading(false);
    }
  }, [
    apiCallWithRetry,
    customer?.AccessToken,
    fetchVehicleDetails, // fetchRenteeDetails is removed
  ]);

  // Effect to fetch requests on component mount or when fetch function changes
  useEffect(() => {
    fetchRentalRequests();
  }, [fetchRentalRequests]);

  // Auto-select the first request when the list loads or changes
  useEffect(() => {
    // Only auto-select if not currently loading, list has items, and no request is already selected
    if (!loading && rentalRequests.length > 0 && selectedRequest === null) {
      console.log("Auto-selecting first request:", rentalRequests[0].id);
      setSelectedRequest(rentalRequests[0]);
    } else if (
      !loading &&
      rentalRequests.length === 0 &&
      selectedRequest !== null // If list becomes empty while a request is selected
    ) {
      console.log("Rental request list is empty, deselecting current request.");
      setSelectedRequest(null);
    }
  }, [loading, rentalRequests, selectedRequest]); // Depend on loading, rentalRequests list content, and selectedRequest

  // // Show loading state
  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       Loading rental requests...
  //     </div>
  //   );
  // }

  // Show error state if no requests are loaded and there's an error
  if (error && rentalRequests.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex md:flex-row flex-col justify-center md:pt-32 px-20 p-6 pt-28 bg-[#F8F8FF] min-h-screen">
      {/* Left Panel: List of Requests */}
      <div className="md:w-1/3 w-full bg-white p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-bold text-[#00113D]">Rental Requests</h2>

        {/* Display list or empty message */}
        {rentalRequests.length === 0 ? (
          <div className="text-center py-8">
            <IoFileTray className="mx-auto text-4xl text-gray-400 mb-2" />
            <p className="text-gray-500">
              You have no pending rental requests.
            </p>
            {/* Optionally show error here if loading failed but there might have been previous data */}
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
              className={`p-4 w-full space-y-8 rounded-lg shadow-blue-100 shadow-md cursor-pointer ${
                selectedRequest?.id === request.id
                  ? "border-2 border-[#00113D] bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedRequest(request)} // Select the request on click
            >
              {/* Expiry Info */}
              <div
                className={`p-4 flex justify-between items-center mb-3 border border-dashed ${
                  request.expiresInSeconds <= 0
                    ? "border-[#EB4444] bg-[#FDEAEA] text-[#EB4444]"
                    : "border-[#4478EB] bg-[#E9F1FE] text-[#4478EB]"
                } rounded-lg`}
              >
                <span className="font-semibold text-base text-[#000000]">
                  Expires in
                </span>
                <span
                  className={`px-4 py-2 text-sm font-medium rounded-full text-white ${
                    request.expiresInSeconds <= 0
                      ? "bg-[#410002]"
                      : "bg-[#00173C]"
                  }`}
                >
                  {request.expiresInSeconds > 0
                    ? formatTime(request.expiresInSeconds)
                    : "Expired"}
                </span>
              </div>

              {/* Rentee & Duration Info (using flattened rentee info) */}
              <div className="grid grid-cols-2 text-sm text-gray-500 w-full gap-4 mt-4">
                <div className="flex items-center w-full gap-3">
                  {/* Always use the fallback image as profile picture key is not available in renteeInfo */}
                  <img
                    src={image}
                    alt="Renter Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="w-full">
                    <span className="font-medium text-black">Rentee Name</span>
                    <p className="">
                      {/* Access name from flattened rentee info */}
                      {request.renterName}
                    </p>
                  </div>
                </div>
                <div className="h-full flex flex-col justify-center w-full">
                  <span className="font-medium text-black">Rent Duration</span>
                  <p className="">
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

              {/* Car Details (using vehicleDetail) */}
              <div className="text-sm mb-4 space-y-2 w-full text-gray-500">
                <div className="grid grid-cols-2 gap-4 w-3/5 mt-4">
                  {" "}
                  {/* Adjusted width */}
                  <div className="pl-4">
                    <span className="font-medium text-black">Car Brand</span>
                    <p className="">
                      {request.vehicleDetail?.make || "Unknown"}
                    </p>
                  </div>
                  <div className="w-full">
                    <span className="font-medium text-black">Car Model</span>
                    <p className="">
                      {request.vehicleDetail?.model || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Payment */}
              <div className="text-sm mb-4 space-y-2 w-full text-gray-500">
                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                  <div className="pl-4">
                    <span className="font-medium text-black">
                      Total Payment
                    </span>
                    <p className="font-medium text-black">
                      {request.amount} birr
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right Panel: Details of Selected Request */}
      <div className="md:w-2/3 md:px-10 flex w-full space-y-6 flex-col">
        {selectedRequest ? (
          <>
            {/* Request Summary & Car Details Section */}
            <div className="flex md:flex-row flex-col gap-10">
              <section className="md:w-1/2 w-full md:mt-0 mt-4 bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-lg font-semibold text-[#00113D] mb-8">
                  Request Summary
                </h2>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-sm text-[#00113D]">
                      Request Status
                    </p>
                    <p className="text-sm text-[#5A5A5A]">
                      {selectedRequest.approvedStatus || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#00113D]">
                      Request Date and Time
                    </p>
                    <p className="text-sm text-[#5A5A5A]">
                      {selectedRequest.createdAt
                        ? new Date(selectedRequest.createdAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="w-44 flex justify-center items-center py-2 px-4 text-base rounded-xl bg-[#E9F1FE] text-[#4478EB]">
                    Booking Pending{" "}
                    {/* This seems static, might need adjustment based on actual status */}
                  </div>
                </div>
                <h2 className="text-lg mt-16 mb-4 font-semibold text-[#00113D]">
                  Car Details
                </h2>
                <div className="text-sm space-y-2 w-full text-gray-500">
                  <div className="grid grid-cols-2 gap-4 w-full mt-4">
                    {" "}
                    {/* Adjusted width for full section */}
                    <div>
                      <span className="font-medium text-black">Car Brand</span>
                      <p className="">
                        {selectedRequest.vehicleDetail?.make || "Unknown"}
                      </p>
                    </div>
                    <div className="w-full">
                      <span className="font-medium text-black">Car Model</span>
                      <p className="">
                        {selectedRequest.vehicleDetail?.model || "Unknown"}
                      </p>
                    </div>
                    {/* Add other vehicle details if needed, e.g., Year, Color, etc. */}
                  </div>
                </div>
              </section>

              {/* Rental Details Section */}
              <section className="md:w-1/2 w-full bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-lg font-semibold text-[#00113D] mb-8">
                  Rental Details
                </h2>
                <div className="flex flex-col text-sm text-[#5A5A5A]">
                  <div className="flex items-start gap-2">
                    <div>
                      <p className="flex items-center">
                        <FaRegCircle className="text-gray-400" />
                        <span className="px-4">
                          {selectedRequest.startDate
                            ? new Date(
                                selectedRequest.startDate
                              ).toLocaleString()
                            : "N/A"}
                        </span>
                      </p>
                      <div className="ml-2 px-6 border-l pb-12 border-gray-300">
                        <p className="font-semibold">Pick Up Location</p>
                        <p>
                          {selectedRequest.pickUp?.[0] || "Unknown location"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div>
                      <p className="flex items-center">
                        <FaRegCircle className="text-gray-400" />
                        <span className="px-4">
                          {selectedRequest.endDate
                            ? new Date(selectedRequest.endDate).toLocaleString()
                            : "N/A"}
                        </span>
                      </p>
                      <div className="ml-2 px-6 pb-8">
                        <p className="font-semibold">Drop Off Location</p>
                        <p>
                          {selectedRequest.dropOff?.[0] || "Unknown location"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <span className="font-medium text-black">Driver request</span>
                  <p className="text-gray-500">
                    {selectedRequest.driverRequest ? "Yes" : "No"}{" "}
                    {/* Assuming driverRequest exists */}
                  </p>
                </div>
                {/* Add total amount here for clarity */}
                <div className="mt-4 text-sm">
                  <span className="font-medium text-black">Total Payment</span>
                  <p className="text-gray-500">
                    {selectedRequest.amount || "N/A"} birr
                  </p>
                </div>
              </section>
            </div>

            {/* Rentee Details & Action Buttons Section */}
            <div>
              <section className="h-fit bg-white p-6 space-y-6 rounded-xl shadow-md">
                <h2 className="text-lg font-semibold text-[#00113D] mb-8">
                  Rentee Details
                </h2>
                <div className="items-center flex md:flex-row flex-col gap-8">
                  {/* Always use the fallback image as profile picture key is not available in renteeInfo */}
                  <img
                    src={image}
                    alt="Renter Profile"
                    className="w-32 h-32 rounded-full object-cover"
                    // No need for onError handler as src is always local image now
                  />
                  <div className="grid gap-4 md:grid-cols-2 grid-cols-1 justify-center items-center">
                    {/* Access rentee details directly from renteeInfo */}
                    <h3 className="flex gap-4 text-sm text-[#5A5A5A]">
                      <IoPersonOutline size={18} />
                      {selectedRequest.renteeInfo?.given_name &&
                      selectedRequest.renteeInfo?.family_name
                        ? `${selectedRequest.renteeInfo.given_name} ${selectedRequest.renteeInfo.family_name}`.trim()
                        : "Unknown Rentee"}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
                      <MdOutlineLocalPhone size={18} />
                      {/* Access phone from renteeInfo */}
                      <p>
                        {selectedRequest.renteeInfo?.phone_number || "Unknown"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
                      <MdOutlineMail size={18} />
                      {/* Access email from renteeInfo */}
                      <p>{selectedRequest.renteeInfo?.email || "Unknown"}</p>
                    </div>
                    {/* Address is not available in the provided renteeInfo structure */}
                    <div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
                      <IoLocationOutline size={18} />
                      <p>N/A</p> {/* Address not available in renteeInfo */}
                    </div>
                    <button
                      className="flex items-center gap-2 mt-4 px-16 py-3 text-xs border rounded-full border-[#00113D] text-[#00113D] bg-white hover:bg-[#00113D] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleChatWithRentee(selectedRequest)}
                      disabled={
                        !ownerId ||
                        !selectedRequest?.renteeId ||
                        !selectedRequest?.id // Basic check, renteeInfo existence might be better
                      }
                    >
                      <IoChatboxOutline size={16} />
                      Chat With Rentee
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex text-base gap-4">
                  <button
                    onClick={() => handleRejectRequest(selectedRequest.id)} // Pass the ID
                    className="flex-1 py-2 rounded-full bg-[#FDEAEA] text-red-700 border border-red-700 hover:bg-red-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      !selectedRequest?.id ||
                      selectedRequest.expiresInSeconds <= 0
                      // Could also add || loading if you want to disable during action
                    }
                  >
                    Reject Request
                  </button>
                  <button
                    className="flex-1 py-2 rounded-full bg-[#00113D] text-white hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleApproveRequest(selectedRequest.id)} // Pass the ID
                    disabled={
                      !selectedRequest?.id ||
                      selectedRequest.expiresInSeconds <= 0
                      // Could also add || loading if you want to disable during action
                    }
                  >
                    Approve Request
                  </button>
                </div>
              </section>
            </div>
          </>
        ) : (
          // Message when no request is selected
          <div className="md:w-2/3 w-full bg-white p-6 rounded-xl shadow-md h-[400px] flex justify-center items-center">
            <p className="text-gray-500">
              Select a rental request from the left to see details.
            </p>
          </div>
        )}
        {/* Display action-specific error if any */}
        {error &&
          rentalRequests.length > 0 && ( // Show only if list is populated but an action failed
            <div className="text-red-600 text-center mt-4">Action Error</div>
          )}
      </div>
    </div>
  );
};

export default RentalRequests;
