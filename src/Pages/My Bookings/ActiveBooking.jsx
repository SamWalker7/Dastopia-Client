import Footer from "../../components/Footer";
// ActiveRental seems to be a separate component for the tab, not modified here
import ActiveRental from "./ActiveRental";
import { useEffect, useState, useCallback, useMemo } from "react";
import image from "../../images/testimonials/avatar.png"; // Used as fallback/placeholder
import { useNavigate } from "react-router-dom";

import {
  IoChatboxOutline,
  IoFileTray,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { MdOutlineLocalPhone, MdOutlineMail } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa";
import { IconButton, CircularProgress } from "@mui/material"; // Added CircularProgress for loading

// Import the useVehicleFormStore to access apiCallWithRetry
import useVehicleFormStore from "../../store/useVehicleFormStore";

const ActivBooking = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("ActiveBooking");
  // `isModalVisible` and `isChecked` seem unused based on usage, removing.
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);

  const [approved, setApproved] = useState(false); // Controls Return Car modal visibility
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [otherComments, setOtherComments] = useState("");

  const customer = JSON.parse(localStorage.getItem("customer")) || {}; // Get customer safely
  const noActiveBookingsMessage = "There are no active bookings.";

  const [files, setFiles] = useState({
    front: null,
    right: null,
    left: null,
    rear: null,
    interior: null,
  });

  const [loadingBookings, setLoadingBookings] = useState(true); // Loading state for fetching bookings
  const [loadingCarDetails, setLoadingCarDetails] = useState(false); // Loading state for fetching car details
  const [bookingError, setBookingError] = useState(null); // Error state for fetching bookings
  const [carDetailsError, setCarDetailsError] = useState(null); // Error state for fetching car details
  const [actionLoading, setActionLoading] = useState(false); // Loading state for modal actions

  const [carDetails, setCarDetails] = useState(null); // Details of the car for the *currently displayed* active booking

  const [activeBookings, setActiveBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null); // State to track the selected booking

  // Access apiCallWithRetry from the Zustand store
  const { apiCallWithRetry } = useVehicleFormStore();

  // Get owner details from localStorage for chat initiation (used in handleChatWithRentee)
  const ownerId = customer?.username || customer?.id; // Use `id` as a fallback for username
  // ownerGivenName and ownerFamilyName are not actually used in handleChatWithRentee
  // const ownerGivenName = customer?.given_name || customer?.firstName || "";
  // const ownerFamilyName = customer?.family_name || customer?.lastName || "";
  // customerAccessToken is now handled internally by apiCallWithRetry from the store
  // const customerAccessToken = customer?.AccessToken;

  const conditions = [
    "Scratches",
    "Dents",
    "Broken Lights",
    "Interior damages",
    // Removed duplicate "Car Condition Report" entries
  ];

  const handleCheckboxChange = useCallback((condition) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((item) => item !== condition)
        : [...prev, condition]
    );
  }, []);

  const handleFileChange = useCallback((e, side) => {
    const file = e.target.files[0];
    setFiles((prev) => ({ ...prev, [side]: file }));
  }, []);

  // Handler for the "Return Car" modal form submission
  const handleReturnCarSubmit = useCallback(
    async (bookingId) => {
      // Accept bookingId as parameter
      // TODO: Add API call for submitting condition report using bookingId

      // Example API call structure (replace with your actual endpoint and payload)
      // Note: File uploads require getting presigned URLs first, then uploading.
      // This is complex and not fully implemented here.
      // const payload = {
      //     bookingId: bookingId,
      //     conditions: selectedConditions,
      //     comments: otherComments,
      //     // Files need to be uploaded to S3 first, similar to vehicle images/docs
      //     // You would get presigned URLs for these files, upload them,
      //     // and include the S3 keys in your payload. This is a significant
      //     // piece of logic missing here.
      //     fileKeys: [] // Placeholder for file keys after S3 upload
      // };

      console.log(
        `Attempting to submit condition report for booking ${bookingId}...`
      );
      // console.log("Payload (partial):", payload); // Log partial payload structure

      // try {
      //     setActionLoading(true); // Indicate action is loading
      //     const responseData = await apiCallWithRetry( // Use store's apiCallWithRetry
      //         `YOUR_RETURN_CAR_REPORT_API_ENDPOINT`, // Replace with actual endpoint
      //         {
      //             method: 'POST', // Or PUT
      //             // apiCallWithRetry from store handles Authorization header
      //             body: JSON.stringify(payload) // Send the payload
      //         }
      //         // Token is handled internally by the store's apiCallWithRetry
      //     );

      //     console.log("Report submission response:", responseData);
      //     // Assuming success doesn't throw but returns a specific status/structure
      //     // Adjust this success check based on your API response structure
      //     if (responseData && responseData.successIndicator) { // Replace successIndicator
      //          console.log("Condition report submitted successfully.");
      //          // Optionally update UI, maybe refetch the list or update item in list
      //     } else {
      //          // Handle API-specific errors from response body if not thrown by apiCallWithRetry
      //          const errorMessage = responseData?.message || 'Unknown error submitting report.';
      //          console.error("Failed to submit report:", responseData);
      //          setBookingError(`Failed to submit report: ${errorMessage}`);
      //     }
      // } catch (err) {
      //     console.error("Error submitting report:", err);
      //     setBookingError(`Error submitting report: ${err.message}`); // Use booking error state or separate action error state
      // } finally {
      //      setActionLoading(false);
      //      // Close the modal regardless of success/failure for now,
      //      // but ideally you might keep it open on failure to show the error.
      //      setApproved(false);
      //      // Reset form fields regardless
      //      setSelectedConditions([]);
      //      setOtherComments("");
      //      setFiles({
      //        front: null, right: null, left: null, rear: null, interior: null,
      //      });
      //      // If submission was real and successful, you might refetch getOwnerBookings() here
      //      // to update the list status if needed.
      // }

      // Placeholder: Simulate success and close modal
      console.log("Simulating report submission success...");
      setApproved(false); // Close the modal after submit
      // Reset form fields
      setSelectedConditions([]);
      setOtherComments("");
      setFiles({
        front: null,
        right: null,
        left: null,
        rear: null,
        interior: null,
      });
      // If submission was real, you might refetch getOwnerBookings() here
    },
    [selectedConditions, otherComments, files] // Dependencies for the form data
  );

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      // Check if dateString is a valid date representation before parsing
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If parsing results in an invalid date, handle the error
        console.error("Invalid date string provided:", dateString);
        return "Invalid Date"; // Or any other suitable indicator
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      // Catch any other errors during date processing
      console.error("Error formatting date:", dateString, e);
      return "Error Formatting Date";
    }
  }, []);

  // --- Fetch Owner Bookings and Filter Active ---
  const getOwnerBookings = useCallback(async () => {
    setLoadingBookings(true);
    setBookingError(null);
    setActiveBookings([]); // Clear list
    setSelectedBooking(null); // Clear selected booking
    setCarDetails(null); // Clear car details
    setCarDetailsError(null); // Clear car details error

    // apiCallWithRetry from the store handles the token check internally

    try {
      // Use apiCallWithRetry from the store
      const data = await apiCallWithRetry(
        "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/get_all_owner_booking", // Endpoint to get bookings *for this owner*
        { method: "GET" }
        // Token is handled internally by the store's apiCallWithRetry
      );

      console.log("Owner Bookings Response:", data);

      const bookings = Array.isArray(data?.body) ? data.body : []; // Ensure data.body is an array

      const currentDate = new Date();

      const currentlyActiveBookings = bookings.filter((booking) => {
        // Basic checks for required properties
        if (
          !booking ||
          !booking.startDate ||
          !booking.endDate ||
          !booking.approvedStatus ||
          !booking.isPayed
        ) {
          // console.warn("Skipping booking due to missing required properties:", booking?.id, booking);
          return false; // Skip bookings with missing essential info
        }

        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);

        // Check if dates are valid AND current date is within the range
        const isDateActive =
          !isNaN(startDate.getTime()) &&
          !isNaN(endDate.getTime()) &&
          currentDate >= startDate &&
          currentDate <= endDate;

        // Check if status is approved or active (and NOT pending or denied)
        const isStatusApprovedOrActive =
          booking.approvedStatus.toLowerCase() !== "pending" &&
          booking.approvedStatus.toLowerCase() !== "denied";
        // You might want to explicitly list allowed statuses, e.g., ['approved', 'active'].includes(booking.approvedStatus?.toLowerCase())

        // --- NEW CONDITION: Check if isPayed status is "success" ---
        const isPaymentSuccessful =
          booking.isPayed?.toLowerCase() === "success";

        // A booking is truly active if its dates are currently valid
        // AND its status is approved/active AND payment is successful
        return isDateActive && isStatusApprovedOrActive && isPaymentSuccessful;
      });

      console.log("Filtered Active Bookings:", currentlyActiveBookings);
      setActiveBookings(currentlyActiveBookings); // Set the filtered list

      if (currentlyActiveBookings.length > 0) {
        // Automatically select the first booking to load its details
        setSelectedBooking(currentlyActiveBookings[0]);
        // setCarId will be called in the useEffect triggered by setSelectedBooking
      } else {
        setSelectedBooking(null); // Ensure selected is null if no active bookings
      }
    } catch (error) {
      console.error("Error during owner booking fetch:", error);
      setBookingError("Failed to load active bookings: " + error.message);
      setActiveBookings([]);
      setSelectedBooking(null);
    } finally {
      setLoadingBookings(false);
    }
  }, [apiCallWithRetry]); // Depend only on apiCallWithRetry

  // --- Fetch Car Details for the Selected Booking's Car ID ---
  const fetchCarDetails = useCallback(async () => {
    // Only fetch if there's a selected booking AND its carId is available
    if (!selectedBooking?.carId) {
      // Token check handled by apiCallWithRetry
      setCarDetails(null); // Clear details if carId is missing
      setLoadingCarDetails(false);
      setCarDetailsError(null);
      return;
    }

    setLoadingCarDetails(true);
    setCarDetailsError(null);
    const apiUrl = `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/${selectedBooking.carId}`;

    try {
      // Use apiCallWithRetry from the store
      const data = await apiCallWithRetry(apiUrl, { method: "GET" });

      console.log("Car Details Response:", data);
      if (data && data.body) {
        setCarDetails(data.body);
      } else {
        console.error("Failed to fetch car details or invalid format:", data);
        setCarDetails(null);
        setCarDetailsError("Invalid car details format.");
      }
    } catch (error) {
      console.error(
        `Error fetching car details for ${selectedBooking.carId}:`,
        error
      );
      setCarDetails(null);
      setCarDetailsError("Failed to load car details: " + error.message);
    } finally {
      setLoadingCarDetails(false);
    }
  }, [selectedBooking?.carId, apiCallWithRetry]); // Depend on selectedBooking's carId and apiCallWithRetry

  // --- Effect 1: Fetch bookings on mount and when apiCallWithRetry changes ---
  useEffect(() => {
    getOwnerBookings();
  }, [getOwnerBookings]); // Depend on the memoized getOwnerBookings fetcher

  // --- Effect 2: Fetch car details when selectedBooking changes (specifically its carId) ---
  useEffect(() => {
    fetchCarDetails();
  }, [fetchCarDetails]); // Depend on the memoized fetchCarDetails fetcher

  // --- Handler for Chat With Rentee button ---
  const handleChatWithRentee = useCallback(
    (booking) => {
      const renteeId = booking?.renteeId;
      const bookingId = booking?.id;
      const carId = booking?.carId;
      // Access renteeInfo directly from the booking object
      const renteeInfo = booking?.renteeInfo;
      const renteeGivenName = renteeInfo?.given_name || "";
      const renteeFamilyName = renteeInfo?.family_name || "";

      // Owner details from localStorage (already retrieved outside useCallback)
      const currentOwnerId = ownerId; // Use ownerId from state derived from localStorage

      if (!currentOwnerId) {
        console.error("Chat Error: Owner ID not found.");
        alert("Your user ID is missing. Cannot initiate chat.");
        return;
      }
      if (!renteeId) {
        console.error(
          `Chat Error: Rentee ID not found for booking ${bookingId}.`
        );
        alert("Rentee details missing. Cannot initiate chat.");
        return;
      }
      if (!renteeInfo) {
        console.warn(
          `Chat Warning: renteeInfo missing for booking ${bookingId}.`
        );
        // Continue, but user might not see rentee name in chat UI depending on implementation
      }

      // Construct the chat URL.
      // userId1 is the initiator (Owner), userId2 is the target (Rentee)
      // Pass the *rentee's* name in the URL parameters, as the chat component might display the *other* user's name based on these.
      const chatUrl = `/chat?userId1=${encodeURIComponent(
        currentOwnerId || ""
      )}&userId2=${encodeURIComponent(
        renteeId || ""
      )}&bookingId=${encodeURIComponent(
        bookingId || ""
      )}&carId=${encodeURIComponent(
        carId || ""
      )}&given_name=${encodeURIComponent(
        renteeGivenName || ""
      )}&family_name=${encodeURIComponent(renteeFamilyName || "")}`;

      console.log(
        `Navigating to chat: Owner ID=${currentOwnerId}, Rentee ID=${renteeId}, Booking ID=${bookingId}, Car ID=${carId}`
      );

      navigate(chatUrl);
    },
    [navigate, ownerId] // Depend on navigate and ownerId
  );

  // Handler for "Cancel Booking" action (example - endpoint might be different for active bookings)
  const handleCancelBooking = useCallback(
    async (bookingId) => {
      if (!bookingId) {
        console.warn("Cannot cancel booking, ID is missing.");
        return;
      }

      setActionLoading(true);
      setBookingError(null); // Clear previous errors

      try {
        // Assuming there's an API endpoint for canceling active bookings by owner
        // Use apiCallWithRetry from the store
        const response = await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/cancel_booking/${bookingId}`, // Example endpoint, replace if different
          { method: "POST" } // Method might be POST or DELETE
          // Token is handled internally by the store's apiCallWithRetry
        );

        // Assuming success doesn't throw but returns a specific status/structure
        // Adjust this success check based on your API response structure
        if (response && response.successIndicator) {
          // Replace successIndicator with actual success check
          console.log(`Booking ${bookingId} cancelled successfully.`);
          // Remove the cancelled booking from the list
          setActiveBookings((prev) => prev.filter((b) => b.id !== bookingId));
          // Deselect if it was the selected one
          if (selectedBooking?.id === bookingId) {
            setSelectedBooking(null);
            setCarDetails(null); // Clear details too
            setCarDetailsError(null);
          }
          // Refresh the list after successful cancellation
          getOwnerBookings(); // Refetch the list
        } else {
          // Handle API-specific errors from response body if not thrown by apiCallWithRetry
          const errorMessage =
            response?.message || "Unknown error cancelling booking.";
          console.error("Failed to cancel booking:", response);
          setBookingError(`Failed to cancel booking: ${errorMessage}`);
        }
      } catch (err) {
        console.error("Error cancelling booking:", err);
        setBookingError("Error cancelling booking: " + err.message);
      } finally {
        setActionLoading(false);
      }
    },
    [apiCallWithRetry, selectedBooking, getOwnerBookings]
  ); // Depend on apiCallWithRetry, selectedBooking, and getOwnerBookings

  return (
    <div className=" flex flex-col bg-[#FAF9FE] ">
      <div className="md:mt-32 mt-20">
        <div className="relative">
          <div className="flex mx-20 mb-4 sm:mb-6">
            <button
              onClick={() => setActiveTab("ActiveBooking")}
              className={`px-12 py-2 text-lg ${
                activeTab === "ActiveBooking"
                  ? "text-black border-b-2 border-[#00173C]"
                  : "text-gray-500 border-b-2 border-gray-300"
              }`}
            >
              Active Booking
            </button>
            <button
              onClick={() => setActiveTab("ActiveRental")}
              className={`px-12 py-2 text-lg ${
                activeTab === "ActiveRental"
                  ? "text-black border-b-2 border-[#00173C]"
                  : "text-gray-500 border-b-2 border-gray-300"
              }`}
            >
              Active Rental {/* This tab likely shows cars *you* are renting */}
            </button>
          </div>

          <div>
            <div className="">
              {activeTab === "ActiveBooking" ? (
                <div className="flex md:flex-row flex-col p-4">
                  {/* Left Panel: List of Active Bookings */}
                  <div className="md:w-1/3 w-full md:m-8 md:ml-16 mb-8 space-y-4">
                    <h2 className="text-lg font-semibold text-[#00113D]">
                      Your Active Bookings
                    </h2>
                    {/* Loading/Error/Empty states for the list */}
                    {loadingBookings ? (
                      <div className="flex justify-center items-center py-8">
                        <CircularProgress size={20} />
                        <span className="ml-2 text-gray-600">
                          Loading bookings...
                        </span>
                      </div>
                    ) : bookingError && activeBookings.length === 0 ? (
                      <div className="text-red-600 text-center py-8">
                        {bookingError}
                      </div>
                    ) : activeBookings.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <IoFileTray className="mx-auto text-4xl text-gray-400 mb-2" />
                        {noActiveBookingsMessage}
                      </div>
                    ) : (
                      // Map through active bookings to create clickable items
                      activeBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className={`h-fit bg-white p-4 rounded-xl shadow-md cursor-pointer border ${
                            selectedBooking?.id === booking.id
                              ? "border-[#00113D] bg-blue-50"
                              : "border-transparent hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedBooking(booking)} // Select this booking
                        >
                          {/* Display minimal info in the list item */}
                          <div className="flex items-center mb-2">
                            {/* Rentee Avatar - Always fallback image as key isn't in renteeInfo */}
                            <img
                              src={image}
                              alt="Renter Profile"
                              className="w-12 h-12 rounded-full object-cover mr-4"
                            />
                            <div>
                              <p className="font-medium text-sm text-[#00113D]">
                                {booking.renteeInfo?.given_name &&
                                booking.renteeInfo?.family_name
                                  ? `${booking.renteeInfo.given_name} ${booking.renteeInfo.family_name}`.trim()
                                  : "Unknown Rentee"}
                              </p>
                              <p className="text-xs text-gray-500">
                                Booking ID: {booking.id.substring(0, 8)}...
                              </p>{" "}
                              {/* Show truncated ID */}
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 mt-2">
                            {/* Use fetched car details if available, fallback to N/A */}
                            <p>
                              <strong>Car:</strong>{" "}
                              {booking.carId
                                ? carDetails?.id === booking.carId
                                  ? `${carDetails.make || "N/A"} ${
                                      carDetails.model || ""
                                    }`
                                  : "Loading..."
                                : "N/A"}
                            </p>
                            <p>
                              <strong>Period:</strong>{" "}
                              {formatDate(booking.startDate)} -{" "}
                              {formatDate(booking.endDate)}
                            </p>
                            <p>
                              <strong>Amount:</strong> {booking.amount || "N/A"}{" "}
                              birr
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    {/* Show booking error below the list if it exists and there are bookings */}
                    {bookingError &&
                      activeBookings.length > 0 &&
                      !actionLoading && (
                        <div className="text-red-600 text-center mt-4 text-sm">
                          {bookingError}
                        </div>
                      )}
                  </div>

                  {/* Right Panel: Details of Selected Booking */}
                  <div className="md:w-2/3 md:px-10 flex w-full space-y-6 flex-col">
                    {/* Conditional rendering based on selectedBooking */}
                    {selectedBooking ? (
                      <>
                        {" "}
                        {/* Wrap content in a fragment */}
                        {/* Car Details Section */}
                        <section className="w-full bg-white p-6 rounded-xl shadow-md">
                          <h2 className="text-lg mt-4 font-semibold text-[#00113D] mb-8">
                            Car Details
                          </h2>
                          {loadingCarDetails ? (
                            <div className="flex justify-center items-center py-8">
                              <CircularProgress size={20} />
                              <span className="ml-2 text-gray-600">
                                Loading car details...
                              </span>
                            </div>
                          ) : carDetailsError ? (
                            <div className="text-red-600 text-center py-8">
                              {carDetailsError}
                            </div>
                          ) : carDetails ? (
                            <div className="text-sm space-y-2 w-full text-gray-500">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {" "}
                                {/* Adjusted grid cols */}
                                <div>
                                  <span className="font-medium text-black">
                                    Car Brand
                                  </span>
                                  <p>{carDetails.make || "N/A"}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-black">
                                    Car Model
                                  </span>
                                  <p>{carDetails.model || "N/A"}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-black">
                                    Car Year
                                  </span>
                                  <p>{carDetails.year || "N/A"}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-black">
                                    Color
                                  </span>
                                  <p>{carDetails.color || "N/A"}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-black">
                                    Pictures
                                  </span>
                                  {/* TODO: Implement picture modal - needs carDetails?.vehicleImageKeys */}
                                  <p className="underline cursor-pointer">
                                    View Pictures
                                  </p>
                                </div>
                                {/* Add other car details from carDetails if needed */}
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-500 text-center py-8">
                              Car details not available.
                            </div>
                          )}
                          {/* Driver Request seems specific to the booking, not the car details API */}
                          <div className="text-sm mt-4">
                            <span className="font-medium text-black">
                              Driver request
                            </span>
                            <p className="text-gray-500">
                              {selectedBooking.driverRequired ? "Yes" : "No"}{" "}
                              {/* Use selectedBooking */}
                            </p>
                          </div>
                        </section>
                        {/* Rentee Details Section */}
                        <div>
                          <section className="h-fit bg-white p-6 space-y-6 rounded-xl shadow-md">
                            <h2 className="text-lg font-semibold text-[#00113D] mb-8">
                              Renter Details
                            </h2>
                            <div className="items-center flex md:flex-row flex-col gap-8">
                              {/* Always use the fallback image */}
                              <img
                                src={image}
                                alt="Renter Profile"
                                className="w-32 h-32 rounded-full object-cover"
                              />
                              <div className="grid gap-4 md:grid-cols-2 grid-cols-1 justify-center items-center">
                                {/* Access rentee details directly from renteeInfo */}
                                <h3 className="flex gap-4 text-sm text-[#5A5A5A]">
                                  <IoPersonOutline size={18} />
                                  {selectedBooking.renteeInfo?.given_name &&
                                  selectedBooking.renteeInfo?.family_name
                                    ? `${selectedBooking.renteeInfo.given_name} ${selectedBooking.renteeInfo.family_name}`.trim()
                                    : "Unknown Renter"}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
                                  <MdOutlineLocalPhone size={18} />
                                  <p>
                                    {selectedBooking.renteeInfo?.phone_number ||
                                      "Unknown"}
                                  </p>{" "}
                                  {/* Use selectedBooking.renteeInfo */}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
                                  <MdOutlineMail size={18} />
                                  <p>
                                    {selectedBooking.renteeInfo?.email ||
                                      "Unknown"}
                                  </p>{" "}
                                  {/* Use selectedBooking.renteeInfo */}
                                </div>
                                {/* Address is not available in the provided renteeInfo structure */}
                                <div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
                                  <IoLocationOutline size={18} />
                                  <p>N/A</p> {/* Address not in renteeInfo */}
                                </div>
                                <button
                                  className="flex items-center gap-2 mt-4 px-16 py-3 text-xs border rounded-full border-[#00113D] text-[#00113D] bg-white hover:bg-[#00113D] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={() =>
                                    handleChatWithRentee(selectedBooking)
                                  } // Pass the selected booking object
                                  disabled={
                                    !ownerId ||
                                    !selectedBooking?.renteeId ||
                                    !selectedBooking?.id
                                  }
                                >
                                  <IoChatboxOutline size={16} />
                                  Chat With Renter
                                </button>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex text-sm gap-4 mt-8">
                              {" "}
                              {/* Added mt-8 for spacing */}
                              {/* <button
                                onClick={() =>
                                  handleCancelBooking(selectedBooking.id)
                                } // Pass the selected booking's ID
                                className="flex-1 py-3 rounded-full bg-[#FDEAEA] text-red-700 border border-red-700 hover:bg-red-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!selectedBooking?.id || actionLoading} // Disable if no ID or action is loading
                              >
                                {actionLoading && bookingError === null ? (
                                  <CircularProgress size={20} color="error" />
                                ) : (
                                  "Cancel Booking"
                                )}
                              </button> */}
                              <button
                                className="flex-1 py-3 rounded-full bg-[#00113D] text-white hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setApproved(true)} // Opens the Return Car modal for the selected booking
                                disabled={!selectedBooking?.id || actionLoading} // Disable if no ID or action is loading
                              >
                                {actionLoading && bookingError === null ? (
                                  <CircularProgress size={20} color="inherit" />
                                ) : (
                                  "Return Car"
                                )}
                              </button>
                            </div>
                            {/* Display action error below buttons */}
                            {bookingError &&
                              !loadingBookings &&
                              !actionLoading && ( // Show error if it exists, not loading bookings, and not currently in action loading state
                                <div className="text-red-600 text-center mt-4 text-sm">
                                  {bookingError}
                                </div>
                              )}
                          </section>
                        </div>
                        {/* Return Car Modal */}
                        {approved &&
                          selectedBooking && ( // Only show modal if 'approved' is true AND a booking is selected
                            <div>
                              {/* Overlay background */}
                              <div className="fixed inset-0 bg-black opacity-50 z-20"></div>
                              {/* Modal content */}
                              <div className="fixed inset-0 flex justify-center items-center z-30 p-4">
                                {/* Modal Content Box */}
                                <div className="relative max-w-4xl w-full md:w-1/2 p-6 bg-white rounded-lg shadow-md max-h-[90vh] overflow-y-auto">
                                  {/* Modal Header with Title and Close Button */}
                                  <div className="flex justify-between items-center mb-4">
                                    <h1 className="text-lg font-semibold">
                                      Car Condition Report for Booking{" "}
                                      {selectedBooking.id.substring(0, 8)}...
                                    </h1>
                                    <IconButton
                                      aria-label="close"
                                      onClick={() => setApproved(false)} // Close modal
                                      size="small"
                                    >
                                      X{" "}
                                      {/* Consider using an actual CloseIcon */}
                                    </IconButton>
                                  </div>

                                  <p className="text-gray-600 mb-4">
                                    Please input any incidents or accidents that
                                    you have experienced
                                  </p>

                                  <div className="space-y-1 mb-6">
                                    {conditions.map((condition, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center"
                                      >
                                        <input
                                          type="checkbox"
                                          id={`condition-${index}`}
                                          checked={selectedConditions.includes(
                                            condition
                                          )}
                                          onChange={() =>
                                            handleCheckboxChange(condition)
                                          }
                                          className="w-5 h-5 mr-2 text-blue-600 rounded border-gray-300"
                                        />
                                        <label
                                          htmlFor={`condition-${index}`}
                                          className="text-gray-800"
                                        >
                                          {condition}
                                        </label>
                                      </div>
                                    ))}
                                  </div>

                                  <input
                                    type="text"
                                    placeholder="Other comments..." // Improved placeholder
                                    value={otherComments}
                                    onChange={(e) =>
                                      setOtherComments(e.target.value)
                                    }
                                    className="w-full p-2 mb-4 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00113D]"
                                  />

                                  <p className="text-gray-600 mb-4">
                                    Send an attachment or a screenshot of all
                                    sides of the car (Optional){" "}
                                    {/* Added Optional */}
                                  </p>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                    {[
                                      "front",
                                      "right",
                                      "left",
                                      "rear",
                                      "interior",
                                    ].map((side) => (
                                      <div
                                        key={side}
                                        className="border border-dashed border-gray-400 p-4 rounded-lg flex flex-col items-center"
                                      >
                                        <div className="font-semibold flex items-center text-xs w-full justify-between text-gray-700 capitalize">
                                          <div>{side} of the car </div>
                                          <div className="flex flex-col items-center">
                                            <p className="bg-gray-100 px-6 py-2 rounded-lg text-gray-400 ">
                                              {/* Display file icon or preview */}
                                              {files[side] ? (
                                                <img
                                                  src={URL.createObjectURL(
                                                    files[side]
                                                  )}
                                                  alt={side}
                                                  className="w-8 h-8 object-cover rounded"
                                                />
                                              ) : (
                                                <IoFileTray size={16} />
                                              )}
                                            </p>
                                          </div>
                                        </div>
                                        {files[side] ? (
                                          <p className="text-sm text-yellow-700 mt-2 truncate max-w-full text-center">
                                            {files[side].name}
                                          </p>
                                        ) : (
                                          <label
                                            htmlFor={`file-${side}`}
                                            className="text-blue-600 mt-2 cursor-pointer text-center"
                                          >
                                            Click here{" "}
                                            <span className="text-gray-500">
                                              to upload
                                            </span>
                                          </label>
                                        )}

                                        <input
                                          type="file"
                                          id={`file-${side}`}
                                          accept="image/*"
                                          onChange={(e) =>
                                            handleFileChange(e, side)
                                          }
                                          className="hidden"
                                        />
                                      </div>
                                    ))}
                                  </div>

                                  <button
                                    onClick={() =>
                                      handleReturnCarSubmit(selectedBooking.id)
                                    } // Call submit handler with booking ID
                                    className="w-full py-2 text-white bg-[#00113D] rounded-full text-sm hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={actionLoading} // Disable during action loading
                                  >
                                    {actionLoading && bookingError === null ? (
                                      <CircularProgress
                                        size={20}
                                        color="inherit"
                                      />
                                    ) : (
                                      "Submit Report"
                                    )}
                                  </button>
                                  {/* Display action error below submit button */}
                                  {bookingError &&
                                    actionLoading === false && ( // Show error if it exists, and we are not actively loading (implies the action finished with error)
                                      <div className="text-red-600 text-center mt-4 text-sm">
                                        {bookingError}
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          )}
                        {/* End Return Car Modal */}
                        {/* Rental Summary Section - Displaying details for the selected booking */}
                        {/* This section looks like it duplicates info from above sections.
                            Maybe simplify or remove if Request Summary + Car Details already cover this.
                            Keeping it for now but simplified to show info for selectedBooking */}
                        <section className="w-full h-fit bg-white p-6 rounded-xl shadow-md">
                          {" "}
                          {/* Adjusted width to full */}
                          <h2 className="text-lg font-semibold text-[#00113D] mb-8">
                            Rental Summary
                          </h2>
                          <h2 className="text-base text-[#00113D] my-2">
                            Booking Status
                          </h2>
                          {/* Display actual approvedStatus */}
                          <h2
                            className={`text-sm rounded-lg w-fit px-4 py-2 mb-16 ${
                              selectedBooking.approvedStatus?.toLowerCase() ===
                              "approved"
                                ? "bg-green-200 text-[#00113D]" // Or specific color for 'active'
                                : selectedBooking.approvedStatus?.toLowerCase() ===
                                  "denied"
                                ? "bg-red-200 text-red-700"
                                : selectedBooking.approvedStatus?.toLowerCase() ===
                                  "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : selectedBooking.approvedStatus?.toLowerCase() ===
                                  "cancelled"
                                ? "bg-red-100 text-red-600" // Added cancelled status color
                                : selectedBooking.approvedStatus?.toLowerCase() ===
                                  "completed"
                                ? "bg-blue-200 text-blue-700" // Added completed status color
                                : "bg-gray-200 text-gray-700" // Default for other statuses
                            }`}
                          >
                            {selectedBooking.approvedStatus || "N/A"}
                          </h2>
                          <div className="flex flex-col text-sm text-[#5A5A5A]">
                            {" "}
                            {/* Adjusted text size */}
                            <div className="flex items-start gap-2">
                              <FaRegCircle className="text-gray-400 mt-1" />{" "}
                              {/* Added mt-1 */}
                              <div className="ml-2 px-6 border-l pb-12 border-gray-300">
                                <div className="flex flex-col">
                                  {" "}
                                  {/* Use flex-col here */}
                                  <div className="font-semibold mb-2">
                                    PickUp
                                  </div>{" "}
                                  {/* Added mb-2 */}
                                  <div>
                                    <p>
                                      Date:{" "}
                                      {formatDate(selectedBooking.startDate)}
                                    </p>
                                    {/* PickUp location on booking */}
                                    <p>
                                      Location:{" "}
                                      {Array.isArray(selectedBooking.pickUp)
                                        ? selectedBooking.pickUp?.[0] || "N/A"
                                        : "N/A"}{" "}
                                      {/* Added Location label, check if array */}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <FaRegCircle className="text-gray-400 mt-1" />{" "}
                              {/* Added mt-1 */}
                              <div className="ml-2 px-6 pb-8">
                                <div className="flex flex-col">
                                  {" "}
                                  {/* Use flex-col here */}
                                  <div className="font-semibold mb-2">
                                    Return On
                                  </div>{" "}
                                  {/* Added mb-2 */}
                                  <div>
                                    <p>
                                      Date:{" "}
                                      {formatDate(selectedBooking.endDate)}
                                    </p>
                                    {/* DropOff location on booking */}
                                    <p>
                                      Location:{" "}
                                      {Array.isArray(selectedBooking.dropOff)
                                        ? selectedBooking.dropOff?.[0] || "N/A"
                                        : "N/A"}{" "}
                                      {/* Added Location label, check if array */}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Add total amount here for clarity */}
                          <div className="mt-4 text-sm">
                            <span className="font-medium text-black">
                              Total Payment
                            </span>
                            <p className="text-gray-500">
                              {selectedBooking.amount || "N/A"} birr
                            </p>
                          </div>
                        </section>
                      </>
                    ) : (
                      // Message when no booking is selected AND not loading bookings
                      !loadingBookings && (
                        <section className="w-full h-fit bg-white p-6 rounded-xl shadow-md flex justify-center items-center">
                          <p className="text-gray-500">
                            Select an active booking from the left to see
                            details.
                          </p>
                        </section>
                      )
                    )}
                    {/* Show general loading indicator in the details panel if bookings are loaded but car details aren't */}
                    {loadingCarDetails && !selectedBooking && (
                      <section className="w-full h-fit bg-white p-6 rounded-xl shadow-md flex justify-center items-center">
                        <CircularProgress size={20} />
                        <span className="ml-2 text-gray-600">
                          Loading car details...
                        </span>
                      </section>
                    )}
                  </div>
                </div>
              ) : (
                /* Render ActiveRental component for the other tab */
                <div className="">
                  <ActiveRental />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ActivBooking;
