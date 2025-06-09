import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaRegCircle } from "react-icons/fa";
import image from "../../images/testimonials/avatar.png"; // Ensure this path is correct
import {
  IoChatboxOutline,
  IoFileTray,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { MdOutlineLocalPhone, MdOutlineMail } from "react-icons/md";
// import useVehicleFormStore from "../../store/useVehicleFormStore"; // Assuming this is needed
import { useNavigate } from "react-router-dom";
import moment from "moment";

const formatExpiryTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "Expired";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60); // Ensure 's' is integer
  return [h, m, s].map((unit) => String(unit).padStart(2, "0")).join(":");
};

const MyRequests = () => {
  const navigate = useNavigate();
  // const { apiCallWithRetry } = useVehicleFormStore();

  const [rentalRequests, setRentalRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carDetailsMap, setCarDetailsMap] = useState({});
  const [ownerDetailsMap, setOwnerDetailsMap] = useState({});
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // --- NEW STATE for live countdown ---
  const [currentTime, setCurrentTime] = useState(moment());

  const customer = JSON.parse(localStorage.getItem("customer")) || {};
  const accessToken = customer?.AccessToken;
  const currentUserId = customer?.username || customer?.id;

  const apiCallWithRetry = useCallback(async (url, options) => {
    const response = await fetch(url, options);
    if (!response.ok && response.status !== 404) {
      const errorBody = await response.text();
      let message = `HTTP error! status: ${response.status}`;
      try {
        const jsonData = JSON.parse(errorBody);
        message = jsonData.message || jsonData.error || message;
      } catch (e) {
        /* ignore */
      }
      throw new Error(message);
    }
    if (response.status === 404)
      return { ok: false, status: 404, json: async () => ({}) };
    return {
      ok: true,
      status: response.status,
      json: async () => response.json(),
      text: async () => response.text(),
    };
  }, []);

  // --- Effect for the live timer ---
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(moment());
    }, 1000); // Update every second

    return () => clearInterval(timerId); // Cleanup on unmount
  }, []);

  const handleViewDetails = useCallback((request) => {
    setSelectedRequest(request);
    setPaymentError(null);
  }, []);

  const formatDateAndTime = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      return moment(dateString).format("MMM DD, YYYY HH:mm");
    } catch (e) {
      return "N/A";
    }
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      return moment(dateString).format("MMM DD, YYYY");
    } catch (e) {
      return "N/A";
    }
  }, []);

  // This function now calculates remaining seconds based on current time
  const calculateLiveExpiresInSeconds = useCallback(
    (createdAt) => {
      if (!createdAt) return 0;
      try {
        const requestMoment = moment(createdAt);
        const expiryMoment = requestMoment.add(24, "hours");
        // Use the currentTime state for live calculation
        const diffSeconds = expiryMoment.diff(currentTime, "seconds");
        return Math.max(0, diffSeconds);
      } catch (e) {
        return 0;
      }
    },
    [currentTime]
  ); // Dependency on currentTime

  const isRequestActuallyExpired = useCallback(
    (liveExpiresInSeconds, approvedStatus) => {
      return (
        approvedStatus?.toLowerCase() === "pending" && liveExpiresInSeconds <= 0
      );
    },
    []
  );

  const getStatusDisplay = useCallback(
    (request, liveCurrentTime) => {
      // Pass liveCurrentTime for calculation
      const status = request.approvedStatus?.toLowerCase()?.trim();
      const paidStatus = request.isPayed?.toLowerCase()?.trim();
      // Calculate live expiry based on the passed currentTime
      const liveExpiresIn = calculateLiveExpiresInSeconds(request.createdAt);
      const isExpired = isRequestActuallyExpired(liveExpiresIn, status);

      if (isExpired)
        return {
          text: "Expired",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          isActionable: false,
          isExpired: true,
          liveExpiresIn,
          key: "expired",
        };
      if (status === "pending")
        return {
          text: "Approval Pending",
          bgColor: "bg-blue-100",
          textColor: "text-blue-600",
          isActionable: true,
          isPending: true,
          liveExpiresIn,
          key: "pending",
        };
      if (status === "approved") {
        if (paidStatus === "success")
          return {
            text: "Paid & Confirmed",
            bgColor: "bg-green-100",
            textColor: "text-green-600",
            isActionable: false,
            liveExpiresIn,
            key: "approved-paid",
          };
        if (paidStatus === "pending") {
          const startDateMoment = moment(request.startDate);
          if (
            startDateMoment.isValid() &&
            startDateMoment.isBefore(liveCurrentTime)
          )
            return {
              text: "Payment Window Missed",
              bgColor: "bg-orange-100",
              textColor: "text-orange-700",
              isActionable: false,
              isPastStartDatePaymentDue: true,
              liveExpiresIn,
              key: "payment-missed",
            };
          return {
            text: "Payment Due",
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-700",
            isActionable: true,
            isPaymentPending: true,
            liveExpiresIn,
            key: "payment-pending",
          };
        }
        return {
          text: `Approved (Pay: ${paidStatus || "N/A"})`,
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          isActionable: false,
          liveExpiresIn,
          key: "approved-other",
        };
      }
      if (status === "rejected")
        return {
          text: "Rejected by Owner",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          isActionable: false,
          liveExpiresIn,
          key: "rejected",
        };
      if (status === "cancelled")
        return {
          text: "Cancelled",
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          isActionable: false,
          liveExpiresIn,
          key: "cancelled",
        };
      return {
        text: status || "Unknown",
        bgColor: "bg-gray-100",
        textColor: "text-gray-500",
        isActionable: false,
        liveExpiresIn,
        key: "unknown",
      };
    },
    [isRequestActuallyExpired, calculateLiveExpiresInSeconds] // Dependencies
  );

  const fetchCarAndOwnerDetails = useCallback(
    async (vehicleID) => {
      if (!vehicleID || !accessToken) return { car: null, owner: null };
      try {
        const response = await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/getCarInfo/${vehicleID}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (!response.ok) {
          console.error(`Error car ${vehicleID}: ${response.status}`);
          return { car: null, owner: null };
        }

        const data = await response.json();
        const carData = data.body || data;

        if (!carData || Object.keys(carData).length === 0) {
          console.warn(`No car data found for vehicleID: ${vehicleID}`);
          return { car: null, owner: null };
        }

        const ownerData = {
          id: carData?.owenerId,
          name:
            `${carData?.ownerGivenName || ""} ${
              carData?.ownerSurName || ""
            }`.trim() || "N/A",
          phone: carData?.ownerPhone || "N/A",
          email: carData?.ownerEmail || "N/A",
          profilePicture: null,
          given_name: carData?.ownerGivenName || "",
          family_name: carData?.ownerSurName || "",
        };
        return {
          car: { [vehicleID]: carData },
          owner: ownerData.id ? { [ownerData.id]: ownerData } : {},
        };
      } catch (error) {
        console.error(`Fetch car ${vehicleID} error:`, error);
        return { car: null, owner: null };
      }
    },
    [accessToken, apiCallWithRetry]
  );

  const fetchRentalRequests = useCallback(async () => {
    setLoading(true);
    setError(null); // Don't clear rentalRequests here to avoid flicker

    // Clear maps only if not just refreshing an existing list
    if (rentalRequests.length === 0) {
      setCarDetailsMap({});
      setOwnerDetailsMap({});
      setSelectedRequest(null);
    }

    if (!accessToken) {
      setError("Authentication failed.");
      setLoading(false);
      return;
    }

    try {
      const response = await apiCallWithRetry(
        "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/get_all_rentee_booking",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (!response.ok) {
        const errorText = await response
          .text()
          .catch(() => "Unknown error fetching requests");
        let userMessage = `Failed to fetch requests: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          userMessage = errorJson.message || errorJson.error || userMessage;
        } catch (e) {
          /* ignore */
        }
        throw new Error(userMessage);
      }

      const data = await response.json();
      let requests = Array.isArray(data.body)
        ? data.body
        : Array.isArray(data)
        ? data
        : [];

      const relevantRequests = requests.filter(
        (req) =>
          req.approvedStatus?.toLowerCase() !== "approved" ||
          req.isPayed?.toLowerCase() !== "success"
      );
      relevantRequests.sort(
        (a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
      );

      const carIds = [
        ...new Set(relevantRequests.map((req) => req.carId).filter(Boolean)),
      ];
      const detailResults = await Promise.all(
        carIds.map((id) => fetchCarAndOwnerDetails(id))
      );
      const fetchedCarDetails = {};
      const fetchedOwnerDetails = {};
      detailResults.forEach((result) => {
        if (result?.car) Object.assign(fetchedCarDetails, result.car);
        if (result?.owner) Object.assign(fetchedOwnerDetails, result.owner);
      });

      const processedRequests = relevantRequests.map((request) => {
        // Initial calculation (can be removed if calculateLiveExpiresInSeconds is always used directly in render)
        // const expiresInSeconds = calculateLiveExpiresInSeconds(request.createdAt, moment());

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
            displayPickUp =
              request.pickUp.length > 1 && typeof request.pickUp[1] === "string"
                ? request.pickUp[1]
                : "Coordinates available";
          } else if (typeof request.pickUp[0] === "string") {
            displayPickUp = request.pickUp[0];
          }
        } else if (typeof request.pickUp === "string") {
          displayPickUp = request.pickUp;
        } else if (
          request.pickUp &&
          typeof request.pickUp === "object" &&
          request.pickUp.name
        ) {
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
            displayDropOff =
              request.dropOff.length > 1 &&
              typeof request.dropOff[1] === "string"
                ? request.dropOff[1]
                : "Coordinates available";
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
          displayDropOff = request.dropOff.name;
        }

        // We only need createdAt, the live calculation will happen in render
        return {
          ...request,
          displayPickUpLocation: displayPickUp,
          displayDropOffLocation: displayDropOff,
        };
      });

      setRentalRequests(processedRequests);
      setCarDetailsMap(fetchedCarDetails);
      setOwnerDetailsMap(fetchedOwnerDetails);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  }, [
    accessToken,
    apiCallWithRetry,
    fetchCarAndOwnerDetails,
    rentalRequests.length,
  ]); // Added rentalRequests.length to conditionally clear maps

  useEffect(() => {
    fetchRentalRequests();
  }, [fetchRentalRequests]);

  useEffect(() => {
    if (!loading && rentalRequests.length > 0) {
      if (
        selectedRequest === null ||
        !rentalRequests.some((req) => req.id === selectedRequest.id)
      ) {
        setSelectedRequest(rentalRequests[0]);
      }
    } else if (
      !loading &&
      rentalRequests.length === 0 &&
      selectedRequest !== null
    ) {
      setSelectedRequest(null);
    }
  }, [loading, rentalRequests, selectedRequest]);

  const handlePayNow = useCallback(async () => {
    if (!selectedRequest?.id) {
      setPaymentError("Request details missing.");
      return;
    }
    // Pass currentTime to get the most up-to-date status for the check
    const statusInfo = getStatusDisplay(selectedRequest, currentTime);
    if (
      !statusInfo.isPaymentPending ||
      statusInfo.isExpired ||
      statusInfo.isPastStartDatePaymentDue
    ) {
      setPaymentError(`Cannot pay: ${statusInfo.text}.`);
      return;
    }
    if (!accessToken) {
      setPaymentError("Authentication failed.");
      return;
    }
    setIsInitiatingPayment(true);
    setPaymentError(null);
    try {
      const response = await apiCallWithRetry(
        `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/checkout/${selectedRequest.id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!response.ok) {
        const errorText = await response
          .text()
          .catch(() => `Payment failed: ${response.status}`);
        let errorMessage = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (e) {
          /* ignore */
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      if (data.body) {
        window.location.href = data.body;
      } else {
        throw new Error("Payment URL not received.");
      }
    } catch (err) {
      setPaymentError(err.message);
      setIsInitiatingPayment(false);
    }
  }, [
    accessToken,
    selectedRequest,
    getStatusDisplay,
    apiCallWithRetry,
    currentTime,
  ]); // Added currentTime

  const handleChatWithOwner = useCallback(() => {
    if (!selectedRequest) {
      alert("Please select a request.");
      return;
    }
    const carId = selectedRequest.carId;
    const bookingId = selectedRequest.id;
    const carDetails = carDetailsMap[carId];
    const ownerId = carDetails?.owenerId;
    const ownerDetails = ownerDetailsMap[ownerId];
    const ownerGivenName = ownerDetails?.given_name || "Owner";
    const ownerFamilyName = ownerDetails?.family_name || "";

    if (!currentUserId) {
      alert("Your user ID is missing.");
      return;
    }
    if (!ownerId) {
      alert("Car owner details missing.");
      return;
    }

    navigate(
      `/chat?userId1=${encodeURIComponent(
        currentUserId
      )}&userId2=${encodeURIComponent(ownerId)}&bookingId=${encodeURIComponent(
        bookingId
      )}&carId=${encodeURIComponent(carId)}&given_name=${encodeURIComponent(
        ownerGivenName
      )}&family_name=${encodeURIComponent(ownerFamilyName)}`
    );
  }, [
    navigate,
    selectedRequest,
    carDetailsMap,
    ownerDetailsMap,
    currentUserId,
  ]);

  const selectedCarDetails = carDetailsMap[selectedRequest?.carId];
  const selectedOwnerDetails = ownerDetailsMap[selectedCarDetails?.owenerId];
  // For selectedRequestStatusInfo, pass currentTime to get live status
  const selectedRequestStatusInfo = selectedRequest
    ? getStatusDisplay(selectedRequest, currentTime)
    : null;

  const { calculatedTotalAmount, rentalDurationText } = useMemo(() => {
    if (
      !selectedRequest?.startDate ||
      !selectedRequest.endDate ||
      selectedRequest.amount === undefined
    ) {
      return { calculatedTotalAmount: "N/A", rentalDurationText: "N/A" };
    }
    try {
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
      if (durationInDays <= 0) {
        return {
          calculatedTotalAmount: amount > 0 ? `${amount.toFixed(2)}` : "N/A",
          rentalDurationText: amount > 0 ? "1 Day (Fixed)" : "Invalid Dates",
        };
      }
      return {
        calculatedTotalAmount: `${amount.toFixed(2)}`,
        rentalDurationText: `${durationInDays} Day${
          durationInDays !== 1 ? "s" : ""
        }`,
      };
    } catch (e) {
      return { calculatedTotalAmount: "Error", rentalDurationText: "Error" };
    }
  }, [selectedRequest]);

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
            // --- Get live status and expiry for list item ---
            const liveExpiresIn = calculateLiveExpiresInSeconds(
              request.createdAt
            );
            const statusInfo = getStatusDisplay(request, currentTime); // Pass currentTime
            const carInfo = carDetailsMap[request.carId];
            const isListItemExpired = statusInfo.isExpired;

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
                  className={`p-3 flex justify-between items-center border border-dashed 
                ${
                  isListItemExpired
                    ? "border-red-500 bg-red-100 text-red-600"
                    : liveExpiresIn <= 0 && statusInfo.isPending
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "border-blue-500 bg-blue-50 text-blue-600"
                } 
                rounded-lg`}
                >
                  <span
                    className={`font-semibold text-sm ${
                      isListItemExpired ||
                      (liveExpiresIn <= 0 && statusInfo.isPending)
                        ? "text-red-700"
                        : "text-black"
                    }`}
                  >
                    {isListItemExpired ||
                    (liveExpiresIn <= 0 && statusInfo.isPending)
                      ? "Expired"
                      : statusInfo.isPending
                      ? "Expires in"
                      : "Status"}
                  </span>
                  {statusInfo.isPending &&
                    !isListItemExpired &&
                    liveExpiresIn > 0 && (
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full text-white bg-blue-800`}
                      >
                        {formatExpiryTime(liveExpiresIn)}
                      </span>
                    )}
                  {(!statusInfo.isPending ||
                    isListItemExpired ||
                    (liveExpiresIn <= 0 && statusInfo.isPending)) && (
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        statusInfo.textColor
                      } ${statusInfo.bgColor} border ${
                        isListItemExpired ||
                        (liveExpiresIn <= 0 && statusInfo.isPending)
                          ? "border-red-300"
                          : "border-transparent"
                      }`}
                    >
                      {statusInfo.text}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 text-xs text-gray-600 w-full gap-3 mt-2">
                  <div className="flex items-center w-full gap-2">
                    <img
                      src={carInfo?.photos?.[0] || image}
                      alt={carInfo?.make || "Car"}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <div className="w-full">
                      <span className="font-medium text-sm text-black block truncate">
                        Car
                      </span>
                      <p className="truncate">
                        {carInfo?.make || "N/A"} {carInfo?.model || ""}
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
                {/* Live countdown/status for selected request details */}
                <div
                  className={`w-full text-center py-2 px-4 text-sm rounded-lg mt-4 
                    ${
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
                      : `Expires in: ${formatExpiryTime(
                          selectedRequestStatusInfo?.liveExpiresIn
                        )}`
                    : "Status Confirmed"}
                </div>

                <h2 className="text-lg mt-8 mb-4 font-semibold text-[#00113D]">
                  Car Details
                </h2>
                {selectedCarDetails ? (
                  <div className="text-sm space-y-2 text-gray-600">
                    <div className="grid grid-cols-2 gap-4">
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
                        <p>
                          {selectedCarDetails.year
                            ? moment(selectedCarDetails.year).format("YYYY")
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-black block">
                          Plate No.
                        </span>
                        <p>{selectedCarDetails.vehicleNumber || "N/A"}</p>
                      </div>
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
                        {selectedRequest.displayPickUpLocation}
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
                        {selectedRequest.displayDropOffLocation}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-sm">
                  <span className="font-medium text-black block">Duration</span>
                  <p className="text-gray-600">{rentalDurationText}</p>
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

            {/* <section className="h-fit bg-white p-6 space-y-6 rounded-xl shadow-lg">
              <h2 className="text-lg font-semibold text-[#00113D] mb-6">
                Car Owner Details
              </h2>
              {/* {selectedOwnerDetails ? (
                <div className="items-center flex md:flex-row flex-col gap-6 md:gap-8">
                  <img
                    src={selectedOwnerDetails.profilePicture || image}
                    alt="Owner"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                  />
                  <div className="grid gap-x-6 gap-y-3 md:grid-cols-2 grid-cols-1 w-full">
                    <div className="flex items-center gap-3 text-sm">
                      <IoPersonOutline size={18} className="text-gray-500" />
                      <span>{selectedOwnerDetails.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MdOutlineLocalPhone
                        size={18}
                        className="text-gray-500"
                      />
                      <span>{selectedOwnerDetails.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MdOutlineMail size={18} className="text-gray-500" />
                      <span>{selectedOwnerDetails.email}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Loading owner details...
                </p>
              )} */}

              <div className="flex flex-col sm:flex-row text-base gap-4 pt-4 border-t border-gray-200">
                {/* <button
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border rounded-full border-[#00113D] text-[#00113D] hover:bg-[#00113D] hover:text-white transition-colors disabled:opacity-50"
                  onClick={handleChatWithOwner}
                  disabled={
                    !selectedRequest ||
                    !selectedOwnerDetails?.id ||
                    !currentUserId
                  }
                >
                  <IoChatboxOutline size={18} /> Chat With Owner
                </button> */}

                {selectedRequestStatusInfo?.isPaymentPending &&
                  !selectedRequestStatusInfo?.isExpired &&
                  !selectedRequestStatusInfo?.isPastStartDatePaymentDue && (
                    <button
                      onClick={handlePayNow}
                      className="flex-1 py-2.5 px-4 rounded-full bg-[#00113D] text-white hover:bg-blue-800 transition-colors disabled:opacity-50"
                      disabled={isInitiatingPayment || !selectedRequest?.id}
                    >
                      {isInitiatingPayment ? "Processing..." : "Pay Now"}
                    </button>
                  )}
              </div>
              {paymentError && (
                <p className="text-red-500 text-sm text-center mt-2">
                  {paymentError}
                </p>
              )}
            </section> */}
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
    </div>
  );
};

export default MyRequests;
