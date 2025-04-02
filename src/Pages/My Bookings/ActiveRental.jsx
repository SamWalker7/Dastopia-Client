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
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const ActiveRental = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const customer = JSON.parse(localStorage.getItem("customer"));
  const navigate = useNavigate(); // Initialize useNavigate

  const [approved, setApproved] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState(); // Initialize as an empty array
  const [otherComments, setOtherComments] = useState("");
  const [files, setFiles] = useState({
    front: null,
    right: null,
    left: null,
    rear: null,
    interior: null,
  });
  const [rentalRequests, setRentalRequests] = useState(); // Initialize as an empty array
  const [rentalSummary, setRentalSummary] = useState({
    pickupDate: "N/A",
    pickupTime: "N/A",
    returnDate: "N/A",
    returnTime: "N/A",
    carBrand: "N/A",
    carModel: "N/A",
    driverRequired: false,
    ownerName: "N/A",
    ownerPhone: "N/A",
    ownerEmail: "N/A",
    ownerLocation: "N/A",
  }); // Initialize with placeholder data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRentalRequest, setShowRentalRequest] = useState(false); // State to toggle rental request details

  const conditions = [
    "Scratches",
    "Dents",
    "Broken Lights",
    "Interior damages",
    "Car Condition Report",
    "Car Condition Report",
  ];

  // Fetch rental requests and summary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your API endpoint
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
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        // Ensure rentalRequests is always an array
        setRentalRequests(data.rentalRequests || []);
        setRentalSummary(data.rentalSummary || {
          pickupDate: "N/A",
          pickupTime: "N/A",
          returnDate: "N/A",
          returnTime: "N/A",
          carBrand: "N/A",
          carModel: "N/A",
          driverRequired: false,
          ownerName: "N/A",
          ownerPhone: "N/A",
          ownerEmail: "N/A",
          ownerLocation: "N/A",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customer.AccessToken]); // Added dependency array to useEffect

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
    // Here you can process form data
    console.log("Selected Conditions:", selectedConditions);
    console.log("Other Comments:", otherComments);
    console.log("Files:", files);
  };

  const handleViewDetails = () => {
    setShowRentalRequest(true); // Show rental request details
  };

  return (
    <div className="flex lg:flex-row flex-col gap-10 p-0 mb-10 md:px-16">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div className={`bg-white p-6 rounded-xl shadow-md space-y-4 ${showRentalRequest ? 'lg:w-2/5' : 'lg:w-full'}`}>
          {/* Left Panel - Rental Request Details */}
          {rentalRequests && rentalRequests.length > 0 ? (
            <>
              <h2 className="text-xl font-bold text-[#00113D]">Rental Request</h2>

              <div className="text-sm space-y-2 w-full text-gray-500">
                <div className="grid grid-cols-2 gap-4">
                  <div className="">
                    <span className="font-medium text-black">Car Brand</span>
                    <p className="">{rentalSummary.carBrand}</p>
                  </div>
                  <div className="">
                    <span className="font-medium text-black">Car Model</span>
                    <p className="">{rentalSummary.carModel}</p>
                  </div>
                  <div className="">
                    <span className="font-medium text-black">Pictures</span>
                    <p className="underline cursor-pointer">View Pictures</p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-black">Driver request</span>
                    <p className="text-gray-500">
                      {rentalSummary.driverRequired ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex mt-16 gap-8">
                <div className="flex items-start">
                  <img
                    src={image}
                    alt="Renter Profile"
                    className="w-16 h-16 rounded-full"
                  />
                </div>
                <div className="grid pt-4 gap-4 grid-cols-1">
                  <h2 className="text-lg font-semibold text-[#00113D]">
                    Owner Details
                  </h2>
                  <h3 className="flex gap-4 text-sm text-[#5A5A5A]">
                    <IoPersonOutline size={18} /> {rentalSummary.ownerName}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
                    <MdOutlineLocalPhone size={18} />
                    <p>{rentalSummary.ownerPhone}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
                    <MdOutlineMail size={18} />
                    <p>{rentalSummary.ownerEmail}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
                    <IoLocationOutline size={18} />
                    <p>{rentalSummary.ownerLocation}</p>
                  </div>
                </div>
              </div>

              {/* View Details Button */}
              <button
                className="mt-3 w-full py-2 text-sm rounded-full bg-[#00113D] text-white"
                onClick={handleViewDetails}
              >
                View Details
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-[#00113D]">Rental Request</h2>
              <p className="text-gray-500">There are no rental details.</p>
            </>
          )}
        </div>
      )}
      {showRentalRequest && (
        <div className="flex flex-col w-full">
          <section className="w-full h-fit bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-[#00113D] mb-8">
              Rental Request Details
            </h2>
            {rentalRequests && rentalRequests.length === 0 ? (
              <p className="text-gray-500">There are no rental requests.</p>
            ) : (
              rentalRequests &&
              rentalRequests.map((request, index) => (
                <div
                  key={index}
                  className={`p-4 space-y-8 rounded-sm shadow-blue-100 shadow-md`}
                >
                  <div
                    className={`p-4 flex justify-between items-center mb-3 border border-dashed ${request.borderColor} rounded-sm ${request.bgColor}`}
                  >
                    <span className="font-semibold text-base text-[#000000]">
                      Expires in
                    </span>
                    <span
                      className={`px-4 py-2 text-xs font-medium rounded-full text-white ${
                        request.expiresIn === "1 Hour"
                          ? "bg-[#410002]"
                          : "bg-[#00173C]"
                      }`}
                    >
                      {request.expiresIn}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 text-sm text-gray-500 w-[400px] gap-4 mt-4">
                    <div className="flex items-center w-full gap-3 mb-2">
                      <img
                        src={image}
                        alt="Renter Profile"
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <span className="font-medium text-black">Rentee Name</span>
                        <p className="">{request.renteeName}</p>
                      </div>
                    </div>

                    <div className="md:ml-0 ml-4">
                      <span className="font-medium text-black">Rent Duration</span>
                      <p className="">{request.rentDuration}</p>
                    </div>
                  </div>
                  <div className="text-sm mb-4 space-y-2 w-full text-gray-500">
                    <div className="grid grid-cols-2 gap-4 w-full mt-4">
                      <div className="pl-4">
                        <span className="font-medium text-black">Car Brand</span>
                        <p className="">{request.carBrand}</p>
                      </div>
                      <div className="w-full">
                        <span className="font-medium text-black">Car Model</span>
                        <p className="">{request.carModel}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm mb-4 space-y-2 w-full text-gray-500">
                    <div className="grid grid-cols-2 gap-4 w-full mt-4">
                      <div className="pl-4">
                        <span className="font-medium text-black">Total Payment</span>
                        <p className="font-medium text-black">
                          {request.totalPayment}
                        </p>
                      </div>
                      <div className="w-full">
                        <h1
                          className={`flex justify-center items-center py-1 px-2 text-base rounded-xl ${request.bgColor} ${request.textColor}`}
                        >
                          {request.status}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default ActiveRental;