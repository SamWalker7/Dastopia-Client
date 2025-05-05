import { FaRegCircle } from "react-icons/fa";
import image from "../../images/testimonials/avatar.png";
import {
    IoChatboxOutline,
    IoLocationOutline,
    IoPersonOutline,
} from "react-icons/io5";
import { MdOutlineLocalPhone, MdOutlineMail } from "react-icons/md";
import { useState, useEffect } from "react";

const MyRequests = () => {
    const [rentalRequests, setRentalRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [carDetailsMap, setCarDetailsMap] = useState({});
    const [renteeDetailsMap, setRenteeDetailsMap] = useState({});

    // Get customer from localStorage safely
    const customer = JSON.parse(localStorage.getItem("customer")) || {};
    const accessToken = customer?.AccessToken;

    const handleConfirmBooking = () => {
        setIsModalVisible(false);
        console.log("Booking confirmed");
    };

    const handleCancelBooking = () => {
        setIsModalVisible(false);
    };

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
    };

    const formatDateAndTime = (dateString) => {
        if (!dateString) return "N/A";

        try {
            const date = new Date(dateString);
            return date.toLocaleString(); // Using built-in locale formatting
        } catch (e) {
            console.error("Error formatting date:", e);
            return "N/A";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(); // Using built-in locale formatting
        } catch (e) {
            console.error("Error formatting date:", e);
            return "N/A";
        }
    };

    const fetchCarDetails = async (vehicleID) => {
        if (!vehicleID) return null;

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
                console.error(`Error fetching car ${vehicleID}: HTTP error! status: ${response.status}`);
                return { [vehicleID]: { brand: "Unavailable", model: "Unavailable", pictures: [] } };
            }

            const data = await response.json();
            return { [vehicleID]: data.body || data }; // Handle different API response structures
        } catch (error) {
            console.error(`Error fetching car ${vehicleID}:`, error);
            return {
                [vehicleID]: {
                    brand: "Unavailable",
                    model: "Unavailable",
                    pictures: []
                }
            };
        }
    };

    const fetchRenteeDetails = async (id) => {
        if (!id) return null;

        try {
            const response = await fetch(
                `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/user/${id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                console.error(`Error fetching rentee ${id}: HTTP error! status: ${response.status}`);
                return { [id]: { name: "N/A", phone: "N/A", email: "N/A", address: "N/A", profilePicture: null } };
            }

            const data = await response.json();
            return { [id]: data.body || data };
        } catch (error) {
            console.error(`Error fetching rentee ${id}:`, error);
            return { [id]: { name: "N/A", phone: "N/A", email: "N/A", address: "N/A", profilePicture: null } };
        }
    };

    const fetchRentalRequests = async () => {
        setLoading(true);
        setError(null);

        if (!accessToken) {
            setError("Authentication failed: Please log in again.");
            setLoading(false);
            return;
        }

        try {
            // Fetch rental requests
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
                throw new Error(`Failed to fetch requests: ${response.status}`);
            }

            const data = await response.json();
            const requests = Array.isArray(data.body) ? data.body : [];
            const pendingRequests = requests.filter(
                (request) => request.approvedStatus?.toLowerCase()?.trim() === "pending"
            );

            setRentalRequests(pendingRequests);

            // Fetch car details for each unique carId
            const carIds = [...new Set(pendingRequests.map(req => req.carId).filter(Boolean))];
            const carDetailsResults = await Promise.all(carIds.map(fetchCarDetails));

            const fetchedCarDetails = {};
            carDetailsResults.forEach(result => {
                if (result) {
                    Object.assign(fetchedCarDetails, result);
                }
            });
            setCarDetailsMap(fetchedCarDetails);

            // Fetch rentee details for each unique renteeId
            const renteeIds = [...new Set(pendingRequests.map(req => req.renteeId).filter(Boolean))];
            const renteeDetailsResults = await Promise.all(renteeIds.map(fetchRenteeDetails));

            const fetchedRenteeDetails = {};
            renteeDetailsResults.forEach(result => {
                if (result) {
                    Object.assign(fetchedRenteeDetails, result);
                }
            });
            setRenteeDetailsMap(fetchedRenteeDetails);

            // Set first request as selected if available
            if (pendingRequests.length > 0 && !selectedRequest) {
                setSelectedRequest(pendingRequests[0]);
            }
        } catch (err) {
            setError(err.message);
            console.error("Error fetching rental requests:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRentalRequests();
    }, [accessToken]);

    if (error) {
        return (
            <div className="flex justify-center md:pt-40 p-8 bg-[#F8F8FF] min-h-screen">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold text-red-600 mb-4">Error</h2>
                    <p className="text-lg text-gray-600">{error}</p>
                    <button
                        onClick={fetchRentalRequests}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center md:pt-40 p-8 bg-[#F8F8FF] min-h-screen">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold text-[#00113D] mb-4">
                        Loading your requests...
                    </h2>
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (rentalRequests.length === 0) {
        return (
            <div className="flex justify-center md:pt-40 p-8 bg-[#F8F8FF] min-h-screen">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold text-[#00113D] mb-4">
                        My Requests
                    </h2>
                    <p className="text-lg text-gray-600">You have no pending rental requests.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row justify-center md:pt-20 p-4 md:p-8 bg-[#F8F8FF] min-h-screen gap-4">
            {/* Left sidebar - Request list */}
            <div className="w-full md:w-1/3 bg-white p-4 md:p-6 rounded-xl shadow-md space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[#00113D]">My Requests</h2>

                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {rentalRequests.map((request, index) => (
                        <div
                            key={request.id || index}
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
                                        <label className="font-medium text-black">Car Brand</label>
                                        <p className="truncate">
                                            {carDetailsMap[request.carId]?.brand || "Unavailable"}
                                        </p>
                                    </div>
                                    <div className="w-full">
                                        <label className="font-medium text-black">Car Model</label>
                                        <p className="truncate">
                                            {carDetailsMap[request.carId]?.model || "Unavailable"}
                                        </p>
                                    </div>
                                    <div className="pl-2">
                                        <label className="font-medium text-black">Request Date</label>
                                        <p className="truncate">
                                            {formatDateAndTime(request.createdAt)}
                                        </p>
                                    </div>
                                    <div className="w-full">
                                        <label className="font-medium text-black">Rent Duration</label>
                                        <p className="truncate">
                                            {formatDate(request.startDate)} - {formatDate(request.endDate)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                <div>
                                    <label className="font-medium text-black">Status</label>
                                    <div className={`w-fit px-3 py-1 text-sm rounded-xl ${
                                        request.approvedStatus?.toLowerCase() === "pending"
                                            ? "bg-[#E9F1FE] text-[#4478EB]"
                                            : request.approvedStatus?.toLowerCase() === "approved"
                                                ? "bg-green-100 text-green-600"
                                                : "bg-red-100 text-red-600"
                                    }`}>
                                        {request.approvedStatus || "N/A"}
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewDetails(request);
                                    }}
                                    className="mt-2 px-4 py-2 rounded-full bg-[#00113D] text-white text-sm"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right side - Request details */}
            <div className="w-full md:w-2/3 space-y-4">
                {selectedRequest && (
                    <>
                        {/* Request Summary and Car Details */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <section className="w-full md:w-1/2 bg-white p-4 md:p-6 rounded-xl shadow-md">
                                <h2 className="text-xl md:text-2xl font-semibold text-[#00113D] mb-4">
                                    Request Summary
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div>
                                            <label className="font-medium text-[#00113D]">Status</label>
                                            <p className="text-[#5A5A5A]">
                                                {selectedRequest.approvedStatus || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="font-medium text-[#00113D]">Request Date</label>
                                            <p className="text-[#5A5A5A]">
                                                {formatDateAndTime(selectedRequest.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={`w-fit px-4 py-2 rounded-xl ${
                                        selectedRequest.approvedStatus?.toLowerCase() === "pending"
                                            ? "bg-[#E9F1FE] text-[#4478EB]"
                                            : selectedRequest.approvedStatus?.toLowerCase() === "approved"
                                                ? "bg-green-100 text-green-600"
                                                : "bg-red-100 text-red-600"
                                    }`}>
                                        {selectedRequest.approvedStatus || "N/A"}
                                    </div>
                                </div>

                                <h2 className="text-xl md:text-2xl mt-8 mb-4 font-semibold text-[#00113D]">
                                    Car Details
                                </h2>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="font-medium text-black">Brand</label>
                                            <p>
                                                {carDetailsMap[selectedRequest.carId]?.brand || "Unavailable"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="font-medium text-black">Model</label>
                                            <p>
                                                {carDetailsMap[selectedRequest.carId]?.model || "Unavailable"}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="font-medium text-black">Pictures</label>
                                        {carDetailsMap[selectedRequest.carId]?.pictures?.length > 0 ? (
                                            <div className="flex gap-2 mt-2">
                                                {carDetailsMap[selectedRequest.carId].pictures.slice(0, 3).map((pic, i) => (
                                                    <div key={i} className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                                                        <img
                                                            src={pic}
                                                            alt={`Car ${i + 1}`}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = image;
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                                {carDetailsMap[selectedRequest.carId].pictures.length > 3 && (
                                                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                                                        +{carDetailsMap[selectedRequest.carId].pictures.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">No pictures available</p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Rental Details */}
                            <section className="w-full md:w-1/2 bg-white p-4 md:p-6 rounded-xl shadow-md">
                                <h2 className="text-xl md:text-2xl font-semibold text-[#00113D] mb-4">
                                    Rental Details
                                </h2>

                                <div className="space-y-6">
                                    <div className="flex flex-col">
                                        <div className="flex items-start gap-2">
                                            <FaRegCircle className="text-gray-400 mt-1" />
                                            <div>
                                                <p className="font-medium">
                                                    Pick-up: {formatDate(selectedRequest.startDate)}
                                                </p>
                                                <div className="ml-4 pl-4 border-l border-gray-300 my-2">
                                                    <p className="font-semibold">
                                                        {selectedRequest.pickUp?.[0] || "Location not specified"}
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
                                            <FaRegCircle className="text-gray-400 mt-1" />
                                            <div>
                                                <p className="font-medium">
                                                    Drop-off: {formatDate(selectedRequest.endDate)}
                                                </p>
                                                <div className="ml-4 pl-4 my-2">
                                                    <p className="font-semibold">
                                                        {selectedRequest.dropOff?.[0] || "Location not specified"}
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

                                    <div>
                                        <label className="font-medium text-black">Special Requests</label>
                                        <p className="text-gray-500 mt-1">
                                            {selectedRequest.specialRequests || "None"}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Rentee Details */}
                        <section className="bg-white p-4 md:p-6 rounded-xl shadow-md">
                            <h2 className="text-xl md:text-2xl font-semibold text-[#00113D] mb-4">
                                Rentee Details
                            </h2>

                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <img
                                    src={renteeDetailsMap[selectedRequest.renteeId]?.profilePicture || image}
                                    alt="Renter Profile"
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = image;
                                    }}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                    <div className="flex items-center gap-3">
                                        <IoPersonOutline size={18} className="text-gray-500" />
                                        <div>
                                            <label className="font-medium text-black">Name</label>
                                            <p className="text-gray-600">
                                                {renteeDetailsMap[selectedRequest.renteeId]?.name || "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <MdOutlineLocalPhone size={18} className="text-gray-500" />
                                        <div>
                                            <label className="font-medium text-black">Phone</label>
                                            <p className="text-gray-600">
                                                {renteeDetailsMap[selectedRequest.renteeId]?.phone || "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <MdOutlineMail size={18} className="text-gray-500" />
                                        <div>
                                            <label className="font-medium text-black">Email</label>
                                            <p className="text-gray-600">
                                                {renteeDetailsMap[selectedRequest.renteeId]?.email || "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <IoLocationOutline size={18} className="text-gray-500" />
                                        <div>
                                            <label className="font-medium text-black">Address</label>
                                            <p className="text-gray-600">
                                                {renteeDetailsMap[selectedRequest.renteeId]?.address || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button className="flex items-center gap-2 px-6 py-3 text-base border rounded-full border-[#00113D] text-[#00113D] bg-white hover:bg-[#00113D] hover:text-white transition-colors">
                                    <IoChatboxOutline size={16} />
                                    Chat With Renter
                                </button>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={() => setIsModalVisible(true)}
                                    className="flex-1 py-3 rounded-full bg-[#FDEAEA] text-red-700 border border-red-700 hover:bg-red-700 hover:text-white transition-colors"
                                >
                                    Cancel Booking
                                </button>
                            </div>
                        </section>
                    </>
                )}
            </div>

            {/* Cancel Booking Modal */}
            {isModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">
                            Confirm Booking Cancellation
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to cancel this booking request? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setIsModalVisible(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={() => {
                                    console.log("Cancelling booking:", selectedRequest.id);
                                    setIsModalVisible(false);
                                    // Add your actual cancellation logic here
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Confirm Cancellation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyRequests;