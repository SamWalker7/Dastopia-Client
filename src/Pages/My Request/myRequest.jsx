import { FaRegCircle } from "react-icons/fa";
import image from "../../images/testimonials/avatar.png"; // Make sure this path is correct
import {
  IoChatboxOutline,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { MdOutlineLocalPhone, MdOutlineMail } from "react-icons/md";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import moment from "moment"; // Using moment for easier date comparison and duration calculation

const MyRequests = () => {
  const navigate = useNavigate();

  const [rentalRequests, setRentalRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carDetailsMap, setCarDetailsMap] = useState({});
  const [ownerDetailsMap, setOwnerDetailsMap] = useState({}); // Use ownerDetailsMap
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // Assuming 'customer' in localStorage is the logged-in user (the rentee in this context)
  const customer = JSON.parse(localStorage.getItem("customer")) || {};
  const accessToken = customer?.AccessToken;

  // The logged-in user's ID (the rentee's ID for these requests)
  const currentUserId = customer?.username || customer?.id;

  // --- Utility functions and derived values ---

  const handleViewDetails = useCallback((request) => {
    console.log("Viewing details for request:", request.id);
    setSelectedRequest(request);
    setPaymentError(null); // Clear any previous payment error when changing requests
  }, []); // Dependencies: None needed for setting state directly

  const formatDateAndTime = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date value");
      }
      return moment(date).format("YYYY-MM-DD HH:mm");
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "N/A";
    }
  }, []); // Dependencies: None

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date value");
      }
      return moment(date).format("YYYY-MM-DD");
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "N/A";
    }
  }, []); // Dependencies: None

  const isRequestExpired = useCallback((createdAt, approvedStatus) => {
    // Only pending requests can expire after 24 hours
    if (approvedStatus?.toLowerCase()?.trim() !== "pending" || !createdAt) {
      return false;
    }
    try {
      const requestDate = moment(createdAt);
      const twentyFourHoursAgo = moment().subtract(24, "hours");
      return requestDate.isBefore(twentyFourHoursAgo);
    } catch (e) {
      console.error("Error checking request expiration:", createdAt, e);
      return false; // Default to not expired if date is invalid or calculation fails
    }
  }, []); // Dependencies: None (moment is global/imported)

  // --- Utility function for status display ---
  // Placed relatively high so it can be used by other functions/callbacks
  const getStatusDisplay = useCallback(
    (request) => {
      const status = request.approvedStatus?.toLowerCase()?.trim();
      const paidStatus = request.isPayed?.toLowerCase()?.trim();
      const expired = isRequestExpired(request.createdAt, status); // Uses isRequestExpired

      // Prioritize expired status for pending requests
      if (expired) {
        return {
          text: "Expired",
          bgColor: "bg-red-100",
          textColor: "text-red-600",
          isExpired: true,
          key: "expired",
        };
      }

      if (status === "pending") {
        // Already handled by 'expired' check if > 24h
        // Otherwise, it's pending and not expired
        return {
          text: "Waiting for Approval",
          bgColor: "bg-[#E9F1FE]",
          textColor: "text-[#4478EB]",
          isPending: true,
          key: "pending",
        };
      }

      // Now check approved states
      if (status === "approved") {
        if (paidStatus === "success") {
          return {
            text: "Approved (Paid)",
            bgColor: "bg-green-100",
            textColor: "text-green-600",
            isApprovedPaid: true,
            key: "approved-paid",
          };
        }

        if (paidStatus === "pending") {
          // This is the "Payment Pending" case. Check the start date.
          // Ensure start date is valid before comparing
          const startDateMoment = moment(request.startDate);
          const now = moment();

          // If start date is valid and it's BEFORE the current moment
          if (startDateMoment.isValid() && startDateMoment.isBefore(now)) {
            return {
              text: "Payment Missed (Start Date Passed)", // More specific text
              bgColor: "bg-red-100", // Use red to indicate issue
              textColor: "text-red-700",
              isPastStartDatePaymentDue: true, // New flag for specific handling
              key: "payment-missed-past-start",
            };
          } else {
            // Start date is not in the past, it's genuinely payment pending
            return {
              text: "Payment Pending",
              bgColor: "bg-yellow-100",
              textColor: "text-yellow-700",
              isPaymentPending: true, // Keep this flag for the "Pay Now" button
              key: "payment-pending",
            };
          }
        }
        // Handle other 'approved' paidStatus values if any
        return {
          text: `Approved (Payment: ${paidStatus || "Unknown"})`,
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          isOtherApproved: true,
          key: "approved-other-payment",
        };
      }

      // Check rejected
      if (status === "rejected") {
        return {
          text: "Rejected",
          bgColor: "bg-red-100",
          textColor: "text-red-600",
          isRejected: true,
          key: "rejected",
        };
      }

      // Check cancelled
      if (status === "cancelled") {
        return {
          text: "Cancelled",
          bgColor: "bg-gray-100", // Or maybe yellow/red depending on who cancelled
          textColor: "text-gray-600", // Or specific color
          isCancelled: true,
          key: "cancelled",
        };
      }

      // Default for unknown status
      return {
        text: status || "Unknown Status",
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        isOther: true,
        key: "unknown",
      };
    },
    [isRequestExpired] // Dependency on isRequestExpired
  );

  // --- Data Fetching functions ---
  // Modified to fetch car and owner details
  const fetchCarAndOwnerDetails = useCallback(
    async (vehicleID) => {
      if (!vehicleID || !accessToken) return { car: null, owner: null };
      try {
        const response = await fetch(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/getCarInfo/${vehicleID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          console.error(
            `Error fetching car ${vehicleID}: HTTP error! status: ${response.status}`
          );
          return { car: null, owner: null };
        }
        const data = await response.json();
        const carData = data.body || data;

        // Extract owner details from the car response
        const ownerData = {
          id: carData?.owenerId, // Note the typo 'owenerId' from the payload
          name:
            carData?.ownerGivenName && carData?.ownerSurName
              ? `${carData.ownerGivenName} ${carData.ownerSurName}`.trim()
              : "N/A",
          phone: carData?.ownerPhone || "N/A",
          email: carData?.ownerEmail || "N/A",
          // No address or profile picture in this specific car payload for the owner
          profilePicture: null, // Placeholder
          given_name: carData?.ownerGivenName || "",
          family_name: carData?.ownerSurName || "",
        };

        // Return both car and owner data
        return {
          car: carData ? { [vehicleID]: carData } : {},
          owner: ownerData.id ? { [ownerData.id]: ownerData } : {},
        };
      } catch (error) {
        console.error(`Error fetching car ${vehicleID}:`, error);
        return { car: null, owner: null };
      }
    },
    [accessToken] // Dependency on accessToken
  );

  const fetchRentalRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    setRentalRequests([]);
    setCarDetailsMap({}); // Clear maps on fresh fetch
    setOwnerDetailsMap({}); // Clear maps on fresh fetch
    setSelectedRequest(null); // Clear selection

    if (!accessToken) {
      setError("Authentication failed: Please log in again.");
      setLoading(false);
      return;
    }

    try {
      // This endpoint fetches bookings where the logged-in user is the 'rentee'
      const response = await fetch(
        "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/get_all_rentee_booking",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Requests fetch HTTP error:", response.status, errorBody);
        // Attempt to parse JSON error if available, otherwise use status text
        let userMessage = `Failed to fetch requests: ${response.statusText}`;
        try {
          const errorJson = JSON.parse(errorBody);
          if (errorJson.message) userMessage = errorJson.message;
          else if (errorJson.error) userMessage = errorJson.error;
        } catch (e) {
          /* ignore parse error */
        }
        throw new Error(userMessage);
      }

      const data = await response.json();
      let requests = Array.isArray(data.body) ? data.body : [];

      // We only want requests that are 'pending', 'approved' with 'pending' payment, 'rejected', or 'cancelled'
      // We filter out approved+success payment as they are completed and no longer require action from the rentee
      const relevantRequests = requests.filter(
        (req) =>
          req.approvedStatus?.toLowerCase() !== "approved" ||
          req.isPayed?.toLowerCase() !== "success"
      );

      // Optional: Sort requests by creation date descending
      relevantRequests.sort(
        (a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
      );

      const carIds = [
        ...new Set(relevantRequests.map((req) => req.carId).filter(Boolean)),
      ];

      // Fetch car and owner details for all unique car IDs in parallel
      const detailResults = await Promise.all(
        carIds.map((id) => fetchCarAndOwnerDetails(id))
      );

      const fetchedCarDetails = {};
      const fetchedOwnerDetails = {};

      detailResults.forEach((result) => {
        if (result?.car) {
          Object.assign(fetchedCarDetails, result.car);
        }
        if (result?.owner) {
          Object.assign(fetchedOwnerDetails, result.owner);
        }
      });

      // Update states in one go
      setRentalRequests(relevantRequests);
      setCarDetailsMap(fetchedCarDetails);
      setOwnerDetailsMap(fetchedOwnerDetails); // Use ownerDetailsMap
    } catch (err) {
      setError(err.message);
      console.error("Error fetching rental requests:", err);
      setRentalRequests([]);
      setCarDetailsMap({});
      setOwnerDetailsMap({}); // Clear owner map on error
      setSelectedRequest(null);
    } finally {
      setLoading(false);
    }
  }, [accessToken, fetchCarAndOwnerDetails]); // Dependency on accessToken, fetchCarAndOwnerDetails

  // --- Effects ---
  useEffect(() => {
    fetchRentalRequests();
  }, [fetchRentalRequests]); // Dependency on fetchRentalRequests

  useEffect(() => {
    // Auto-select the first request if the list loads and has items, and nothing is selected
    // If the previously selected request is no longer in the list, deselect and re-select the first.
    if (!loading && rentalRequests.length > 0) {
      if (
        selectedRequest === null ||
        !rentalRequests.some((req) => req.id === selectedRequest.id)
      ) {
        console.log(
          `Auto-selecting first request: ${rentalRequests[0]?.id}. Previous selected: ${selectedRequest?.id}`
        );
        setSelectedRequest(rentalRequests[0]);
      }
    } else if (
      !loading &&
      rentalRequests.length === 0 &&
      selectedRequest !== null
    ) {
      // Deselect if the list becomes empty while a request was selected
      console.log("Rental list is empty, deselecting current request.");
      setSelectedRequest(null);
    }
    // Note: Adding selectedRequest to dependency array here causes an infinite loop
    // because setting selectedRequest inside this effect triggers the effect again.
    // The logic is designed to run only when loading or rentalRequests change,
    // handling selection/deselection based on the *new* state.
  }, [loading, rentalRequests]); // Dependencies: loading, rentalRequests

  // --- Action Handlers ---
  // handlePayNow can now access getStatusDisplay because it's declared above it
  const handlePayNow = useCallback(async () => {
    if (!selectedRequest?.id) {
      console.error("Pay Now Error: No selected request ID.");
      setPaymentError("Cannot initiate payment: Request details missing.");
      return;
    }
    // Get the current status display *inside* the callback
    const status = getStatusDisplay(selectedRequest);
    // Check if status is genuinely payment pending AND not expired
    if (!status.isPaymentPending || status.isExpired) {
      console.warn(
        "Attempted to pay for a request not in 'Payment Pending' status or is expired:",
        selectedRequest.id,
        status.text
      );
      // Provide a user-friendly error if the status is not valid for payment
      const errorMsg = status.isExpired
        ? "Cannot pay: The request has expired."
        : status.isPastStartDatePaymentDue
        ? "Cannot pay: The rental start date has passed."
        : `Cannot pay: Current status is "${status.text}".`;
      setPaymentError(errorMsg);
      return;
    }

    if (!accessToken) {
      console.error("Pay Now Error: Access token missing.");
      setPaymentError("Authentication failed. Please log in again.");
      return;
    }

    setIsInitiatingPayment(true);
    setPaymentError(null); // Clear previous errors

    try {
      const response = await fetch(
        `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/checkout/${selectedRequest.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(
          `Checkout API error for ID ${selectedRequest.id}:`,
          response.status,
          errorBody
        );
        let errorMessage = `Failed to initiate payment: ${response.statusText}`;
        try {
          const errorJson = JSON.parse(errorBody);
          if (errorJson.message) {
            errorMessage = errorJson.message;
          } else if (errorJson.error) {
            errorMessage = errorJson.error;
          }
        } catch (parseError) {
          console.error("Failed to parse error body:", parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.body) {
        console.log("Redirecting to payment URL:", data.body);
        // Redirect the user - state is lost here, subsequent actions depend on the return page
        window.location.href = data.body;
      } else {
        console.error("Checkout API response missing URL:", data);
        throw new Error("Payment URL not received from the server.");
      }
    } catch (err) {
      console.error("Error initiating payment:", err);
      setPaymentError(err.message);
      setIsInitiatingPayment(false); // Turn off loading on error
    }
    // No finally block turning off loading, assuming redirect happens on success
  }, [accessToken, selectedRequest, getStatusDisplay]); // Dependencies: accessToken, selectedRequest (for id), getStatusDisplay

  // Renamed and modified handler for chatting with the car owner
  // Now fetches necessary details *inside* the callback using state variables
  // Removed selectedCarDetails from dependencies
  const handleChatWithOwner = useCallback(() => {
    // Ensure selectedRequest exists before proceeding
    if (!selectedRequest) {
      console.error("Chat Error: No request selected.");
      alert("Please select a request to chat.");
      return;
    }

    const carId = selectedRequest.carId;
    const bookingId = selectedRequest.id;

    // Get car details and owner ID from the map
    const carDetails = carDetailsMap[carId]; // Access carDetailsMap state
    const ownerId = carDetails?.owenerId; // Get owner ID from car details

    // Get owner details from the map
    const ownerDetails = ownerDetailsMap[ownerId]; // Access ownerDetailsMap state

    const ownerGivenName = ownerDetails?.given_name || "Unknown";
    const ownerFamilyName = ownerDetails?.family_name || "";

    const currentLoggedInUserId = currentUserId; // This user (the rentee)

    if (!currentLoggedInUserId) {
      console.error("Chat Error: Your user ID (rentee ID) not found.");
      alert("Your user ID is missing. Cannot initiate chat.");
      return;
    }
    if (!ownerId) {
      console.error("Chat Error: Owner ID not found for this car.");
      alert("Car owner details missing. Cannot initiate chat.");
      return;
    }
    if (!ownerDetails) {
      console.warn(
        "Chat Warning: Owner details not fully loaded, proceeding with chat ID."
      );
    }
    if (!bookingId) {
      console.warn("Chat Warning: Booking ID not found.");
    }
    if (!carId) {
      console.warn("Chat Warning: Vehicle ID not found.");
    }

    // Construct chat URL - userId1 is the logged-in user (rentee), userId2 is the owner
    const chatUrl =
      `/chat?userId1=${encodeURIComponent(currentLoggedInUserId || "")}` +
      `&userId2=${encodeURIComponent(ownerId || "")}` + // Use ownerId here
      `&bookingId=${encodeURIComponent(bookingId || "")}` +
      `&carId=${encodeURIComponent(carId || "")}` +
      `&otherUserGivenName=${encodeURIComponent(ownerGivenName || "")}` + // Use owner's name
      `&otherUserFamilyName=${encodeURIComponent(ownerFamilyName || "")}`; // Use owner's name

    console.log(
      `Navigating to chat: Rentee ID=${currentLoggedInUserId}, Owner ID=${ownerId}, Booking ID=${bookingId}, Car ID=${carId}`
    );

    navigate(chatUrl);
  }, [
    navigate,
    selectedRequest,
    carDetailsMap,
    ownerDetailsMap,
    currentUserId,
  ]); // Dependencies: hooks and state used inside

  // --- Derived values used for rendering ---
  // These are calculated using state and are needed for the JSX below.
  // Declare them here, after state and useCallback hooks, but before return.
  // This is the correct place for these variables.
  const selectedCarDetails = carDetailsMap[selectedRequest?.carId];
  const selectedOwnerDetails = ownerDetailsMap[selectedCarDetails?.owenerId]; // Use ownerDetailsMap
  const selectedRequestStatus = selectedRequest
    ? getStatusDisplay(selectedRequest)
    : null;
  const isSelectedRequestExpired = selectedRequestStatus?.isExpired;
  // New flag for the "Payment Missed (Start Date Passed)" status
  const isPastStartDatePaymentDue =
    selectedRequestStatus?.isPastStartDatePaymentDue;

  // --- Calculate Total Amount and Duration for Display ---
  const { calculatedTotalAmount, rentalDurationText } = useMemo(() => {
    let calculatedTotalAmount = "N/A";
    let rentalDurationText = "N/A";

    // Calculate only if a request is selected and has necessary data
    if (
      selectedRequest &&
      selectedRequest.startDate &&
      selectedRequest.endDate &&
      selectedRequest.amount !== undefined &&
      selectedRequest.amount !== null
    ) {
      try {
        const startDateMoment = moment(selectedRequest.startDate);
        const endDateMoment = moment(selectedRequest.endDate);
        const amount = parseFloat(selectedRequest.amount); // Ensure amount is a number

        // Check for valid dates and a positive, valid amount
        if (
          startDateMoment.isValid() &&
          endDateMoment.isValid() &&
          amount >= 0 &&
          !isNaN(amount)
        ) {
          // Calculate duration inclusive of start and end day
          const durationInDays =
            endDateMoment.diff(startDateMoment, "days") + 1;

          if (durationInDays > 0) {
            // Calculate total only if duration is positive
            calculatedTotalAmount = `${(amount * durationInDays).toFixed(2)}`;
            rentalDurationText = `${durationInDays} Day${
              durationInDays !== 1 ? "s" : ""
            }`;
          } else if (durationInDays === 0 && amount > 0) {
            // Handle same start/end date, treat as 1 day
            calculatedTotalAmount = `${amount.toFixed(2)}`; // Amount for 1 day
            rentalDurationText = `1 Day`;
          } else {
            // Handle zero amount or invalid duration calculation results
            calculatedTotalAmount = "Invalid Calculation";
            rentalDurationText = "Invalid Dates";
          }
        } else {
          // Handle invalid amount or dates from the source data
          calculatedTotalAmount = "Invalid Data";
          rentalDurationText = "Invalid Data";
        }
      } catch (e) {
        console.error("Error calculating total amount or duration:", e);
        calculatedTotalAmount = "Calculation Error";
        rentalDurationText = "Error";
      }
    }

    return { calculatedTotalAmount, rentalDurationText };
  }, [selectedRequest]); // Recalculate whenever the selected request changes

  // --- Render Logic ---

  // MODIFIED: Loading state condition - Show full loader only if no requests AND still loading
  if (loading && rentalRequests.length === 0) {
    return (
      <div className="flex justify-center md:pt-40 p-8 bg-[#F8F8FF] min-h-screen">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-semibold text-[#00113D] mb-4">
            Loading your requests...
          </h2>
          <div className="animate-pulse space-y-4 max-w-sm mx-auto">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show full error screen only if no requests were loaded AND there's an error
  if (error && rentalRequests.length === 0) {
    return (
      <div className="flex justify-center md:pt-40 p-8 bg-[#F8F8FF] min-h-screen">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            Error Loading Requests
          </h2>
          <p className="text-lg text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchRentalRequests}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  // Show empty state if list is loaded (not loading) and has no items
  if (!loading && rentalRequests.length === 0 && selectedRequest === null) {
    return (
      <div className="flex justify-center md:pt-40 p-8 bg-[#F8F8FF] min-h-screen">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-semibold text-[#00113D] mb-4">
            My Requests
          </h2>
          <p className="text-lg text-gray-600">
            You have no active or pending rental requests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row  justify-center md:pt-20 p-4 md:p-8 bg-[#F8F8FF] min-h-screen gap-10">
      {/* Left Panel: Request List */}
      <div className="w-full md:w-1/3 h-fit md:scale-90 bg-white p-4 md:p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#00113D]">
          My Requests
        </h2>

        {/* Show loading indicator specifically for the list if it's fetching data but already has some */}
        {loading && rentalRequests.length > 0 && (
          <div className="flex justify-center items-center p-4">
            <svg
              className="animate-spin h-8 w-8 text-[#00113D]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
        {/* Show error message for the list if loading failed but it's not the initial load */}
        {error && rentalRequests.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm mt-2">
            Error updating requests: {error}
          </div>
        )}

        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          {rentalRequests.map((request) => {
            // Use request.id as key
            const statusDisplay = getStatusDisplay(request); // Uses getStatusDisplay
            // Get car details for display in the list item
            const listItemCarDetails = carDetailsMap[request.carId];

            return (
              <div
                key={request.id}
                className={`p-4 space-y-2 rounded-lg shadow-md cursor-pointer transition-all ${
                  selectedRequest?.id === request.id
                    ? "border-2 border-[#00113D] bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleViewDetails(request)}
              >
                <div className="text-lg space-y-2 w-full text-gray-500">
                  <div className="grid grid-cols-2 gap-4 w-full mt-2">
                    <div className="pl-2">
                      <label className="font-medium text-black">
                        Car Brand
                      </label>
                      <p className="truncate text-sm md:text-base">
                        {listItemCarDetails?.make ||
                          listItemCarDetails?.brand ||
                          "Unavailable"}
                      </p>
                    </div>
                    <div className="w-full">
                      <label className="font-medium text-black">
                        Car Model
                      </label>
                      <p className="truncate text-sm md:text-base">
                        {listItemCarDetails?.model || "Unavailable"}
                      </p>
                    </div>
                    <div className="pl-2">
                      <label className="font-medium text-black">
                        Request Date
                      </label>
                      <p className="truncate text-sm md:text-base">
                        {formatDateAndTime(request.createdAt)}
                      </p>
                    </div>
                    <div className="w-full">
                      <label className="font-medium text-black">
                        Rent Duration
                      </label>
                      <p className="truncate text-sm md:text-base">
                        {formatDate(request.startDate)} -{" "}
                        {formatDate(request.endDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div>
                    <label className="font-medium text-black">Status</label>
                    <div
                      className={`w-fit px-3 py-1 text-sm rounded-xl font-semibold mt-1 ${statusDisplay.bgColor} ${statusDisplay.textColor}`}
                    >
                      {statusDisplay.text}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel: Details */}
      <div className="w-full md:scale-90 md:w-2/3 space-y-4">
        {/* Render right panel only if selectedRequest is not null */}
        {selectedRequest ? (
          <>
            <div className="flex flex-col md:flex-row gap-8">
              <section className="w-full md:w-1/2 bg-white p-4 md:p-6 rounded-xl shadow-md">
                <h2 className="text-xl md:text-2xl font-semibold text-[#00113D] mb-4">
                  Request Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-8">
                    <div>
                      <label className="font-medium text-[#00113D]">
                        Current Status
                      </label>
                      {/* Use selectedRequestStatus here */}
                      <div
                        key={selectedRequestStatus?.key}
                        className={`w-fit px-3 py-1 text-sm rounded-xl font-semibold mt-1 ${selectedRequestStatus?.bgColor} ${selectedRequestStatus?.textColor}`}
                      >
                        {selectedRequestStatus?.text}
                      </div>
                    </div>
                    <div>
                      <label className="font-medium text-[#00113D]">
                        Request Date
                      </label>
                      <p className="text-[#5A5A5A] text-sm md:text-base">
                        {formatDateAndTime(selectedRequest.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Display expiration message if applicable */}
                  {isSelectedRequestExpired && ( // Uses isSelectedRequestExpired
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                      <p className="font-medium text-sm md:text-base">
                        This pending request has expired.
                      </p>
                    </div>
                  )}

                  {/* Display message if payment is pending but start date has passed */}
                  {isPastStartDatePaymentDue && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                      <p className="font-medium text-sm md:text-base">
                        Payment was pending, but the rental start date has
                        passed. You cannot proceed with payment for this
                        request. Please contact the owner if needed.
                      </p>
                    </div>
                  )}
                </div>

                <h2 className="text-xl md:text-2xl mt-8 mb-4 font-semibold text-[#00113D]">
                  Car Details
                </h2>

                {selectedCarDetails ? ( // Uses selectedCarDetails
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
                      <div>
                        <label className="font-medium text-black">Brand</label>
                        <p>
                          {selectedCarDetails.make ||
                            selectedCarDetails.brand ||
                            "Unavailable"}
                        </p>
                      </div>
                      <div>
                        <label className="font-medium text-black">Model</label>
                        <p>{selectedCarDetails.model || "Unavailable"}</p>
                      </div>
                      <div>
                        <label className="font-medium text-black">Year</label>
                        {/* Assuming 'year' from API is a date string, display year part */}
                        <p>
                          {selectedCarDetails.year
                            ? moment(selectedCarDetails.year).format("YYYY")
                            : "Unavailable"}
                        </p>
                      </div>
                      <div>
                        <label className="font-medium text-black">
                          Plate Number
                        </label>
                        <p>{selectedCarDetails.plateNumber || "Unavailable"}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="font-medium text-black">Color</label>
                        <p>{selectedCarDetails.color || "Unavailable"}</p>
                      </div>
                    </div>
                  </div>
                ) : loading && rentalRequests.length > 0 ? (
                  <div className="flex items-center gap-2 text-gray-500 text-sm md:text-base">
                    <svg
                      className="animate-spin h-4 w-4 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading car details...
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm md:text-base">
                    Car details not available.
                  </div>
                )}
              </section>

              <section className="w-full md:w-1/2 bg-white p-4 md:p-6 rounded-xl shadow-md">
                <h2 className="text-xl md:text-2xl font-semibold text-[#00113D] mb-4">
                  Rental Details
                </h2>

                <div className="space-y-6 text-sm md:text-base">
                  <div className="flex flex-col">
                    <div className="flex items-start gap-2">
                      <FaRegCircle className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">
                          Pick-up: {formatDate(selectedRequest.startDate)}
                        </p>
                        <div className="ml-4 pl-4 border-l border-gray-300 my-2">
                          <p className="font-semibold">
                            {selectedRequest.pickUp?.[0] ||
                              "Location not specified"}
                          </p>
                          {selectedRequest.pickUpNotes && (
                            <p className="text-sm text-gray-500 mt-1">
                              Notes: {selectedRequest.pickUpNotes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 mt-4">
                      <FaRegCircle className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">
                          Drop-off: {formatDate(selectedRequest.endDate)}
                        </p>
                        <div className="ml-4 pl-4 my-2">
                          <p className="font-semibold">
                            {selectedRequest.dropOff?.[0] ||
                              "Location not specified"}
                          </p>
                          {selectedRequest.dropOffNotes && (
                            <p className="text-sm text-gray-500 mt-1">
                              Notes: {selectedRequest.dropOffNotes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Display Calculated Duration */}
                  <div>
                    <label className="font-medium text-black">
                      Rental Duration
                    </label>
                    <p className="text-[#5A5A5A] mt-1">{rentalDurationText}</p>
                  </div>

                  {/* Display Amount Per Day (from API) */}
                  <div>
                    <label className="font-medium text-black">
                      Amount Per Day
                    </label>
                    <p className="text-[#5A5A5A] mt-1">
                      {selectedRequest.amount !== undefined &&
                      selectedRequest.amount !== null &&
                      !isNaN(parseFloat(selectedRequest.amount))
                        ? `${parseFloat(selectedRequest.amount).toFixed(2)}`
                        : "N/A"}{" "}
                      Birr
                    </p>
                  </div>

                  {/* Display Calculated Total Amount */}
                  <div>
                    <label className="font-medium text-black">
                      Total Estimated Amount
                    </label>
                    <p className="text-[#5A5A5A] mt-1 font-semibold text-base md:text-lg">
                      {calculatedTotalAmount} Birr
                    </p>
                  </div>

                  <div>
                    <label className="font-medium text-black">
                      Special Requests
                    </label>
                    <p className="text-gray-500 mt-1">
                      {selectedRequest.specialRequests || "None"}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Renamed from Rentee Details to Owner Details */}
            <section className="bg-white p-4 md:p-6 rounded-xl shadow-md">
              <h2 className="text-xl md:text-2xl font-semibold text-[#00113D] mb-4">
                Car Owner Details
              </h2>

              {selectedOwnerDetails ? ( // Uses selectedOwnerDetails
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  {/* Placeholder for owner profile picture as it's not in the car payload */}
                  <img
                    src={image} // Using generic avatar
                    alt="Owner Profile"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = image;
                    }}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 text-sm md:text-base w-full md:w-auto">
                    <div className="flex items-center gap-3">
                      <IoPersonOutline
                        size={18}
                        className="text-gray-500 flex-shrink-0"
                      />
                      <div>
                        <label className="font-medium text-black">Name</label>
                        <p className="text-gray-600">
                          {selectedOwnerDetails.name || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MdOutlineLocalPhone
                        size={18}
                        className="text-gray-500 flex-shrink-0"
                      />
                      <div>
                        <label className="font-medium text-black">Phone</label>
                        <p className="text-gray-600">
                          {selectedOwnerDetails.phone || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MdOutlineMail
                        size={18}
                        className="text-gray-500 flex-shrink-0"
                      />
                      <div>
                        <label className="font-medium text-black">Email</label>
                        <p className="text-gray-600">
                          {selectedOwnerDetails.email || "N/A"}
                        </p>
                      </div>
                    </div>
                    {/* Address is not available for owner in the provided payload, omit */}
                  </div>

                  <div className="w-full md:w-auto flex justify-center md:justify-start">
                    {/* Use handleChatWithOwner */}
                    <button
                      className="flex items-center gap-2 px-6 py-3 text-base border rounded-full border-[#00113D] text-[#00113D] bg-white hover:bg-[#00113D] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto justify-center"
                      onClick={handleChatWithOwner} // Correct handler
                      // Check that selectedRequest, ownerId, and currentUserId exist
                      disabled={
                        !selectedRequest ||
                        !selectedOwnerDetails?.id ||
                        !currentUserId
                      }
                    >
                      <IoChatboxOutline size={16} />
                      Chat With Owner
                    </button>
                  </div>
                </div>
              ) : loading && rentalRequests.length > 0 ? (
                <div className="flex items-center gap-2 text-gray-500 text-sm md:text-base">
                  <svg
                    className="animate-spin h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading owner details...
                </div>
              ) : (
                <div className="text-gray-500 text-sm md:text-base">
                  Car owner details not available.
                </div>
              )}

              {/* Action Buttons Area */}
              <div className="flex flex-col gap-4 mt-6">
                {/* Pay Now button displayed only if status is Payment Pending AND not expired AND NOT past start date */}
                {selectedRequestStatus?.isPaymentPending &&
                  !isSelectedRequestExpired &&
                  !isPastStartDatePaymentDue && ( // Uses selectedRequestStatus, isSelectedRequestExpired, isPastStartDatePaymentDue
                    <>
                      <button
                        onClick={handlePayNow} // Uses handlePayNow
                        className="w-full py-3 rounded-full bg-[#00113D] text-white hover:bg-[#1a3263] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        // Disabled if initiating payment or request ID is missing, OR status is not genuinely payment pending
                        disabled={
                          isInitiatingPayment ||
                          !selectedRequest?.id ||
                          !selectedRequestStatus?.isPaymentPending
                        }
                      >
                        {isInitiatingPayment
                          ? "Initiating Payment..."
                          : "Pay Now"}
                      </button>
                      {paymentError && (
                        <p className="text-red-600 text-sm text-center">
                          {paymentError}
                        </p>
                      )}
                    </>
                  )}
                {/* No Pay Now button if status is Expired, Past Start Date Payment Due, Pending, Approved (Paid), Rejected, or Cancelled */}
              </div>
            </section>
          </>
        ) : (
          // Message when requests are loaded but none is selected
          !loading &&
          rentalRequests.length > 0 && (
            <div className="flex flex-col w-full items-center justify-center text-center py-16 bg-white rounded-xl shadow-md">
              <Typography variant="h6" color="text.secondary">
                Select a request from the left panel to view details.
              </Typography>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MyRequests;
