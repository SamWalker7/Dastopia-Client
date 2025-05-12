import Footer from "../../components/Footer";
import { useState, useEffect, useCallback, useMemo } from "react"; // Added useMemo
import image from "../../images/testimonials/avatar.png"; // Used as fallback/placeholder
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate

import {
  IoChatboxOutline, // <-- Keep this for the button icon
  IoFileTray, // Used in the condition report modal
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { MdOutlineLocalPhone, MdOutlineMail } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa"; // Used for the pickup/dropoff circles

// Import Material UI components for the popup modal header and close button, and general use
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button"; // <-- Imported Button

const ActiveRental = () => {
  const navigate = useNavigate(); // <-- Initialize useNavigate hook

  // State for the Car Condition Report popup
  const [approved, setApproved] = useState(false); // Controls visibility of the condition report modal

  // const [isChecked, setIsChecked] = useState(false); // This state doesn't seem used? Removed
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [otherComments, setOtherComments] = useState("");
  const [files, setFiles] = useState({
    front: null,
    right: null,
    left: null,
    rear: null,
    interior: null,
  });

  // API-related states
  const customer = JSON.parse(localStorage.getItem("customer")) || {};
  // Get customer ID and name from localStorage for chat initiation
  const customerId = customer?.username || customer?.id; // Assuming 'username' or 'id' is the unique ID
  const customerGivenName = customer?.given_name || customer?.firstName || ""; // Assuming these properties exist
  const customerFamilyName = customer?.family_name || customer?.lastName || ""; // Assuming these properties exist

  const [rentalRequests, setRentalRequests] = useState([]); // List of rentals
  const [rentalDetails, setRentalDetails] = useState({}); // Map of rentalId to full details (booking + car)
  const [loading, setLoading] = useState(true); // Main loading state for the list
  const [error, setError] = useState(null); // Main error state for the list
  const [selectedBookingId, setSelectedBookingId] = useState(null); // ID of the rental currently displayed in the right panel
  const [pickupAddress, setPickupAddress] = useState(""); // Address for selected rental
  const [dropOffAddress, setDropOffAddress] = useState(""); // Address for selected rental

  const conditions = [
    "Scratches",
    "Dents",
    "Broken Lights",
    "Interior damages",
  ];

  // Format date and time for display (using useCallback for consistency)
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      // Check if the date is valid before formatting
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date value");
      }
      return date.toLocaleDateString();
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "N/A";
    }
  }, []);

  const formatTime = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      // Check if the date is valid before formatting
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date value");
      }
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.error("Error formatting time:", dateString, e);
      return "N/A";
    }
  }, []);

  // --- calculateTimeRemaining helper function (Moved outside, wrapped in useCallback) ---
  const calculateTimeRemaining = useCallback((endDate) => {
    if (!endDate) return "N/A"; // Changed default to N/A if no endDate provided

    try {
      const now = new Date();
      const end = new Date(endDate);

      // Check if the date is valid
      if (isNaN(end.getTime())) {
        console.warn(
          "Invalid end date for time remaining calculation:",
          endDate
        );
        return "N/A";
      }

      const diff = end - now; // Difference in milliseconds

      if (diff <= 0) return "Expired";

      // Calculate hours and potentially minutes
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        // Display hours, sticking to Hours only as per original UI
        return `${hours} Hours`;
      } else {
        // If less than an hour, display minutes
        return `${minutes} Minutes`;
      }
    } catch (e) {
      console.error("Error calculating time remaining:", endDate, e);
      return "N/A";
    }
  }, []); // No dependencies needed as it uses current date and passed endDate

  const fetchCarDetails = useCallback(async (vehicleID, accessToken) => {
    if (!vehicleID || !accessToken) return null;
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
          `Failed to fetch car details for ID ${vehicleID}: ${response.status}`
        );
        // Optionally read response body for more info
        // const errorBody = await response.text(); console.error("Error body:", errorBody);
        return null;
      }
      const data = await response.json();
      // Assuming car details are nested under 'body'
      return data.body;
    } catch (error) {
      console.error(`Error fetching car details for ID ${vehicleID}:`, error);
      return null;
    }
  }, []); // Dependencies: none as the function uses passed args

  // --- getAddressFromCoordinates helper (Wrapped in useCallback) ---
  const getAddressFromCoordinates = useCallback(async (coordinates) => {
    if (!coordinates || coordinates.length === 0) {
      return "Location details not available";
    }

    // Ensure coordinates[0] is accessed safely
    const locationData = Array.isArray(coordinates)
      ? coordinates[0]
      : coordinates; // Handle case where coordinates itself is not an array of arrays

    if (typeof locationData === "string") {
      // Handle potential JSON string format "[lat, lon]" or "[lon, lat]"
      if (locationData.startsWith("[") && locationData.endsWith("]")) {
        try {
          const coords = JSON.parse(locationData);
          // Check if parsed data is an array with at least two numbers
          if (
            Array.isArray(coords) &&
            coords.length >= 2 &&
            typeof coords[0] === "number" &&
            typeof coords[1] === "number"
          ) {
            // Assuming [lon, lat] format based on typical geojson and previous code
            return `Latitude: ${coords[1].toFixed(
              4
            )}, Longitude: ${coords[0].toFixed(4)}`;
          } else {
            // Handle cases where string looks like JSON but isn't valid coords
            console.warn(
              "String looks like coordinates but not valid format:",
              locationData
            );
            return locationData; // Return the original string
          }
        } catch (e) {
          // Not valid JSON coordinates, might be a string address
          console.warn("Failed to parse coordinates string:", locationData, e);
          return locationData; // Return the original string
        }
      }
      // Handle cases where it's just a string address
      return locationData;
    } else if (
      Array.isArray(locationData) &&
      locationData.length >= 2 &&
      typeof locationData[0] === "number" &&
      typeof locationData[1] === "number"
    ) {
      // Handle array format [lon, lat] or [lat, lon]
      // Assuming [lon, lat] format
      return `Latitude: ${locationData[1]?.toFixed(4) || "N/A"}, Longitude: ${
        locationData[0]?.toFixed(4) || "N/A"
      }`;
    }

    // Fallback if format is unexpected
    console.warn("Unexpected coordinate format:", coordinates);
    return "Location details not available";

    // TODO: Implement actual reverse geocoding API call here if available/needed
    // Example using a dummy function (replace with real API call):
    /*
     if (Array.isArray(locationData) && locationData.length >= 2 && typeof locationData[0] === 'number' && typeof locationData[1] === 'number') {
        try {
           const response = await fetch(`YOUR_GEOCODING_API_URL?lat=${locationData[1]}&lon=${locationData[0]}&...`);
           if (response.ok) {
              const geoData = await response.json();
              // Extract formatted address from geoData based on your API's response structure
              return geoData.formatted_address || `${locationData[1].toFixed(4)}, ${locationData[0].toFixed(4)}`;
           } else {
              console.warn("Reverse geocoding failed:", response.status);
              return `Latitude: ${locationData[1].toFixed(4)}, Longitude: ${locationData[0].toFixed(4)}`; // Fallback to coords
           }
        } catch (geoError) {
           console.error("Error during reverse geocoding:", geoError);
           return `Latitude: ${locationData[1].toFixed(4)}, Longitude: ${locationData[0].toFixed(4)}`; // Fallback to coords
        }
     }
     return "Location details not available";
    */
  }, []); // No dependencies

  // Fetch rental requests and additional details
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching rental data...");
        setLoading(true);
        setError(null);
        setRentalRequests([]); // Clear previous data
        setRentalDetails({});
        setSelectedBookingId(null); // Clear selection
        setPickupAddress("");
        setDropOffAddress("");

        if (!customer?.AccessToken) {
          throw new Error("Authentication failed: Please log in again.");
        }

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
          const errorBody = await response.text();
          console.error(
            "Booking fetch HTTP error:",
            response.status,
            errorBody
          );
          throw new Error(
            `Failed to fetch booking data: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Booking API response:", data);

        if (data.body && Array.isArray(data.body)) {
          const now = new Date(); // Get current date/time for date comparison

          const activeRentals = data.body.filter((request) => {
            // Filter by status (approved or active)
            const statusMatch =
              request.approvedStatus?.toLowerCase() === "approved" ||
              request.approvedStatus?.toLowerCase() === "active";

            if (!statusMatch) {
              // console.log(`Filtering out rental ${request.id} due to status: ${request.approvedStatus}`);
              return false; // Not active if status isn't approved/active
            }
            const isPaymentSuccessful =
              request.isPayed?.toLowerCase() === "success";
            if (!isPaymentSuccessful) {
              // console.log(`Filtering out rental ${request.id} due to status: ${request.approvedStatus}`);
              return false; // Not active if status isn't approved/active
            }
            // Filter by date range
            const startDate = new Date(request.startDate);
            const endDate = new Date(request.endDate);

            // Check for valid dates and if current time is within the range
            const dateMatch =
              !isNaN(startDate.getTime()) &&
              !isNaN(endDate.getTime()) &&
              startDate <= now &&
              now <= endDate;

            if (statusMatch && !dateMatch) {
              console.log(
                `Filtering out rental ${request.id} (Status: ${request.approvedStatus}) because dates (${request.startDate} to ${request.endDate}) are not active now (${now}).`
              );
            }

            // Keep the rental only if both status AND dates match
            return statusMatch && dateMatch;
          });

          const details = {};
          const rentalsWithCarDetails = [];

          // Fetch car details for all *filtered* active rentals concurrently
          const carDetailsPromises = activeRentals.map(async (rental) => {
            if (!rental?.carId) {
              console.warn(
                "Skipping car details fetch for rental with missing carId:",
                rental.id
              );
              return { rental, carDetails: null }; // Return null carDetails
            }
            const carDetails = await fetchCarDetails(
              rental.carId,
              customer.AccessToken
            );
            return { rental, carDetails };
          });

          const results = await Promise.all(carDetailsPromises);

          for (const { rental, carDetails } of results) {
            // Only add to details and the display list if carDetails were fetched successfully
            if (carDetails) {
              details[rental.id] = { car: carDetails, booking: rental };
              rentalsWithCarDetails.push({ ...rental, carDetails });
            } else {
              console.warn(
                `Skipping rental ${rental.id} due to failed car details fetch.`
              );
            }
          }

          console.log(
            "Fetched and processed rentals (filtered by status and date):",
            rentalsWithCarDetails
          );

          setRentalRequests(rentalsWithCarDetails);
          setRentalDetails(details);

          // Automatically select the first active rental if available
          if (rentalsWithCarDetails.length > 0) {
            const firstRental = rentalsWithCarDetails[0];
            setSelectedBookingId(firstRental.id);
            // Addresses for the initially selected rental will be updated by the second useEffect
          } else {
            // If no active rentals are found after filtering, clear selection
            setSelectedBookingId(null);
          }
        } else {
          console.warn("Invalid or empty booking data body received:", data);
          setRentalRequests([]);
          setRentalDetails({});
          setSelectedBookingId(null); // Ensure nothing is selected if list is empty
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching rental data:", error);
      } finally {
        setLoading(false);
        console.log("Finished fetching rental data.");
      }
    };

    // Only fetch if customer AccessToken is available on mount
    if (customer?.AccessToken) {
      fetchData();
    } else {
      setLoading(false);
      setError("Authentication required: Please log in.");
      console.warn("No customer AccessToken found in localStorage.");
    }
  }, [customer?.AccessToken, fetchCarDetails]); // Dependencies: customer.AccessToken, and the memoized fetchCarDetails

  // Effect to update addresses when selectedBookingId or rentalRequests changes
  useEffect(() => {
    const updateAddresses = async () => {
      if (selectedBookingId && rentalRequests.length > 0) {
        console.log(
          "Updating addresses for selected booking ID:",
          selectedBookingId
        );
        const selectedRental = rentalRequests.find(
          (req) => req.id === selectedBookingId
        );
        if (selectedRental) {
          // Use the actual booking object from the list for coordinates
          const pickupCoords = selectedRental.pickUp;
          const dropOffCoords = selectedRental.dropOff;

          const pAddress = pickupCoords
            ? await getAddressFromCoordinates(pickupCoords)
            : "Location details not available";
          const dAddress = dropOffCoords
            ? await getAddressFromCoordinates(dropOffCoords)
            : "Location details not available";

          setPickupAddress(pAddress);
          setDropOffAddress(dAddress);
          console.log(
            `Updated addresses for ${selectedBookingId}: Pickup=${pAddress}, Dropoff=${dAddress}`
          );
        } else {
          // This case shouldn't happen if selectedBookingId is set from the list
          console.warn(
            `Selected booking ID ${selectedBookingId} not found in rentalRequests.`
          );
          setPickupAddress("");
          setDropOffAddress("");
        }
      } else {
        // Clear addresses if no booking is selected or list is empty
        console.log(
          "Clearing addresses: No booking selected or rental list empty."
        );
        setPickupAddress("");
        setDropOffAddress("");
      }
    };

    // Only run this effect if rentalRequests is loaded (or if selectedBookingId is explicitly null)
    // This prevents it from running before the list is fetched
    if (!loading) {
      // Wait for the main list loading to finish
      updateAddresses();
    }
  }, [selectedBookingId, rentalRequests, getAddressFromCoordinates, loading]); // Dependencies: selection, list, geocoding helper, loading state

  const currentRentalDetail = selectedBookingId
    ? rentalDetails[selectedBookingId]
    : null;

  // Use useMemo to calculate derived state for rendering the selected rental details
  const rentalSummaryData = useMemo(() => {
    console.log("Recalculating rentalSummaryData memo...");
    if (!currentRentalDetail) return null;

    const { booking, car } = currentRentalDetail;

    // Check if booking and car details are complete enough to show
    if (!booking || !car) {
      console.warn("currentRentalDetail is incomplete:", currentRentalDetail);
      return null; // Return null if essential data is missing
    }

    const ownerDisplayName =
      car.ownerGivenName && car.ownerSurName
        ? `${car.ownerGivenName} ${car.ownerSurName}`
        : "N/A";
    const ownerDisplayPhone = car.ownerPhone || "N/A";
    const ownerDisplayEmail = car.ownerEmail || "N/A";
    const ownerDisplayAddress = car.ownerAddress || "N/A"; // Using car owner address here

    const displayBookingStatus = booking.approvedStatus || "Active";

    const displayPickUpDate = formatDate(booking.startDate);
    const displayPickUpTime = formatTime(booking.startDate);
    const displayDropOffDate = formatDate(booking.endDate);
    const displayDropOffTime = formatTime(booking.endDate);

    const displayCarMake = car.make || "N/A";
    const displayCarModel = car.model || "N/A";
    const displayDriverRequired = booking.driverRequired ? "Yes" : "No";

    const expiresIn = calculateTimeRemaining(booking.endDate); // Use the external helper
    const isUrgent =
      expiresIn.includes("1 Hour") ||
      expiresIn.includes("0 Hours") ||
      expiresIn === "Expired" ||
      expiresIn === "N/A"; // Include N/A as potentially urgent or unknown

    return {
      ownerDisplayName,
      ownerDisplayPhone,
      ownerDisplayEmail,
      ownerDisplayAddress,
      displayBookingStatus,
      displayPickUpDate,
      displayPickUpTime,
      displayDropOffDate,
      displayDropOffTime,
      displayCarMake,
      displayCarModel,
      displayDriverRequired,
      expiresIn,
      isUrgent,
      // Include original objects if needed elsewhere (use with caution in render)
      booking,
      car,
      pickupAddress, // Pass addresses fetched by effect
      dropOffAddress, // Pass addresses fetched by effect
    };
  }, [
    currentRentalDetail,
    formatDate,
    formatTime,
    calculateTimeRemaining,
    pickupAddress,
    dropOffAddress,
  ]); // Dependencies for useMemo

  // --- Handler for the Chat With Owner button ---
  const handleChatWithOwner = useCallback(() => {
    const ownerId = rentalSummaryData?.car?.ownerId; // Get owner ID from the car details
    const bookingId = rentalSummaryData?.booking?.id; // Get booking ID
    const carId = rentalSummaryData?.car?.id; // Get vehicle ID

    // Use the customer's ID and name obtained from localStorage
    const currentCustomerId = customerId; // From localStorage
    const currentCustomerGivenName = customerGivenName; // From localStorage
    const currentCustomerFamilyName = customerFamilyName; // From localStorage

    // Use the owner's name from the memoized data (derived from carDetails)
    const ownerGivenName = rentalSummaryData?.car?.ownerGivenName || "Unknown";
    const ownerFamilyName = rentalSummaryData?.car?.ownerSurName || "";

    if (!currentCustomerId) {
      console.error("Chat Error: Customer ID not found in localStorage.");
      alert("Your user ID is missing. Cannot initiate chat.");
      return;
    }
    if (!ownerId) {
      console.error("Chat Error: Owner ID not found for this car.");
      alert("Owner details missing. Cannot initiate chat.");
      return;
    }
    // Allow chat even if bookingId or carId is missing, just warn
    if (!bookingId) {
      console.warn("Chat Warning: Booking ID not found for chat context.");
    }
    if (!carId) {
      console.warn("Chat Warning: Vehicle ID not found for chat context.");
    }

    // Construct the chat URL.
    // We'll use a structure that passes both user IDs and context IDs.
    // The chat app should interpret these parameters.
    // Using userId1/userId2 and bookingId/carId
    // Pass the *initiating user's* (the customer's) name to the chat page.
    const chatUrl = `/chat?userId1=${encodeURIComponent(
      currentCustomerId || ""
    )}&userId2=${encodeURIComponent(
      ownerId || ""
    )}&bookingId=${encodeURIComponent(
      bookingId || ""
    )}&carId=${encodeURIComponent(carId || "")}&given_name=${encodeURIComponent(
      currentCustomerGivenName || ""
    )}&family_name=${encodeURIComponent(currentCustomerFamilyName || "")}`;

    console.log(
      `Navigating to chat: Customer ID=${currentCustomerId}, Owner ID=${ownerId}, Booking ID=${bookingId}, Car ID=${carId}`
    );
    navigate(
      `/chat?renteeId=${ownerId}&reservationId=${ownerId}&given_name=${currentCustomerGivenName}&family_name=${currentCustomerFamilyName}`
    );
    // navigate(chatUrl);
  }, [
    navigate,
    customerId,
    customerGivenName,
    customerFamilyName,
    rentalSummaryData,
  ]); // Dependencies

  const handleCheckboxChange = useCallback((condition) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((item) => item !== condition)
        : [...prev, condition]
    );
  }, []); // No dependencies needed

  const handleFileChange = useCallback((e, side) => {
    const file = e.target.files[0];
    setFiles((prev) => ({ ...prev, [side]: file }));
  }, []); // No dependencies needed

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log("Selected Conditions:", selectedConditions);
      console.log("Other Comments:", otherComments);
      console.log("Files:", files);

      // TODO: Implement API call to submit the report
      alert("Report submitted! (Not actually sent)");

      // Close the modal after submission (you might wait for API response first)
      setApproved(false);
      // Reset form state
      setSelectedConditions([]);
      setOtherComments("");
      setFiles({
        front: null,
        right: null,
        left: null,
        rear: null,
        interior: null,
      });
    },
    [selectedConditions, otherComments, files]
  ); // Dependencies for handleSubmit

  const handleViewDetails = useCallback(async (bookingId) => {
    console.log("Viewing details for booking ID:", bookingId);
    setSelectedBookingId(bookingId);
    // Addresses will be updated by the useEffect when selectedBookingId changes
    // We don't need to fetch details again here because we already have them in rentalDetails state
  }, []); // No dependencies

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Box
          display="flex"
          flexGrow={1}
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress size={50} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading rentals...
          </Typography>
        </Box>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Box
          display="flex"
          flexGrow={1}
          justifyContent="center"
          alignItems="center"
        >
          <Box className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <Typography variant="body1">Error: {error}</Typography>
            {/* Use MUI Button */}
            <Button
              onClick={() => window.location.reload()}
              variant="contained"
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
          </Box>
        </Box>
        <Footer />
      </div>
    );
  }

  // Determine if the right panel should be shown (data loaded and a booking is selected)
  const showRightPanel = selectedBookingId && rentalSummaryData;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex lg:flex-row flex-col gap-10 p-0 mb-10 md:px-16">
        {/* Left Panel - Rental Requests */}
        <div className="lg:w-2/5 bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-xl font-bold text-[#00113D]">Active Rentals</h2>{" "}
          {/* Changed title */}
          {rentalRequests.length > 0 ? (
            rentalRequests.map((request, index) => {
              // Use the external calculateTimeRemaining helper function
              const expiresIn = calculateTimeRemaining(request.endDate);
              const isUrgent =
                expiresIn.includes("1 Hour") ||
                expiresIn.includes("0 Hours") ||
                expiresIn === "Expired" ||
                expiresIn === "N/A";

              return (
                <div
                  key={request.id || index}
                  className={`p-4 space-y-8 rounded-sm shadow-blue-100 shadow-md cursor-pointer ${
                    selectedBookingId === request.id
                      ? "border-l-4 border-blue-500"
                      : "" // Highlight selected card
                  }`}
                  onClick={() => handleViewDetails(request.id)} // Make the whole card clickable
                >
                  {/* <div
                    className={`p-4 flex justify-between items-center mb-3 border border-dashed ${
                      isUrgent ? "border-[#EB4444]" : "border-[#4478EB]"
                    } rounded-sm ${isUrgent ? "bg-[#FDEAEA]" : "bg-[#E9F1FE]"}`}
                  >
                    <span className="font-semibold text-base text-[#000000]">
                      Expires in:
                    </span>
                    <span
                      className={`px-4 py-2 text-xs font-medium rounded-full text-white ${
                        isUrgent ? "bg-[#410002]" : "bg-[#00173C]"
                      }`}
                    >
                      {expiresIn}
                    </span>
                  </div> */}

                  <div className="grid md:grid-cols-2 text-sm text-gray-500 w-full gap-4 mt-4">
                    <div className="flex items-center w-full gap-3 mb-2">
                      {/* Owner Profile Picture - Placeholder */}
                      {/* You would need to fetch owner profile picture for each list item here if needed */}
                      <img
                        src={image} // Placeholder or fetched owner avatar for list item
                        alt="Owner Profile" // Should be Owner Profile here
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-medium text-black">
                          Owner Name:
                        </span>
                        <p className="">
                          {/* Displaying owner name from carDetails */}
                          {`${request.carDetails?.ownerGivenName || ""} ${
                            request.carDetails?.ownerSurName || ""
                          }`.trim() || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="md:ml-0 ml-4">
                      <span className="font-medium text-black">
                        {" "}
                        Rent Duration:
                      </span>
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
                  <div className="text-sm mb-4 space-y-2 w-full text-gray-500">
                    <div className="grid grid-cols-2 gap-4 w-full mt-4">
                      <div className="pl-4">
                        <span className="font-medium text-black">
                          Total Payment:
                        </span>
                        <p className="font-medium text-black">
                          {request.amount ? `${request.amount} birr` : "N/A"}
                        </p>
                      </div>
                      <div className=" w-full flex justify-end items-center pr-4">
                        <h1
                          className={`flex justify-center items-center py-1 px-2 text-base rounded-xl ${
                            isUrgent
                              ? "bg-[#FDEAEA] text-[#EB4444]"
                              : "bg-[#E9F1FE] text-[#4478EB]"
                          }`}
                        >
                          {request.approvedStatus || "Active"}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <IoFileTray className="mx-auto text-4xl text-gray-400 mb-2" />
              <p className="text-gray-500">You have no active rentals</p>
            </div>
          )}
        </div>

        {/* Right Panel - Rental Summary and Details (Only shows if showRightPanel is true) */}
        {showRightPanel ? (
          <div className="flex flex-col w-full">
            <section className="w-full h-fit bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-[#00113D] mb-8">
                Rental Summary
              </h2>
              <h2 className="text-base text-[#00113D] my-2">Booking Status:</h2>
              <h2 className="text-sm bg-green-200 rounded-sm w-fit text-[#00113D] px-4 py-2 mb-16">
                {rentalSummaryData.displayBookingStatus}
              </h2>
              <div className="flex flex-col w-full text-sm text-[#5A5A5A]">
                <div className="flex items-start gap-2">
                  <div>
                    <p className="flex items-center">
                      <FaRegCircle className="text-gray-400" />
                    </p>
                    <div className="ml-2 px-6 flex items-center border-l h-40 pb-12 border-gray-300">
                      <div className="-mt-24 bg-gray-200 w-full p-8 flex rounded-sm">
                        <div className="font-semibold mr-4 w-28">PickUp:</div>
                        <div className="">
                          <p className="">
                            Date: {rentalSummaryData.displayPickUpDate}
                          </p>
                          <p>Time: {rentalSummaryData.displayPickUpTime}</p>
                          {rentalSummaryData.pickupAddress && (
                            <p className="mt-1">
                              Location: {rentalSummaryData.pickupAddress}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start w-full gap-2">
                  <div>
                    <p className="flex items-center">
                      <FaRegCircle className="text-gray-400" />
                    </p>
                    <div className="ml-2 px-6 flex items-center pt-8 pb-12 border-gray-300">
                      <div className="-mt-24 bg-gray-200 w-full p-8 flex rounded-sm">
                        <div className="font-semibold mr-4 w-28">
                          Return On:
                        </div>
                        <div className="">
                          <p className="">
                            Date: {rentalSummaryData.displayDropOffDate}
                          </p>
                          <p>Time: {rentalSummaryData.displayDropOffTime}</p>
                          {rentalSummaryData.dropOffAddress && (
                            <p className="mt-1">
                              Location: {rentalSummaryData.dropOffAddress}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="h-fit bg-white p-8 space-y-10 my-8 rounded-xl shadow-md w-full">
              <h2 className="text-xl mt-4 font-semibold text-[#00113D]">
                Car Details
              </h2>
              <div className="text-sm space-y-2 w-full text-gray-500">
                <div className="grid grid-cols-4 gap-4">
                  <div className="">
                    <span className="font-medium text-black">Car Brand:</span>
                    <p className="">{rentalSummaryData.displayCarMake}</p>
                  </div>
                  <div className="">
                    <span className="font-medium text-black">Car Model:</span>
                    <p className="">{rentalSummaryData.displayCarModel}</p>
                  </div>
                  <div className="">
                    <span className="font-medium text-black">Pictures:</span>
                    {/* TODO: Implement picture modal - This needs the carDetails.vehicleImageKeys and getDownloadUrl for the modal */}
                    {/* Needs vehicleImageKeys from rentalSummaryData.car?.vehicleImageKeys */}
                    <p className="underline cursor-pointer">View Pictures</p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-black">
                      Driver request:
                    </span>
                    <p className="text-gray-500">
                      {rentalSummaryData.displayDriverRequired}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex mt-16 gap-8">
                <div className="flex items-start">
                  {/* Owner Profile Picture - If you have owner profile pictures accessible to customers */}
                  {/* This would require another fetch using carDetails.ownerId and getDownloadUrl */}
                  {/* For now, using the placeholder */}
                  <img
                    src={image} // Placeholder or fetched owner avatar
                    alt="Owner Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                <div className="grid pt-4 gap-4 grid-cols-1">
                  <h2 className="text-lg font-semibold text-[#00113D]">
                    Owner Details
                  </h2>
                  <h3 className="flex gap-4 text-sm text-[#5A5A5A]">
                    <IoPersonOutline size={18} />
                    {rentalSummaryData.ownerDisplayName}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
                    <MdOutlineLocalPhone size={18} />
                    <p>{rentalSummaryData.ownerDisplayPhone}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
                    <MdOutlineMail size={18} />
                    <p>{rentalSummaryData.ownerDisplayEmail}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
                    <IoLocationOutline size={18} />
                    <p>{rentalSummaryData.ownerDisplayAddress}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Chat Button */}
                <button
                  className="flex items-center justify-center md:w-1/2 gap-2 py-2 text-base border rounded-full border-[#00113D] text-[#00113D] bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleChatWithOwner} // <-- Attach the chat handler
                  // Disable if loading, customerId is missing, or ownerId/bookingId is missing from rentalSummaryData
                  disabled={
                    loading ||
                    !customerId ||
                    !rentalSummaryData?.car?.ownerId ||
                    !rentalSummaryData?.booking?.id
                  }
                >
                  <IoChatboxOutline size={16} />
                  Chat With Owner
                </button>
                <button
                  className="flex-1 py-2 rounded-full bg-[#00113D] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setApproved(true)} // Opens the Car Condition Report modal
                  disabled={loading || !rentalSummaryData?.booking?.id} // Disable if loading or no booking is selected
                >
                  Complete Booking
                </button>

                {/* Car Condition Report Modal (Popup) */}
                {approved && (
                  <>
                    {/* Overlay */}
                    <div className="fixed inset-0 bg-black opacity-50 z-20"></div>
                    {/* Modal Content Wrapper */}
                    <div className="fixed inset-0 flex justify-center items-center z-30 p-4">
                      {" "}
                      {/* Added centering styles and padding */}
                      {/* Modal Content Box */}
                      <div className="relative max-w-4xl w-full md:w-1/2 p-6 bg-white rounded-sm shadow-md max-h-[90vh] overflow-y-auto">
                        {" "}
                        {/* Added relative, w-full, max-h, overflow */}
                        {/* Modal Header with Title and Close Button */}
                        <div className="flex justify-between items-center mb-4">
                          {" "}
                          {/* Added flex, justify-between, items-center, mb-4 */}
                          <h1 className="text-lg font-semibold">
                            Car Condition Report
                          </h1>
                          {/* Close Button */}
                          <IconButton
                            aria-label="close"
                            onClick={() => setApproved(false)} // <-- Set approved to false to close the modal
                            size="small" // Optional: make icon smaller
                          >
                            <CloseIcon />
                          </IconButton>
                        </div>
                        {/* Rest of the form content */}
                        <p className="text-gray-600 mb-4">
                          Please input any incidents or accidents that you have
                          experienced
                        </p>
                        <div className="space-y-4 mb-6">
                          {conditions.map((condition, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`condition-${index}`}
                                checked={selectedConditions.includes(condition)}
                                onChange={() => handleCheckboxChange(condition)}
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
                          placeholder="Other"
                          value={otherComments}
                          onChange={(e) => setOtherComments(e.target.value)}
                          className="w-full p-3 mb-6 text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:border-[#00113D]"
                        />
                        <p className="text-gray-600 mb-4">
                          Send an attachment or a screenshot of all sides of the
                          car
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                          {["front", "right", "left", "rear", "interior"].map(
                            (side) => (
                              <div
                                key={side}
                                className="border border-dashed border-gray-400 p-4 rounded-sm flex flex-col items-center"
                              >
                                <div className="font-semibold flex items-center w-full justify-between text-gray-700 capitalize">
                                  <div>{side} of the car </div>
                                  <div className="flex flex-col items-center">
                                    <p className="bg-gray-100 px-6 py-2 rounded-sm text-gray-400">
                                      <IoFileTray size={16} />
                                    </p>
                                  </div>
                                </div>
                                <label
                                  htmlFor={`file-${side}`}
                                  className="text-blue-600 mt-2 cursor-pointer"
                                >
                                  Click here{" "}
                                  <span className="text-gray-500">
                                    to upload or drop files here
                                  </span>
                                </label>
                                <input
                                  type="file"
                                  id={`file-${side}`}
                                  accept="image/*"
                                  onChange={(e) => handleFileChange(e, side)}
                                  className="hidden"
                                />
                                {files[side] && (
                                  <p className="text-sm text-yellow-500 mt-1 truncate">
                                    {" "}
                                    {/* Added truncate */}
                                    {files[side].name}
                                  </p>
                                )}
                              </div>
                            )
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            // setApproved(false); // Removed - icon handles closing before submit, handleSubmit closes after submit
                            handleSubmit(e);
                          }}
                          className="w-full py-3 text-white bg-[#00113D] rounded-full text-sm hover:bg-blue-900"
                        >
                          Submit Report
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Display message when no booking is selected or if data isn't ready for the right panel
          !loading &&
          rentalRequests.length > 0 && ( // Only show if list loaded and not empty
            <div className="flex flex-col w-full items-center justify-center text-center py-16 bg-white rounded-xl shadow-md">
              <Typography variant="h6" color="text.secondary">
                Select a rental from the left panel to view details.
              </Typography>
            </div>
          )
          // No specific message if loading or error is already displayed, or if list is empty
        )}
        {/* Message if NO active rentals are found */}
        {!loading && rentalRequests.length === 0 && !error && (
          <div className="flex flex-col w-full items-center justify-center text-center py-16 bg-white rounded-xl shadow-md">
            <IoFileTray className="mx-auto text-4xl text-gray-400 mb-2" />
            <p className="text-gray-500">
              You have no active rentals based on current date and status.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ActiveRental;
