// RentalRequests.js
import React, { useEffect, useState } from "react";
import { FaRegCircle } from "react-icons/fa";
import image from "../../images/testimonials/avatar.png";
import {
  IoChatboxOutline,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { MdOutlineLocalPhone, MdOutlineMail } from "react-icons/md";
import useVehicleFormStore from "../../store/useVehicleFormStore";
import { useNavigate } from "react-router-dom";

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((unit) => String(unit).padStart(2, "0")).join(":");
};

const RentalRequests = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [approved, setApproved] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [rentalRequests, setRentalRequests] = useState([]);
  const [vehicleDetailsMap, setVehicleDetailsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { apiCallWithRetry } = useVehicleFormStore();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const customer = JSON.parse(localStorage.getItem("customer"));

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleChatWithRenter = (renteeId, reservationId) => {
    navigate(`/chat?renteeId=${renteeId}&reservationId=${reservationId}`);
  };

  const handleConfirmBooking = async () => {
    setApproved(false);
    if (selectedRequest) {
      await handleApproveRequest(selectedRequest.id);
    }
  };

  const handleCancelBooking = async () => {
    setIsModalVisible(false);
    if (selectedRequest) {
      await handleRejectRequest(selectedRequest.id);
    }
  };

  const handleApproveRequest = async (bookingId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCallWithRetry(
        `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/approve_booking/${bookingId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${customer.AccessToken}`,
          },
        }
      );

      if (response && response.statusCode === 200) {
        setRentalRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== bookingId)
        );
        setSelectedRequest(null);
      } else {
        setError(`Failed to approve booking ${bookingId}.`);
      }
    } catch (err) {
      setError(`Error approving booking ${bookingId}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (bookingId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCallWithRetry(
        `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/deny_booking/${bookingId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${customer.AccessToken}`,
          },
        }
      );

      if (response && response.statusCode === 200) {
        setRentalRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== bookingId)
        );
        setSelectedRequest(null);
      } else {
        setError(`Failed to reject booking ${bookingId}.`);
      }
    } catch (err) {
      setError(`Error rejecting booking ${bookingId}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRentalRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiCallWithRetry(
          "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/get_all_owner_booking",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${customer.AccessToken}`,
            },
          }
        );

        if (response && response.body) {
          const pendingRequests = response.body.filter(
            (request) => request.approvedStatus.toLowerCase() === "pending"
          );

          const requestsWithExpiry = await Promise.all(
            pendingRequests.map(async (request) => {
              const createdAt = new Date(request.createdAt);
              const expiryTime = new Date(
                createdAt.getTime() + 24 * 60 * 60 * 1000
              );
              const expiresInSeconds = Math.max(
                0,
                Math.floor((expiryTime.getTime() - new Date().getTime()) / 1000)
              );

              let vehicleDetail = vehicleDetailsMap[request.carId];
              if (!vehicleDetail) {
                vehicleDetail = await fetchVehicleDetails(request.carId);
              }
              return {
                ...request,
                expiresInSeconds,
                vehicleDetail,
              };
            })
          );
          setRentalRequests(requestsWithExpiry);
        } else {
          setError("Failed to fetch rental requests or invalid response format.");
        }
      } catch (err) {
        setError("Error fetching rental requests.");
      } finally {
        setLoading(false);
      }
    };

    const fetchVehicleDetails = async (carId) => {
      try {
        const vehicleResponse = await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/${carId}`,
          {
            method: "GET",
          }
        );
        if (vehicleResponse && vehicleResponse.body) {
          setVehicleDetailsMap((prevMap) => ({
            ...prevMap,
            [carId]: vehicleResponse.body,
          }));
          return vehicleResponse.body;
        }
        return null;
      } catch (error) {
        return null;
      }
    };

    fetchRentalRequests();
  }, [apiCallWithRetry, vehicleDetailsMap, customer?.AccessToken]);

  if (loading) {
    return <div>Loading rental requests...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex md:flex-row flex-col justify-center md:pt-32 px-20 p-6 pt-28 bg-[#F8F8FF] min-h-screen">
      {/* Left Panel - Rental Requests */}
      <div className="md:w-1/3 w-full bg-white p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-bold text-[#00113D]">Rental Requests</h2>

        {rentalRequests?.map((request) => (
          <div
            key={request.id}
            className="p-4 w-full space-y-8 rounded-lg shadow-blue-100 shadow-md"
          >
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
                  request.expiresInSeconds <= 0 ? "bg-[#410002]" : "bg-[#00173C]"
                }`}
              >
                {request.expiresInSeconds > 0
                  ? formatTime(request.expiresInSeconds)
                  : "Expired"}
              </span>
            </div>

            <div className="grid grid-cols-2 text-sm text-gray-500 w-full gap-4 mt-4">
              <div className="flex items-center w-full gap-3">
                <img
                  src={image}
                  alt="Renter Profile"
                  className="w-16 h-16 rounded-full"
                />
                <div className="w-full">
                  <span className="font-medium text-black">Rentee Name</span>
                  <p className="">
                    {request.renteeInfo?.given_name || "Unknown Rentee"}
                  </p>
                </div>
              </div>
              <div className="h-full flex flex-col justify-center w-full">
                <span className="font-medium text-black">Rent Duration</span>
                <p className="">
                  {request.startDate && request.endDate
                    ? `${Math.ceil(
                        (new Date(request.endDate) - new Date(request.startDate)) /
                          (1000 * 60 * 60 * 24)
                      )} Days`
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="text-sm mb-4 space-y-2 w-full text-gray-500">
              <div className="grid grid-cols-2 gap-4 w-full mt-4">
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
            <div className="text-sm mb-4 space-y-2 w-full text-gray-500">
              <div className="grid grid-cols-2 gap-4 w-full mt-4">
                <div className="pl-4">
                  <span className="font-medium text-black">Total Payment</span>
                  <p className="font-medium text-black">
                    {request.amount} birr
                  </p>
                </div>
              </div>
            </div>

            <button
              className={`mt-3 w-full py-1 rounded-full ${
                request.expiresInSeconds <= 0
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-[#00113D] text-white"
              }`}
              onClick={() => setSelectedRequest(request)}
              disabled={request.expiresInSeconds <= 0}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Right Panel */}
      <div className="md:w-2/3 md:px-10 flex w-full space-y-6 flex-col">
        {selectedRequest ? (
          <>
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
                      {selectedRequest.approvedStatus}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#00113D]">
                      Request Date and Time
                    </p>
                    <p className="text-sm text-[#5A5A5A]">
                      {new Date(selectedRequest.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-44 flex justify-center items-center py-2 px-4 text-base rounded-xl bg-[#E9F1FE] text-[#4478EB]">
                    Booking Pending
                  </div>
                </div>
                <h2 className="text-lg mt-16 mb-4 font-semibold text-[#00113D]">
                  Car Details
                </h2>
                <div className="text-sm space-y-2 w-full text-gray-500">
                  <div className="grid grid-cols-2 gap-4 w-3/5 mt-4">
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
                  </div>
                </div>
              </section>

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
                            ? new Date(selectedRequest.startDate).toLocaleString()
                            : "N/A"}
                        </span>
                      </p>
                      <div className="ml-2 px-6 border-l pb-12 border-gray-300">
                        <p className="font-semibold">Pick Up Location</p>
                        <p>{selectedRequest.pickUp?.[0] || "Unknown location"}</p>
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
                        <p>{selectedRequest.dropOff?.[0] || "Unknown location"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <span className="font-medium text-black">Driver request</span>
                  <p className="text-gray-500">
                    {selectedRequest.driverRequest ? "Yes" : "No"}
                  </p>
                </div>
              </section>
            </div>
            <div>
              <section className="h-fit bg-white p-6 space-y-6 rounded-xl shadow-md">
                <h2 className="text-lg font-semibold text-[#00113D] mb-8">
                  Rentee Details
                </h2>
                <div className="items-center flex md:flex-row flex-col gap-8">
                  <img
                    src={image}
                    alt="Renter Profile"
                    className="w-32 h-32 rounded-full"
                  />
                  <div className="grid gap-4 md:grid-cols-2 grid-cols-1 justify-center items-center">
                    <h3 className="flex gap-4 text-sm text-[#5A5A5A]">
                      <IoPersonOutline size={18} />
                      {selectedRequest.renteeInfo?.given_name || "Unknown Rentee"}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
                      <MdOutlineLocalPhone size={18} />
                      <p>
                        {selectedRequest.renteeInfo?.phone_number || "Unknown"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
                      <MdOutlineMail size={18} />
                      <p>
                        {selectedRequest.renteeInfo?.email || "Unknown"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
                      <IoLocationOutline size={18} />
                      <p>
                        {selectedRequest.pickUp?.[0] || "Unknown location"}
                      </p>
                    </div>
                    <button
                      className="flex items-center gap-2 mt-4 px-16 py-3 text-xs border rounded-full border-[#00113D] text-[#00113D] bg-white"
                      onClick={() =>
                        handleChatWithRenter(
                          selectedRequest.renteeId,
                          selectedRequest.id
                        )
                      }
                    >
                      <IoChatboxOutline size={16} />
                      Chat With Renter
                    </button>
                  </div>
                </div>

                <div className="flex text-base gap-4">
                  <button
                    onClick={() => setIsModalVisible(true)}
                    className="flex-1 py-2 rounded-full bg-[#FDEAEA] text-red-700 border border-red-700"
                  >
                    Reject Request
                  </button>
                  {isModalVisible && (
                    <>
                      <div className="fixed inset-0 bg-black opacity-50 z-20"></div>
                      <div className="fixed inset-0 flex items-center justify-center z-30">
                        <div className="bg-white p-6 rounded-lg shadow-lg md:w-[350px]">
                          <h2 className="text-xl mb-4">
                            Are you sure you want to reject this request?
                          </h2>
                          <p className="text-gray-600 text-sm my-10">
                            Rejecting this request will notify the renter.
                          </p>
                          <div className="flex justify-between space-x-8">
                            <button
                              onClick={() => setIsModalVisible(false)}
                              className="bg-blue-950 text-xs flex items-center justify-center w-fit text-white rounded-full px-8 my-2 py-2"
                            >
                              Go Back
                            </button>
                            <button
                              onClick={handleCancelBooking}
                              className="bg-red-100 text-xs flex items-center justify-center w-fit text-red-600 hover:bg-red-600 hover:text-white rounded-full px-8 my-2 py-2"
                            >
                              Reject Request
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <button
                    className="flex-1 py-2 rounded-full bg-[#00113D] text-white"
                    onClick={() => setApproved(true)}
                  >
                    Approve Request
                  </button>
                  {approved && (
                    <div>
                      <div className="fixed inset-0 bg-black opacity-50 z-20"></div>
                      <div className="fixed scale-50 inset-0 flex self-center justify-center z-30 flex-col items-start p-6 gap-4 mx-auto bg-white rounded-lg shadow-md">
                        <div className="flex items-center w-full mb-4">
                          <button
                            onClick={() => setApproved(false)}
                            className="text-sm font-semibold text-black mr-2"
                          >
                            {"←"}
                          </button>
                          <h2 className="text-sm font-semibold text-black">
                            Booking Details
                          </h2>
                        </div>

                        <h1 className="text-lg font-bold text-black">
                          Terms and Conditions
                        </h1>
                        <h2 className="text-base font-semibold text-black">
                          Renting a Car
                        </h2>
                        <p className="text-xs text-gray-600">
                          Please read and accept the terms and conditions before
                          confirming your booking.
                        </p>
                        <div className="text-xs text-black leading-relaxed">
                          <h3 className="font-semibold text-black mb-2">
                            General Terms
                          </h3>
                          <ol className="list-decimal pl-6 text-gray-700">
                            <li>
                              Eligibility: You must be at least 21 years old and
                              hold a valid driver's license.
                            </li>
                            <li>
                              Rental Period: The rental period is defined in the
                              booking confirmation. Early returns will not be
                              refunded.
                            </li>
                            <li>
                              Usage: The vehicle is to be used for personal use
                              only and not for commercial purposes.
                            </li>
                            <li>
                              Responsibility: You are responsible for the
                              vehicle and any damage that occurs during the
                              rental period. Report any issues immediately.
                            </li>
                          </ol>

                          <h3 className="font-semibold text-black mt-4 mb-2">
                            Payment Terms
                          </h3>
                          <ol className="list-decimal pl-6 text-gray-700">
                            <li>
                              Charges: The rental fee includes the daily rate,
                              any additional mileage charges, and applicable
                              taxes.
                            </li>
                            <li>
                              Security Deposit: A security deposit will be held
                              on your credit card and refunded upon safe return
                              of the vehicle.
                            </li>
                            <li>
                              Payment Method: Payments are processed via our
                              integrated payment gateway. No cash payments are
                              accepted.
                            </li>
                          </ol>

                          <h3 className="font-semibold text-black mt-4 mb-2">
                            Insurance and Liability
                          </h3>
                          <ol className="list-decimal pl-6 text-gray-700">
                            <li>
                              Insurance: Basic insurance coverage is included in
                              your rental fee. Additional insurance options are
                              available.
                            </li>
                            <li>
                              Accidents: In the event of an accident, contact
                              local authorities and inform the car owner
                              immediately.
                            </li>
                            <li>
                              Damages: Any damages not covered by insurance will
                              be deducted from the security deposit. Excessive
                              damage may incur additional charges.
                            </li>
                          </ol>
                        </div>
                        <div className="flex items-center mt-4">
                          <input
                            type="checkbox"
                            id="acceptTerms"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                            className="w-5 h-5 mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label
                            htmlFor="acceptTerms"
                            className="text-xs font-medium text-black"
                          >
                            I accept the terms and conditions
                          </label>
                        </div>

                        <button
                          onClick={handleConfirmBooking}
                          className={`w-full py-2 mt-4 text-white text-sm rounded-full ${
                            isChecked
                              ? "bg-blue-950 hover:bg-blue-900"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!isChecked}
                        >
                          Approve Booking
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </>
        ) : (
          <div className="md:w-2/3 w-full bg-white p-6 rounded-xl shadow-md h-[400px] flex justify-center items-center">
            <p className="text-gray-500">
              Click "View Details" on a request to see more information.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalRequests;