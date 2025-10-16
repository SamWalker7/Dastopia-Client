import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FaRegCircle } from "react-icons/fa";
import image from "../../images/testimonials/avatar.png";
import {
  IoChatboxOutline,
  IoFileTray,
  IoLocationOutline,
  IoPersonOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { MdOutlineLocalPhone, MdOutlineMail } from "react-icons/md";
import useVehicleFormStore from "../../store/useVehicleFormStore";
import { useNavigate } from "react-router-dom";

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "Expired";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map((unit) => String(unit).padStart(2, "0")).join(":");
};

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

const RentalRequests = () => {
  const navigate = useNavigate();
  const [rentalRequests, setRentalRequests] = useState([]);
  const [extensionRequests, setExtensionRequests] = useState([]);
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

  const fetchVehicleDetails = useCallback(
    async (carId) => {
      if (!carId || !customer?.AccessToken) return null;
      try {
        const vehicleResponse = await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/${carId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${customer.AccessToken}` },
          }
        );
        return vehicleResponse?.body || null;
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

  const processLocation = (loc) => {
    if (!loc) return "Location not specified";
    if (typeof loc === "string") return loc;
    if (Array.isArray(loc)) {
      if (loc.length > 1 && typeof loc[1] === "string") return loc[1];
      if (typeof loc[0] === "string") return loc[0];
      if (typeof loc[0] === "object" && loc[0] !== null && "lng" in loc[0])
        return "Coordinates available";
    }
    if (typeof loc === "object" && loc.name) return loc.name;
    return "Location not specified";
  };

  const fetchRentalRequests = useCallback(async () => {
    if (!customer?.AccessToken) {
      setLoading(false);
      return;
    }
    try {
      const response = await apiCallWithRetry(
        "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/get_all_owner_booking",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${customer.AccessToken}` },
        }
      );
      if (response && Array.isArray(response.body)) {
        const pendingRequests = response.body.filter(
          (req) => req.approvedStatus?.toLowerCase() === "pending"
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
        setVehicleDetailsMap((prev) => ({
          ...prev,
          ...fetchedVehicleDetailsMap,
        }));
        const requestsWithDetails = pendingRequests.map((req) => ({
          ...req,
          isNewRequest: true,
          expiresInSeconds: Math.max(
            0,
            Math.floor(
              (new Date(req.createdAt).getTime() +
                24 * 3600 * 1000 -
                Date.now()) /
                1000
            )
          ),
          vehicleDetail: fetchedVehicleDetailsMap[req.carId],
          renterName:
            `${req.renteeInfo?.given_name || ""} ${
              req.renteeInfo?.family_name || ""
            }`.trim() || "Unknown",
          // UPDATED: Use dynamic profile picture from API, fallback to static image
          renterAvatarUrl: req.renteeInfo?.profile_picture || image,
          displayPickUpLocation: processLocation(req.pickUp),
          displayDropOffLocation: processLocation(req.dropOff),
        }));
        setRentalRequests(requestsWithDetails);
      } else {
        setError((prev) => (prev || "") + " Failed to fetch new requests.");
      }
    } catch (err) {
      setError(
        (prev) => (prev || "") + " Error fetching new requests: " + err.message
      );
    }
  }, [apiCallWithRetry, customer?.AccessToken, fetchVehicleDetails]);

  const fetchExtensionRequests = useCallback(async () => {
    if (!customer?.AccessToken) {
      setLoading(false);
      return;
    }
    try {
      const response = await apiCallWithRetry(
        "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/get_all_owner_booking",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${customer.AccessToken}` },
        }
      );
      if (response && Array.isArray(response.body)) {
        const pendingExtensions = response.body.filter(
          (req) => req.extensionStatus?.toLowerCase() === "pending"
        );
        pendingExtensions.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const vehicleIds = [
          ...new Set(pendingExtensions.map((req) => req.carId).filter(Boolean)),
        ];
        const vehicleResults = await Promise.all(
          vehicleIds.map(fetchVehicleDetails)
        );
        const fetchedVehicleDetailsMap = {};
        vehicleResults.filter(Boolean).forEach((detail) => {
          if (detail?.id) fetchedVehicleDetailsMap[detail.id] = detail;
        });
        setVehicleDetailsMap((prev) => ({
          ...prev,
          ...fetchedVehicleDetailsMap,
        }));
        const requestsWithDetails = pendingExtensions.map((req) => ({
          ...req,
          isNewRequest: false,
          vehicleDetail: fetchedVehicleDetailsMap[req.carId],
          renterName:
            `${req.renteeInfo?.given_name || ""} ${
              req.renteeInfo?.family_name || ""
            }`.trim() || "Unknown",
          // UPDATED: Use dynamic profile picture from API, fallback to static image
          renterAvatarUrl: req.renteeInfo?.profile_picture || image,
          displayPickUpLocation: processLocation(req.pickUp),
          displayDropOffLocation: processLocation(req.dropOff),
        }));
        setExtensionRequests(requestsWithDetails);
      } else {
        setError(
          (prev) => (prev || "") + " Failed to fetch extension requests."
        );
      }
    } catch (err) {
      setError(
        (prev) =>
          (prev || "") + " Error fetching extension requests: " + err.message
      );
    }
  }, [apiCallWithRetry, customer?.AccessToken, fetchVehicleDetails]);

  const handleApproveRequest = useCallback(
    async (bookingId) => {
      setActionLoading(true);
      setActionError(null);
      try {
        const res = await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/approve_booking/${bookingId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${customer.AccessToken}` },
          }
        );
        if (res && res.statusCode === 200) {
          await fetchRentalRequests();
        } else {
          setActionError(
            `Failed to approve: ${res?.body?.message || "Unknown"}`
          );
        }
      } catch (err) {
        setActionError(`Error: ${err.message}`);
      } finally {
        setActionLoading(false);
      }
    },
    [apiCallWithRetry, customer?.AccessToken, fetchRentalRequests]
  );

  const handleRejectRequest = useCallback(
    async (bookingId) => {
      setActionLoading(true);
      setActionError(null);
      try {
        const res = await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/deny_booking/${bookingId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${customer.AccessToken}` },
          }
        );
        if (res && res.statusCode === 200) {
          await fetchRentalRequests();
        } else {
          setActionError(
            `Failed to reject: ${res?.body?.message || "Unknown"}`
          );
        }
      } catch (err) {
        setActionError(`Error: ${err.message}`);
      } finally {
        setActionLoading(false);
      }
    },
    [apiCallWithRetry, customer?.AccessToken, fetchRentalRequests]
  );

  const handleExtensionAction = useCallback(
    async (bookingId, extensionId, action) => {
      setActionLoading(true);
      setActionError(null);
      try {
        await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/approveextension`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${customer.AccessToken}`,
            },
            body: JSON.stringify({ action, extensionId, bookingId }),
          }
        );
        await fetchExtensionRequests(); // Refresh the extensions list
      } catch (err) {
        setActionError(`Failed to ${action} extension: ${err.message}`);
      } finally {
        setActionLoading(false);
      }
    },
    [apiCallWithRetry, customer.AccessToken, fetchExtensionRequests]
  );

  const handleChatWithRentee = useCallback(
    (booking) => {
      const renteeId = booking?.renteeId;
      const renteeGivenName = booking?.renteeInfo?.given_name || "";
      const renteeFamilyName = booking?.renteeInfo?.family_name || "";
      navigate(
        `/chat?renteeId=${renteeId}&reservationId=${renteeId}&given_name=${renteeGivenName}&family_name=${renteeFamilyName}`
      );
    },
    [navigate]
  );

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchRentalRequests(), fetchExtensionRequests()]).finally(
      () => {
        setLoading(false);
      }
    );
  }, [fetchRentalRequests, fetchExtensionRequests]);

  useEffect(() => {
    if (!loading) {
      const allRequests = [...rentalRequests, ...extensionRequests];
      if (!selectedRequest && allRequests.length > 0) {
        setSelectedRequest(allRequests[0]);
      } else if (
        selectedRequest &&
        !allRequests.some((r) => r.id === selectedRequest.id)
      ) {
        setSelectedRequest(allRequests[0] || null);
      }
    }
  }, [loading, rentalRequests, extensionRequests, selectedRequest]);

  const pendingExtension = useMemo(() => {
    if (selectedRequest?.extensionStatus?.toLowerCase() !== "pending")
      return null;
    return (
      selectedRequest.extensions?.find(
        (ext) => ext.status?.toLowerCase() === "pending"
      ) || null
    );
  }, [selectedRequest]);

  if (
    loading &&
    rentalRequests.length === 0 &&
    extensionRequests.length === 0
  ) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading all requests...
      </div>
    );
  }

  return (
    <div className="flex md:flex-row flex-col justify-center md:pt-32 px-4 sm:px-10 md:px-20 p-6 pt-28 bg-[#F8F8FF] min-h-screen">
      <div className="md:w-1/3 w-full bg-white p-6 rounded-xl shadow-lg space-y-6 overflow-y-auto md:max-h-[calc(100vh-10rem)] mb-6 md:mb-0">
        <div>
          <h2 className="text-xl font-bold text-[#00113D]">
            New Rental Requests ({rentalRequests.length})
          </h2>
          {rentalRequests.length === 0 && !loading ? (
            <div className="text-center py-4">
              <p className="text-gray-500">No new rental requests.</p>
            </div>
          ) : (
            rentalRequests.map((request) => (
              <div
                key={request.id}
                className={`p-4 mt-4 w-full space-y-3 rounded-lg shadow-blue-100 shadow-md cursor-pointer ${
                  selectedRequest?.id === request.id
                    ? "border-2 border-[#00113D] bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedRequest(request)}
              >
                <div
                  className={`p-3 flex justify-between items-center border border-dashed rounded-lg ${
                    request.expiresInSeconds <= 0
                      ? "border-red-500 bg-red-50"
                      : "border-blue-500 bg-blue-50"
                  }`}
                >
                  <span className="font-semibold text-sm text-black">
                    Expires in
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full text-white ${
                      request.expiresInSeconds <= 0
                        ? "bg-red-700"
                        : "bg-blue-800"
                    }`}
                  >
                    {formatTime(request.expiresInSeconds)}
                  </span>
                </div>
                <div className="grid grid-cols-2 text-xs text-gray-600 w-full gap-3 mt-2">
                  <div className="flex items-center w-full gap-2">
                    <img
                      src={request.renterAvatarUrl}
                      alt="Renter"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-medium text-sm text-black block truncate">
                        Rentee
                      </span>
                      <p className="truncate">{request.renterName}</p>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-sm text-black block">
                      Car
                    </span>
                    <p className="truncate">
                      {request.vehicleDetail?.make || "N/A"}{" "}
                      {request.vehicleDetail?.model || ""}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="border-t pt-6">
          <h2 className="text-xl font-bold text-purple-800">
            Pending Extension Requests ({extensionRequests.length})
          </h2>
          {extensionRequests.length === 0 && !loading ? (
            <div className="text-center py-4">
              <p className="text-gray-500">No pending extension requests.</p>
            </div>
          ) : (
            extensionRequests.map((request) => (
              <div
                key={request.id}
                className={`p-4 mt-4 w-full space-y-3 rounded-lg shadow-purple-100 shadow-md cursor-pointer ${
                  selectedRequest?.id === request.id
                    ? "border-2 border-purple-800 bg-purple-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedRequest(request)}
              >
                <div className="p-3 flex justify-between items-center border border-dashed rounded-lg border-purple-500 bg-purple-50">
                  <span className="font-semibold text-sm text-black">
                    Extension Review
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full text-white bg-purple-800">
                    Review Needed
                  </span>
                </div>
                <div className="grid grid-cols-2 text-xs text-gray-600 w-full gap-3 mt-2">
                  <div className="flex items-center w-full gap-2">
                    <img
                      src={request.renterAvatarUrl}
                      alt="Renter"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-medium text-sm text-black block truncate">
                        Rentee
                      </span>
                      <p className="truncate">{request.renterName}</p>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-sm text-black block">
                      Car
                    </span>
                    <p className="truncate">
                      {request.vehicleDetail?.make || "N/A"}{" "}
                      {request.vehicleDetail?.model || ""}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
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
                      {new Date(selectedRequest.createdAt).toLocaleDateString()}
                      <br />
                      {new Date(selectedRequest.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                {selectedRequest.isNewRequest && (
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
                )}
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
                  <div className="pt-4 mt-4 border-t">
                    <div className="mb-2">
                      <span className="font-medium text-black block">
                        Available Services
                      </span>
                      <p className="font-semibold text-blue-700">
                        {formatServiceType(
                          selectedRequest.vehicleDetail?.serviceType
                        )}
                      </p>
                    </div>
                    {selectedRequest.vehicleDetail?.serviceType !==
                      "self-drive" && (
                      <div>
                        <span className="font-medium text-black block">
                          Driver's Daily Price
                        </span>
                        <p className="text-green-700 font-semibold">
                          + {selectedRequest.vehicleDetail?.driverPrice || "0"}{" "}
                          ETB
                        </p>
                      </div>
                    )}
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
                        {new Date(selectedRequest.startDate).toLocaleString()}
                      </p>
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
                        {new Date(selectedRequest.endDate).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedRequest.displayDropOffLocation}
                      </p>
                    </div>
                  </div>
                </div>
                {/* --- MODIFIED: Renamed to Service Type --- */}
                <div className="mt-6 text-sm">
                  <span className="font-medium text-black block">
                    Service Type
                  </span>
                  <p className="text-gray-600 font-semibold">
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
                    {selectedRequest.amount
                      ? `${selectedRequest.amount} ETB`
                      : "N/A"}
                  </p>
                </div>
              </section>
            </div>

            {/* ==================== NEW: Enhanced Rentee Details Section ==================== */}
            <section className="h-fit bg-white p-6 space-y-6 rounded-xl shadow-lg">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold text-[#00113D]">
                  Rentee Details
                </h2>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${
                    selectedRequest?.renteeInfo?.id_verified === "1"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  <IoShieldCheckmarkOutline />
                  {selectedRequest?.renteeInfo?.id_verified === "1"
                    ? "ID Verified"
                    : "ID Not Verified"}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <img
                    src={selectedRequest.renterAvatarUrl}
                    alt="Renter Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-semibold text-black block">
                      {selectedRequest.renterName}
                    </span>
                    <span className="text-[#5A5A5A]">
                      {selectedRequest?.renteeInfo?.email || "No email"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#5A5A5A]">
                  <IoFileTray
                    size={18}
                    className="text-gray-500 flex-shrink-0"
                  />
                  <span>
                    <span className="font-semibold text-black">
                      ID Number:{" "}
                    </span>
                    {selectedRequest?.renteeInfo?.id_number || "N/A"}
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm text-[#5A5A5A] md:col-span-2">
                  <IoLocationOutline
                    size={18}
                    className="text-gray-500 flex-shrink-0 mt-1"
                  />
                  <div>
                    <span className="font-semibold text-black">Address: </span>
                    {selectedRequest?.renteeInfo?.address || "No address"}
                    {", "}
                    {selectedRequest?.renteeInfo?.city || ""}
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h3 className="text-md font-semibold text-gray-800 mb-3">
                  Submitted Documents
                </h3>
                <div className="flex flex-wrap gap-4">
                  {selectedRequest?.renteeInfo?.selfie && (
                    <a
                      href={selectedRequest.renteeInfo.selfie}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center group"
                    >
                      <img
                        src={selectedRequest.renteeInfo.selfie}
                        alt="Selfie"
                        className="w-24 h-24 rounded-lg object-cover border-2 border-transparent group-hover:border-blue-500 transition"
                      />
                      <span className="text-xs text-gray-600 mt-1 block">
                        Selfie
                      </span>
                    </a>
                  )}
                  {selectedRequest?.renteeInfo?.id_front && (
                    <a
                      href={selectedRequest.renteeInfo.id_front}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center group"
                    >
                      <img
                        src={selectedRequest.renteeInfo.id_front}
                        alt="ID Front"
                        className="w-24 h-24 rounded-lg object-cover border-2 border-transparent group-hover:border-blue-500 transition"
                      />
                      <span className="text-xs text-gray-600 mt-1 block">
                        ID Front
                      </span>
                    </a>
                  )}
                  {selectedRequest?.renteeInfo?.id_back && (
                    <a
                      href={selectedRequest.renteeInfo.id_back}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center group"
                    >
                      <img
                        src={selectedRequest.renteeInfo.id_back}
                        alt="ID Back"
                        className="w-24 h-24 rounded-lg object-cover border-2 border-transparent group-hover:border-blue-500 transition"
                      />
                      <span className="text-xs text-gray-600 mt-1 block">
                        ID Back
                      </span>
                    </a>
                  )}
                </div>
              </div>

              {actionError && (
                <p className="text-red-500 text-sm text-center">
                  {actionError}
                </p>
              )}
              {selectedRequest.isNewRequest && (
                <div className="flex text-base gap-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleRejectRequest(selectedRequest.id)}
                    disabled={
                      actionLoading || selectedRequest.expiresInSeconds <= 0
                    }
                    className="flex-1 py-3 rounded-full bg-red-50 text-red-700 border border-red-600 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                  >
                    Reject Request
                  </button>
                  <button
                    onClick={() => handleApproveRequest(selectedRequest.id)}
                    disabled={
                      actionLoading || selectedRequest.expiresInSeconds <= 0
                    }
                    className="flex-1 py-3 rounded-full bg-[#00113D] text-white hover:bg-blue-800 transition-colors disabled:opacity-50"
                  >
                    Approve Request
                  </button>
                </div>
              )}

              {!selectedRequest.isNewRequest && pendingExtension && (
                <div className="p-4 border-t border-purple-200 bg-purple-50 rounded-lg">
                  <h3 className="text-md font-bold text-purple-800 mb-3">
                    Pending Extension Details
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-black block">
                        New End Date
                      </span>
                      <p className="text-gray-600">
                        {new Date(
                          pendingExtension.newEndDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-black block">
                        Additional Days
                      </span>
                      <p className="text-gray-600">
                        {pendingExtension.additionalDays}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-black block">
                        Additional Cost
                      </span>
                      <p className="text-gray-600 font-semibold">
                        {pendingExtension.additionalAmount.toFixed(2)} ETB
                      </p>
                    </div>
                  </div>
                  <div className="flex text-base gap-4 pt-4 mt-4 border-t border-purple-200">
                    <button
                      onClick={() =>
                        handleExtensionAction(
                          selectedRequest.id,
                          pendingExtension.id,
                          "reject"
                        )
                      }
                      disabled={actionLoading}
                      className="flex-1 py-3 rounded-full bg-red-50 text-red-700 border border-red-600 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                    >
                      Reject Extension
                    </button>
                    <button
                      onClick={() =>
                        handleExtensionAction(
                          selectedRequest.id,
                          pendingExtension.id,
                          "approve"
                        )
                      }
                      disabled={actionLoading}
                      className="flex-1 py-3 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      Approve Extension
                    </button>
                  </div>
                </div>
              )}
            </section>
          </>
        ) : (
          <div className="md:w-2/3 w-full bg-white p-6 rounded-xl shadow-lg h-[400px] flex justify-center items-center">
            <p className="text-gray-500">
              {rentalRequests.length > 0 || extensionRequests.length > 0
                ? "Select a request to see details."
                : "No pending actions."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalRequests;
