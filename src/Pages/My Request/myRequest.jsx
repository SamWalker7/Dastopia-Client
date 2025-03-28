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
    const [rentalRequests, setRentalRequests] = useState(); // Initialize as an empty array
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const customer = JSON.parse(localStorage.getItem("customer"));

    const handleConfirmBooking = () => {
        setIsModalVisible(false);
        // Add your Booking account logic here
        console.log("Account Bookingd");
    };

    const handleCancelBooking = () => {
        setIsModalVisible(false);
    };

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
    };

    useEffect(() => {
        const fetchRentalRequests = async () => {
            setLoading(true);
            setError(null);
            if (!customer || !customer.AccessToken) {
                setError("Authentication failed: Access token not found.");
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(
                    "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/get_all_rentee_booking",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${customer.AccessToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const pendingRequests = data.body.filter(
                    (request) => request.status?.toLowerCase() === "pending"
                );
                setRentalRequests(pendingRequests);
                if (pendingRequests.length > 0 && !selectedRequest) {
                    setSelectedRequest(pendingRequests[0]); // Select the first pending request by default
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRentalRequests();
    },[customer.AccessToken]); // Empty dependency array means this runs once after the initial render

    if (error) {
        return (
            <div className="flex justify-center md:pt-40 p-8 bg-[#F8F8FF] min-h-screen">
                Error loading rental requests: {error}
            </div>
        );
    }

    return (
        <div className="flex justify-center md:pt-40 p-8 bg-[#F8F8FF] min-h-screen">
            {loading ? (
                <div>Loading rental requests...</div>
            ) : rentalRequests?.length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold text-[#00113D] mb-4">
                        My Requests
                    </h2>
                    <p className="text-lg text-gray-600">There are no rental requests.</p>
                </div>
            ) : (
                <>
                    {/* Left Panel - Rental Requests */}
                    <div className="w-1/4 bg-white p-6 rounded-xl shadow-md space-y-4">
                        <h2 className="text-3xl font-bold text-[#00113D]">My Requests</h2>

                        {rentalRequests?.map((request, index) => (
                            <div
                                key={index}
                                className={`p-4 space-y-8 rounded-lg shadow-blue-100 shadow-md cursor-pointer ${
                                    selectedRequest?.id === request.id
                                        ? "border-2 border-[#00113D]"
                                        : ""
                                }`}
                                onClick={() => handleViewDetails(request)}
                            >
                                <div className="text-lg mb-4 space-y-2 w-full text-gray-500">
                                    <div className="grid grid-cols-2 gap-4 w-full mt-4">
                                        <div className="pl-4">
                                            <label className="font-medium text-black">Car Brand</label>
                                            <p className="">{request.carDetails?.brand || "N/A"}</p>
                                        </div>
                                        <div className="ml-24 w-full">
                                            <label className="font-medium text-black">Car Model</label>
                                            <p className="">{request.carDetails?.model || "N/A"}</p>
                                        </div>{" "}
                                        <div className="pl-4">
                                            <label className="font-medium text-black">
                                                Rental Request Date
                                            </label>
                                            <p className="">{request.rentalRequestDate || "N/A"}</p>
                                        </div>
                                        <div className="ml-24 w-full">
                                            <label className="font-medium text-black">Rent Duration</label>
                                            <p className="">{request.rentDuration || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-lg mb-4 space-y-2 w-full text-gray-500">
                                    <div className="grid grid-cols-3 gap-4 w-full mt-4">
                                        <div className="pl-4">
                                            <label className="font-medium text-black">Status</label>
                                            <div
                                                className={`w-44 flex justify-center items-center py-2 px-4 text-base rounded-xl bg-[#E9F1FE] text-[#4478EB] my-2`}
                                            >
                                                {request.status || "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleViewDetails(request)}
                                    className="mt-3 w-full py-3 rounded-full bg-[#00113D] text-white "
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className=" w-2/3 px-10 flex space-y-6 flex-col">
                        {/* Right Panel - Request Summary */}
                        {selectedRequest && (
                            <>
                                <div className="flex gap-10">
                                    {/* Request Summary */}
                                    <section className="w-1/2 bg-white p-6 rounded-xl shadow-md">
                                        <h2 className="text-2xl font-semibold text-[#00113D] mb-8">
                                            Request Summary
                                        </h2>
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <label className="font-medium text-lg text-[#00113D]">
                                                    Request Status
                                                </label>
                                                <p className="text-lg text-[#5A5A5A]">
                                                    {selectedRequest.status || "N/A"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="font-medium text-lg text-[#00113D] ">
                                                    Request Date and Time
                                                </label>
                                                <p className="text-lg text-[#5A5A5A]">
                                                    {selectedRequest.requestDateTime || "N/A"}
                                                </p>
                                            </div>
                                            <div
                                                className={`w-44 flex justify-center items-center py-2 px-4 text-base rounded-xl bg-[#E9F1FE] text-[#4478EB]`}
                                            >
                                                {selectedRequest.status || "N/A"}
                                            </div>
                                        </div>
                                        <h2 className="text-2xl mt-16 mb-4 font-semibold text-[#00113D] ">
                                            Car Details
                                        </h2>
                                        <div className="text-lg space-y-2 w-full text-gray-500">
                                            <div className="grid grid-cols-2 gap-4 w-3/5 mt-4">
                                                <div className="">
                                                    <label className="font-medium text-black">Car Brand</label>
                                                    <p className="">
                                                        {selectedRequest.carDetails?.brand || "N/A"}
                                                    </p>
                                                </div>
                                                <div className=" w-full">
                                                    <label className="font-medium text-black">Car Model</label>
                                                    <p className="">
                                                        {selectedRequest.carDetails?.model || "N/A"}
                                                    </p>
                                                </div>
                                                <div className=" w-full">
                                                    <label className="font-medium text-black">Pictures</label>
                                                    <p className=" underline cursor-pointer ">
                                                        View Pictures
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Rental Details */}
                                    <section className="w-1/2 bg-white p-6 rounded-xl shadow-md">
                                        <h2 className="text-2xl font-semibold text-[#00113D] mb-8">
                                            Rental Details
                                        </h2>
                                        <div className="flex flex-col text-lg text-[#5A5A5A]">
                                            <div className="flex items-start gap-2">
                                                <div>
                                                    <p className="flex items-center ">
                                                        <FaRegCircle className="text-gray-400" />
                                                        <span className="px-4">
                                                            {selectedRequest.rentalDetails?.pickupDate || "N/A"}{" "}
                                                            -{" "}
                                                            {selectedRequest.rentalDetails?.pickupTime || "N/A"}
                                                        </span>
                                                    </p>
                                                    <div className="ml-2 px-6 border-l pb-12 border-gray-300">
                                                        {" "}
                                                        <p className="font-semibold">
                                                            {selectedRequest.rentalDetails?.pickupLocation ||
                                                                "N/A"}
                                                        </p>
                                                        <a href="#" className="text-blue-800 underline">
                                                            View Pick-up detail instructions
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div>
                                                    <p className="flex items-center">
                                                        {" "}
                                                        <FaRegCircle className="text-gray-400" />{" "}
                                                        <span className="px-4">
                                                            {selectedRequest.rentalDetails?.dropoffDate ||
                                                                "N/A"}{" "}
                                                            -{" "}
                                                            {selectedRequest.rentalDetails?.dropoffTime ||
                                                                "N/A"}
                                                        </span>
                                                    </p>
                                                    <div className="ml-2 px-6 pb-8 ">
                                                        {" "}
                                                        <p className="font-semibold">
                                                            {selectedRequest.rentalDetails?.dropoffLocation ||
                                                                "N/A"}
                                                        </p>
                                                        <a href="#" className="text-blue-800 underline">
                                                            View Pick-up detail instructions
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 text-lg">
                                            <label className="font-medium text-black">
                                                {" "}
                                                Driver request
                                            </label>
                                            <p className="text-gray-500">
                                                {selectedRequest.rentalDetails?.driverRequired
                                                    ? "Yes"
                                                    : "No" || "N/A"}
                                            </p>
                                        </div>
                                    </section>
                                </div>
                                <div>
                                    {/* Rentee Details */}
                                    <section className="h-fit bg-white p-6 space-y-6 rounded-xl shadow-md">
                                        <h2 className="text-2xl font-semibold text-[#00113D] mb-8">
                                            Rentee Details
                                        </h2>
                                        <div className=" items-center flex gap-8">
                                            <img
                                                src={image}
                                                alt="Renter Profile"
                                                className="w-40 h-40 rounded-full"
                                            />
                                            <div className="grid gap-4 grid-cols-2">
                                                <h3 className="flex gap-4 text-lg text-[#5A5A5A]">
                                                    <IoPersonOutline size={18} />{" "}
                                                    <label>{selectedRequest.renteeDetails?.name || "N/A"}</label>
                                                </h3>
                                                <div className="flex items-center gap-4 text-lg text-[#5A5A5A] mt-1">
                                                    <MdOutlineLocalPhone size={18} />
                                                    <label>{selectedRequest.renteeDetails?.phone || "N/A"}</label>
                                                </div>
                                                <div className="flex items-center gap-4 text-lg text-[#5A5A5A] mt-1">
                                                    <MdOutlineMail size={18} />
                                                    <label>{selectedRequest.renteeDetails?.email || "N/A"}</label>
                                                </div>
                                                <div className="flex items-center gap-4 text-lg text-[#5A5A5A] mt-1">
                                                    <IoLocationOutline size={18} />
                                                    <label>{selectedRequest.renteeDetails?.address || "N/A"}</label>
                                                </div>
                                                <button className="flex items-center gap-2 mt-4 px-16 py-3 text-base border rounded-full border-[#00113D] text-[#00113D] bg-white">
                                                    <IoChatboxOutline size={16} />
                                                    Chat With Renter
                                                </button>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-4">
                                            <>
                                                <button
                                                    onClick={() => setIsModalVisible(true)}
                                                    className="flex-1 py-4 rounded-full bg-[#FDEAEA] text-red-700 border border-red-700"
                                                >
                                                    Cancel Booking
                                                </button>

                                                {/* Modal rendering, displayed based on `isModalVisible` */}
                                                {isModalVisible && (
                                                    <>
                                                        {/* Overlay background */}
                                                        <div className="fixed inset-0 bg-black opacity-50 z-20"></div>

                                                        {/* Modal content */}
                                                        <div className="fixed inset-0 flex items-center justify-center z-30">
                                                            <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
                                                                <h2 className="text-3xl mb-4">
                                                                    Are you sure you want to cancel this Booking
                                                                    request?
                                                                </h2>
                                                                <p className="text-gray-600 text-lg my-10">
                                                                    Cancelling a request will cause you to reenter
                                                                    the request from the start.
                                                                </p>
                                                                <div className="flex justify-between space-x-8">
                                                                    <button
                                                                        onClick={() => {
                                                                            handleCancelBooking(); // Perform cancel booking action
                                                                            setIsModalVisible(false); // Close modal
                                                                        }}
                                                                        className="bg-blue-950 text-base flex items-center justify-center w-fit text-white rounded-full px-8 my-2 py-4"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            // Assuming you have logic to actually cancel the booking via API
                                                                            // You would likely call an API here to update the booking status
                                                                            console.log(
                                                                                "Booking cancellation initiated for request ID:",
                                                                                selectedRequest.id
                                                                            );
                                                                            setIsModalVisible(false); // Close modal
                                                                            // Optionally, you might want to refresh the list of requests
                                                                            // or update the UI to reflect the cancellation.
                                                                        }}
                                                                        className="bg-red-100 text-base flex items-center justify-center w-fit text-red-600 hover:bg-red-600 hover:text-white rounded-full px-8 my-2 py-4"
                                                                    >
                                                                        Confirm Cancel
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        </div>
                                    </section>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default MyRequests;