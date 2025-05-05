import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import image from "../../images/testimonials/avatar.png";
import {
  IoChatboxOutline,
  IoFileTray,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { MdOutlineLocalPhone, MdOutlineMail } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa";

const ActiveRental = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [approved, setApproved] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
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
  const [rentalRequests, setRentalRequests] = useState([]);
  const [rentalDetails, setRentalDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropOffAddress, setDropOffAddress] = useState("");

  const conditions = [
    "Scratches",
    "Dents",
    "Broken Lights",
    "Interior damages",
    "Car Condition Report",
    "Car Condition Report",
  ];

  // Format date and time for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
const date = new Date(dateString);
return date.toLocaleDateString();
    } catch (e) {
console.error("Error formatting date:", e);
return "N/A";
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
const date = new Date(dateString);
return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
console.error("Error formatting time:", e);
return "N/A";
    }
  };

  const fetchCarDetails = async (vehicleID, accessToken) => {
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
  console.error(`Failed to fetch car details for ID ${vehicleID}: ${response.status}`);
  return null;
}
const data = await response.json();
return data.body;
    } catch (error) {
console.error("Error fetching car details:", error);
return null;
    }
  };

  const getAddressFromCoordinates = async (coordinates) => {
    if (!coordinates || coordinates.length === 0) {
return "Location details not available";
    }

    const locationData = coordinates[0];

    if (typeof locationData === 'string') {
if (locationData.startsWith('[') && locationData.endsWith(']')) {
  try {
    const coords = JSON.parse(locationData);
    if (Array.isArray(coords) && coords.length === 2) {
return `Latitude: ${coords[1].toFixed(4)}, Longitude: ${coords[0].toFixed(4)}`;
    }
  } catch (e) {
    // Not valid JSON coordinates, might be a string address
    return locationData;
  }
}
return locationData;
    } else if (Array.isArray(locationData) && locationData.length === 2) {
return `Latitude: ${locationData[1].toFixed(4)}, Longitude: ${locationData[0].toFixed(4)}`;
    }

    return "Location details not available";
  };

  // Fetch rental requests and additional details
  useEffect(() => {
    const fetchData = async () => {
try {
  setLoading(true);
  setError(null);

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
    throw new Error(`Failed to fetch booking data: ${response.status}`);
  }

  const data = await response.json();

  if (data.body && Array.isArray(data.body)) {
    const activeRentals = data.body.filter(
request => request.approvedStatus?.toLowerCase() === "approved" ||
     request.approvedStatus?.toLowerCase() === "active"
    );

    const details = {};
    const rentalsWithCarDetails = [];

    for (const rental of activeRentals) {
const carDetails = await fetchCarDetails(rental.carId, customer.AccessToken);
details[rental.id] = { car: carDetails, booking: rental };
rentalsWithCarDetails.push({ ...rental, carDetails });
    }

    setRentalRequests(rentalsWithCarDetails);
    setRentalDetails(details);

    if (rentalsWithCarDetails.length > 0) {
setSelectedBookingId(rentalsWithCarDetails[0].id);
if (rentalsWithCarDetails[0].pickUp) {
  const address = await getAddressFromCoordinates(rentalsWithCarDetails[0].pickUp);
  setPickupAddress(address);
}
if (rentalsWithCarDetails[0].dropOff) {
  const address = await getAddressFromCoordinates(rentalsWithCarDetails[0].dropOff);
  setDropOffAddress(address);
}
    }
  } else {
    throw new Error("Invalid booking data format received from API");
  }
} catch (error) {
  setError(error.message);
  console.error("Error fetching rental data:", error);
} finally {
  setLoading(false);
}
    };

    fetchData();
  }, [customer.AccessToken]);

  const currentRentalDetail = selectedBookingId ? rentalDetails[selectedBookingId] : null;
  const currentRentalBooking = currentRentalDetail?.booking;
  const currentCarDetails = currentRentalDetail?.car;

  const handleCheckboxChange = (condition) => {
    setSelectedConditions((prev) =>
prev.includes(condition)
  ? prev.filter((item) => item !== condition)
  : [...prev, condition]
    );
  };

  const handleFileChange = (e, side) => {
    const file = e.target.files[0];
    setFiles((prev) => ({ ...prev, [side]: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected Conditions:", selectedConditions);
    console.log("Other Comments:", otherComments);
    console.log("Files:", files);
  };

  const handleViewDetails = async (bookingId) => {
    setSelectedBookingId(bookingId);
    const selectedRental = rentalRequests.find(req => req.id === bookingId);
    if (selectedRental && selectedRental.pickUp) {
const address = await getAddressFromCoordinates(selectedRental.pickUp);
setPickupAddress(address);
    }
    if (selectedRental && selectedRental.dropOff) {
const address = await getAddressFromCoordinates(selectedRental.dropOff);
setDropOffAddress(address);
    }
  };

  const calculateTimeRemaining = (endDate) => {
    if (!endDate) return "24 Hours"; // Default to match original UI
    try {
const now = new Date();
const end = new Date(endDate);
const diff = end - now;

if (diff <= 0) return "Expired";

const hours = Math.floor(diff / (1000 * 60 * 60));
return `${hours} Hours`;
    } catch (e) {
console.error("Error calculating time remaining:", e);
return "24 Hours";
    }
  };

  if (loading) {
    return (
<div className="min-h-screen flex flex-col">
  <div className="flex-1 flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
  <Footer />
</div>
    );
  }

  if (error) {
    return (
<div className="min-h-screen flex flex-col">
  <div className="flex-1 flex justify-center items-center">
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
<p>Error: {error}</p>
<button
  onClick={() => window.location.reload()}
  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
>
  Try Again
</button>
    </div>
  </div>
  <Footer />
</div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
<div className="flex-1 flex lg:flex-row flex-col gap-10 p-0 mb-10 md:px-16">
  {/* Left Panel - Rental Requests */}
  <div className="lg:w-2/5 bg-white p-6 rounded-xl shadow-md space-y-4">
    <h2 className="text-xl font-bold text-[#00113D]">Rental Requests</h2>

    {rentalRequests.length > 0 ? (
rentalRequests.map((request, index) => {
  const expiresIn = calculateTimeRemaining(request.endDate);
  const isUrgent = expiresIn.includes("1 Hour") || expiresIn.includes("0 Hours");

  return (
    <div
key={request.id || index}
className="p-4 space-y-8 rounded-sm shadow-blue-100 shadow-md"
    >
<div
  className={`p-4 flex justify-between items-center mb-3 border border-dashed ${
    isUrgent ? "border-[#EB4444]" : "border-[#4478EB]"
  } rounded-sm ${
    isUrgent ? "bg-[#FDEAEA]" : "bg-[#E9F1FE]"
  }`}
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
</div>

<div className="grid md:grid-cols-2 text-sm text-gray-500 w-[400px] gap-4 mt-4">
  <div className="flex items-center w-full gap-3 mb-2">
    <img
src={image}
alt="Owner Profile"
className="w-16 h-16 rounded-full"
    />
    <div>
<span className="font-medium text-black">Owner Name:</span>
<p className="">{`${request.carDetails?.ownerGivenName || ''} ${request.carDetails?.ownerSurName || ''}`.trim() || "N/A"}</p>
    </div>
  </div>

  <div className="md:ml-0 ml-4">
    <span className="font-medium text-black"> Rent Duration:</span>
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
<span className="font-medium text-black">Car Brand:</span>
<p className="">{request.carDetails?.make || "N/A"}</p>
    </div>
    <div className=" w-full">
<span className="font-medium text-black">Car Model:</span>
<p className="">{request.carDetails?.model || "N/A"}</p>
    </div>
  </div>
</div>
<div className="text-sm mb-4 space-y-2 w-full text-gray-500">
  <div className="grid grid-cols-2 gap-4 w-full mt-4">
    <div className="pl-4">
<span className="font-medium text-black">Total Payment:</span>
<p className="font-medium text-black">
  {request.amount ? `${request.amount} birr` : "N/A"}
</p>
    </div>
    <div className=" w-full">
<h1
  className={`flex justify-center items-center py-1 px-2 text-base rounded-xl ${
    isUrgent ? "bg-[#FDEAEA] text-[#EB4444]" : "bg-[#E9F1FE] text-[#4478EB]"
  }`}
>
  {request.approvedStatus || "Active"}
</h1>
    </div>
  </div>
</div>

<button
  className="mt-3 w-full py-2 text-sm rounded-full bg-[#00113D] text-white"
  onClick={() => handleViewDetails(request.id)}
>
  View Details
</button>
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

  {/* Right Panel - Rental Summary and Details */}
  {selectedBookingId && currentRentalDetail && (
    <div className="flex flex-col w-full">
<section className="w-full h-fit bg-white p-6 rounded-xl shadow-md">
  <h2 className="text-lg font-semibold text-[#00113D] mb-8">
    Rental Summary
  </h2>
  <h2 className="text-base text-[#00113D] my-2">Booking Status:</h2>
  <h2 className="text-sm bg-green-200 rounded-sm w-fit text-[#00113D] px-4 py-2 mb-16">
    {currentRentalBooking.approvedStatus || "Active"}
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
    Date: {formatDate(currentRentalBooking.startDate)}
  </p>
  <p>Time: {formatTime(currentRentalBooking.startDate)}</p>
  {pickupAddress && (
    <p className="mt-1">Location: {pickupAddress}</p>
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
<div className="font-semibold mr-4 w-28">Return On:</div>
<div className="">
  <p className="">
    Date: {formatDate(currentRentalBooking.endDate)}
  </p>
  <p>Time: {formatTime(currentRentalBooking.endDate)}</p>
  {dropOffAddress && (
    <p className="mt-1">Location: {dropOffAddress}</p>
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
  <p className="">{currentCarDetails?.make || "N/A"}</p>
</div>
<div className="">
  <span className="font-medium text-black">Car Model:</span>
  <p className="">{currentCarDetails?.model || "N/A"}</p>
</div>
<div className="">
  <span className="font-medium text-black">Pictures:</span>
  <p className="underline cursor-pointer">View Pictures</p>
</div>
<div className="text-sm">
  <span className="font-medium text-black">Driver request:</span>
  <p className="text-gray-500">
    {currentRentalBooking.driverRequired ? "Yes" : "No"}
  </p>
</div>
    </div>
  </div>

  <div className="flex mt-16 gap-8">
    <div className="flex items-start">
<img
  src={image}
  alt="Owner Profile"
  className="w-16 h-16 rounded-full"
/>
    </div>
    <div className="grid pt-4 gap-4 grid-cols-1">
<h2 className="text-lg font-semibold text-[#00113D]">
  Owner Details
</h2>
<h3 className="flex gap-4 text-sm text-[#5A5A5A]">
<IoPersonOutline size={18} />
    {(currentCarDetails?.ownerGivenName && currentCarDetails?.ownerSurName) ?
        `${currentCarDetails.ownerGivenName} ${currentCarDetails.ownerSurName}` :
        "N/A"
    }
</h3>
<div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
  <MdOutlineLocalPhone size={18} />
  <p>{currentCarDetails?.ownerPhone || "N/A"}</p>
</div>
<div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
  <MdOutlineMail size={18} />
  <p>{currentCarDetails?.ownerEmail || "N/A"}</p>
</div>
<div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
  <IoLocationOutline size={18} />
  <p>{currentCarDetails?.ownerAddress || "N/A"}</p>
</div>
    </div>
  </div>

  {/* Action Buttons */}
  <div className="flex flex-col md:flex-row gap-4">
    <button className="flex items-center justify-center md:w-1/2 gap-2 py-2 text-base border rounded-full border-[#00113D] text-[#00113D] bg-white">
<IoChatboxOutline size={16} />
Chat With Renter
    </button>
    <button
className="flex-1 py-2 rounded-full bg-[#00113D] text-white"
onClick={() => setApproved(true)}
    >
Complete Booking
    </button>
    {approved && (
<div>
  <div className="fixed inset-0 bg-black opacity-50 z-20"></div>
  <div className="fixed inset-0 flex self-center justify-center z-30 flex-col items-start p-6 gap-4 w-1/2 h-fit mx-auto rounded-sm shadow-md">
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-sm shadow-sm">
<h1 className="text-lg font-semibold mb-2">
  Car Condition Report
</h1>
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
    <p className="text-sm text-yellow-500 mt-1">
{files[side].name}
    </p>
  )}
</div>
    )
  )}
</div>

<button
  onClick={(e) => {
    setApproved(false);
    handleSubmit(e);
  }}
  className="w-full py-3 text-white bg-[#00113D] rounded-full text-sm hover:bg-blue-900"
>
  Submit Report
</button>
    </div>
  </div>
</div>
    )}
  </div>
</div>
    </div>
  )}
</div>
<Footer />
    </div>
  );
};

export default ActiveRental;