import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import RequestList from "./RequestList";
import RequestDetails from "./RequestDetails";

const MyRequests = () => {
  const navigate = useNavigate();

  const [rentalRequests, setRentalRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carDetailsMap, setCarDetailsMap] = useState({});
  const [ownerDetailsMap, setOwnerDetailsMap] = useState({});
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [currentTime, setCurrentTime] = useState(moment());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [extensionData, setExtensionData] = useState({
    newEndDate: null,
    isAvailable: null,
    availabilityLoading: false,
    availabilityError: null,
    additionalDays: 0,
    additionalAmount: 0,
  });

  const customer = JSON.parse(localStorage.getItem("customer")) || {};
  const accessToken = customer?.AccessToken;

  const apiCallWithRetry = useCallback(async (url, options) => {
    const response = await fetch(url, options);
    if (!response.ok) {
      try {
        const errorJson = await response.json();
        const message =
          errorJson.body?.message ||
          errorJson.message ||
          `HTTP error! status: ${response.status}`;
        throw new Error(message);
      } catch (e) {
        if (e instanceof Error && e.message.includes("HTTP error!")) throw e;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    return {
      ok: true,
      status: response.status,
      json: async () => response.json(),
    };
  }, []);

  const fetchCarAndOwnerDetails = useCallback(
    async (vehicleID) => {
      if (!vehicleID || !accessToken) return { car: null, owner: null };
      try {
        const response = await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/getCarInfo/${vehicleID}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const data = await response.json();
        const carData = data.body || data;
        if (!carData || Object.keys(carData).length === 0)
          return { car: null, owner: null };
        const ownerData = {
          id: carData.owenerId,
          name:
            `${carData.ownerGivenName || ""} ${
              carData.ownerSurName || ""
            }`.trim() || "N/A",
          phone: carData.ownerPhone || "N/A",
          email: carData.ownerEmail || "N/A",
        };
        return {
          car: { [vehicleID]: carData },
          owner: ownerData.id ? { [ownerData.id]: ownerData } : {},
        };
      } catch (error) {
        console.error(`Fetch car details error for ${vehicleID}:`, error);
        return { car: null, owner: null };
      }
    },
    [accessToken, apiCallWithRetry]
  );

  const fetchRentalRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
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
      const data = await response.json();
      let requests = Array.isArray(data.body)
        ? data.body
        : Array.isArray(data)
        ? data
        : [];
      requests.sort(
        (a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
      );
      setRentalRequests(requests);

      const carIds = [
        ...new Set(requests.map((req) => req.carId).filter(Boolean)),
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
      setCarDetailsMap(fetchedCarDetails);
      setOwnerDetailsMap(fetchedOwnerDetails);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  }, [accessToken, apiCallWithRetry, fetchCarAndOwnerDetails]);

  useEffect(() => {
    fetchRentalRequests();
  }, [fetchRentalRequests]);
  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(moment()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const handleViewDetails = useCallback((request) => {
    setSelectedRequest(request);
    setPaymentError(null);
    setActionError(null);
  }, []);

  const calculateLiveExpiresInSeconds = useCallback(
    (createdAt) => {
      if (!createdAt) return 0;
      const expiryMoment = moment(createdAt).add(24, "hours");
      return Math.max(0, expiryMoment.diff(currentTime, "seconds"));
    },
    [currentTime]
  );

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
      const status = request.approvedStatus?.toLowerCase()?.trim();
      const liveExpiresIn = calculateLiveExpiresInSeconds(request.createdAt);
      const isExpired = isRequestActuallyExpired(liveExpiresIn, status);

      // --- ADDED: Handle extension statuses ---
      if (request.extensionStatus?.toLowerCase() === "approved") {
        const approvedExtension = request.extensions?.find(
          (ext) =>
            ext.status?.toLowerCase() === "approved" &&
            ext.paymentStatus?.toLowerCase() === "pending"
        );
        if (approvedExtension) {
          return {
            text: "Extension Payment Due",
            bgColor: "bg-orange-100",
            textColor: "text-orange-700",
            isActionable: true,
            key: "extension_payment_due",
          };
        }
      }

      if (request.extensionStatus?.toLowerCase() === "pending") {
        return {
          text: "Extension Pending",
          bgColor: "bg-purple-100",
          textColor: "text-purple-700",
          isActionable: false,
          key: "extension_pending",
        };
      }

      if (isExpired) {
        return {
          text: "Expired",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          isActionable: false,
          isExpired: true,
          liveExpiresIn,
          key: "expired",
        };
      }

      switch (status) {
        case "pending":
          return {
            text: "Approval Pending",
            bgColor: "bg-blue-100",
            textColor: "text-blue-600",
            isActionable: true,
            isPending: true,
            liveExpiresIn,
            key: "pending",
          };
        case "approved":
          const startDateMoment = moment(request.startDate);
          if (
            startDateMoment.isValid() &&
            startDateMoment.isBefore(liveCurrentTime)
          ) {
            return {
              text: "Payment Window Missed",
              bgColor: "bg-orange-100",
              textColor: "text-orange-700",
              isActionable: false,
              isPastStartDatePaymentDue: true,
              liveExpiresIn,
              key: "payment_missed",
            };
          }
          return {
            text: "Payment Due",
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-700",
            isActionable: true,
            isPaymentPending: true,
            liveExpiresIn,
            key: "approved",
          };
        case "paid":
          return {
            text: "Paid & Confirmed",
            bgColor: "bg-teal-100",
            textColor: "text-teal-700",
            isActionable: true,
            key: "paid",
            liveExpiresIn,
          };
        case "active":
          return {
            text: "Active Rental",
            bgColor: "bg-cyan-100",
            textColor: "text-cyan-700",
            isActionable: true,
            key: "active",
            liveExpiresIn,
          };
        case "completed":
          return {
            text: "Completed",
            bgColor: "bg-gray-200",
            textColor: "text-gray-800",
            isActionable: false,
            key: "completed",
            liveExpiresIn,
          };
        case "denied":
          return {
            text: "Denied by Owner",
            bgColor: "bg-red-100",
            textColor: "text-red-700",
            isActionable: false,
            key: "denied",
            liveExpiresIn,
          };
        case "canceled":
          return {
            text: "Canceled",
            bgColor: "bg-gray-200",
            textColor: "text-gray-600",
            isActionable: false,
            key: "canceled",
            liveExpiresIn,
          };
        default:
          return {
            text: status || "Unknown",
            bgColor: "bg-gray-100",
            textColor: "text-gray-500",
            isActionable: false,
            key: "unknown",
            liveExpiresIn,
          };
      }
    },
    [isRequestActuallyExpired, calculateLiveExpiresInSeconds]
  );

  useEffect(() => {
    if (!loading && rentalRequests.length > 0) {
      if (
        selectedRequest === null ||
        !rentalRequests.some((req) => req.id === selectedRequest.id)
      ) {
        setSelectedRequest(rentalRequests[0]);
      } else {
        const updatedRequest = rentalRequests.find(
          (req) => req.id === selectedRequest.id
        );
        setSelectedRequest(updatedRequest || rentalRequests[0] || null);
      }
    } else if (!loading && rentalRequests.length === 0) {
      setSelectedRequest(null);
    }
  }, [loading, rentalRequests, selectedRequest]);

  const handlePayNow = useCallback(async () => {
    if (!selectedRequest?.id) {
      setPaymentError("Request details missing.");
      return;
    }
    const statusInfo = getStatusDisplay(selectedRequest, currentTime);
    if (!statusInfo.isPaymentPending) {
      setPaymentError(`Cannot pay now: ${statusInfo.text}.`);
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
  ]);

  // --- ADDED: Handler for extension payment ---
  const handlePayForExtension = useCallback(async () => {
    if (!selectedRequest?.extensionPaymentUrl) {
      setPaymentError("Extension payment URL is missing or invalid.");
      return;
    }
    // Simple redirect, no API call from frontend is needed here
    window.location.href = selectedRequest.extensionPaymentUrl;
  }, [selectedRequest]);

  const handleStatusChange = useCallback(
    async (bookingId, action) => {
      setIsSubmitting(true);
      setActionError(null);
      try {
        await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/change_booking_status`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ transactionId: bookingId, action }),
          }
        );
        await fetchRentalRequests();
      } catch (err) {
        setActionError(err.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [accessToken, apiCallWithRetry, fetchRentalRequests]
  );

  const handleCheckAvailability = useCallback(
    async (newEndDate, additionalDays, additionalAmount) => {
      if (!selectedRequest) return;
      if (!newEndDate) {
        setExtensionData((prev) => ({
          ...prev,
          availabilityError: "Please select a new end date.",
          isAvailable: null,
        }));
        return;
      }
      setExtensionData((prev) => ({
        ...prev,
        availabilityLoading: true,
        availabilityError: null,
        isAvailable: null,
      }));
      try {
        const url = `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/availability`;
        const response = await apiCallWithRetry(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            vehicleId: selectedRequest.carId,
            currentEndDate: moment(selectedRequest.endDate).toISOString(),
            newEndDate: moment(newEndDate).toISOString(),
          }),
        });

        const data = await response.json();
        setExtensionData((prev) => ({
          ...prev,
          isAvailable: data.body?.isAvailable ?? data.isAvailable,
          newEndDate,
          additionalDays,
          additionalAmount,
          availabilityLoading: false,
        }));
      } catch (err) {
        setExtensionData((prev) => ({
          ...prev,
          availabilityLoading: false,
          availabilityError: err.message,
        }));
      }
    },
    [accessToken, apiCallWithRetry, selectedRequest]
  );

  const handleRequestExtension = useCallback(
    async (newEndDate, additionalDays, additionalAmount) => {
      if (!selectedRequest) return;
      setIsSubmitting(true);
      setActionError(null);
      try {
        await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/requestextension`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              bookingId: selectedRequest.id,
              newEndDate: moment(newEndDate).toISOString(),
              additionalDays,
              additionalAmount: parseFloat(additionalAmount),
            }),
          }
        );
        document.querySelector('button[aria-label="Close"]')?.click();
        await fetchRentalRequests();
      } catch (err) {
        setActionError(err.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [accessToken, apiCallWithRetry, selectedRequest, fetchRentalRequests]
  );

  const selectedCarDetails = carDetailsMap[selectedRequest?.carId];
  const selectedRequestStatusInfo = selectedRequest
    ? getStatusDisplay(selectedRequest, currentTime)
    : null;

  if (loading && rentalRequests.length === 0)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading rental requests...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        Error: {error}
      </div>
    );

  return (
    <div className="flex md:flex-row flex-col justify-center md:pt-32 px-4 sm:px-10 md:px-20 p-6 pt-28 bg-[#F8F8FF] min-h-screen">
      <RequestList
        rentalRequests={rentalRequests}
        selectedRequest={selectedRequest}
        handleViewDetails={handleViewDetails}
        getStatusDisplay={getStatusDisplay}
        currentTime={currentTime}
        loading={loading}
        error={error}
        carDetailsMap={carDetailsMap}
      />
      <RequestDetails
        selectedRequest={selectedRequest}
        selectedCarDetails={selectedCarDetails}
        selectedRequestStatusInfo={selectedRequestStatusInfo}
        rentalRequests={rentalRequests}
        loading={loading}
        handlePayNow={handlePayNow}
        handlePayForExtension={handlePayForExtension} // Pass new prop
        isInitiatingPayment={isInitiatingPayment}
        paymentError={paymentError}
        isSubmitting={isSubmitting}
        actionError={actionError}
        handleStatusChange={handleStatusChange}
        handleCheckAvailability={handleCheckAvailability}
        handleRequestExtension={handleRequestExtension}
        extensionData={extensionData}
        setExtensionData={setExtensionData}
      />
    </div>
  );
};

export default MyRequests;
