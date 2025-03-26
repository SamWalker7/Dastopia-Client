import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchImages, fetchVehicles } from "../../store/slices/vehicleSlice";
import MapComponent from "../../components/GoogleMaps";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { getDownloadUrl, getOneVehicle } from "../../api";
import audia1 from "../../images/cars-big/toyota-box.png";
import { IoLocationOutline } from "react-icons/io5";
import {
  FaArrowLeft,
  FaBackspace,
  FaCogs,
  FaGasPump,
  FaLocationArrow,
  FaRegCircle,
  FaStar,
  FaUserFriends,
  FaCalendar,
  FaTag,
} from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";

import RentalModal from "./RentalModal";
import PriceBreakdown from "./PriceBreakdown";
import Dropdown from "../../components/Search/Dropdown";
import useVehicleFormStore from "../../store/useVehicleFormStore";
const customer = JSON.parse(localStorage.getItem("customer"));

const locations = [
  "Addis Ababa",
  "Bole",
  "Merkato",
  "Piassa",
  "CMC",
  "Summit",
  // Add more locations as needed
];

const fetchPlaceName = async (lat, lng) => {
  const apiKey = "AIzaSyC3TxwdUzV5gbwZN-61Hb1RyDJr0PRSfW4";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === "OK") {
      return data.results[0].formatted_address;
    } else {
      console.error("Geocoding failed:", data.status);
      return `Lat: ${lat}, Lng: ${lng}`;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return `Lat: ${lat}, Lng: ${lng}`;
  }
};
export default function Details2(props) {
  const location = useLocation();
  const { pickUpTime, DropOffTime } = location.state || {};
  console.log(pickUpTime, DropOffTime);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // useNavigate hook for navigation
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const placeholderImage = "https://via.placeholder.com/300";

  const [selectedImage, setSelectedImage] = useState(placeholderImage);
  const [pickUpLocations, setPickUpLocations] = useState();
  const [dropOffLocations, setDropOffLocations] = useState();

  const { id } = useParams();
  const [selected, setSelected] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageLoading, setImageLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [error, setError] = useState("");
  const [vehicleImages, setVehicleImages] = useState();
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const { apiCallWithRetry } = useVehicleFormStore();
  const [imageUrls, setImageUrls] = useState({});
  const [parsedCalendar, setParsedCalendar] = useState();
  const selectedVehicleId = id;

  useEffect(() => {
    const fetchLocations = async (locations, setLocations) => {
      if (Array.isArray(locations)) {
        const placeNames = await Promise.all(
          locations.map(async (location) => {
            if (Array.isArray(location) && location.length === 2) {
              return await fetchPlaceName(location[0], location[1]);
            }
            return "Invalid location";
          })
        );
        setLocations(placeNames);
      }
    };

    if (vehicleDetails?.pickUp) {
      fetchLocations(vehicleDetails.pickUp, setPickUpLocations);
    }

    if (vehicleDetails?.dropOff) {
      fetchLocations(vehicleDetails.dropOff, setDropOffLocations);
    }
  }, [vehicleDetails]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown Date";
    }
  };

  const renderLocations = (locations) => {
    if (Array.isArray(locations)) {
      return locations.map((location, index) => {
        // Location is now an array of coordinates [lat, lng]
        const locationName = `Lat: ${location[0]}, Lng: ${location[1]}`; // Display coordinates as location name
        return (
          <span
            key={index}
            className="border border-gray-400 text-sm px-3 py-1 rounded-xl"
          >
            {locationName}
          </span>
        );
      });
    } else if (typeof locations === "string" && locations) {
      return (
        <span className="border border-gray-400 text-sm px-3 py-1 rounded-xl">
          {locations}
        </span>
      );
    } else {
      return <span className="text-gray-500">Not specified</span>;
    }
  };
  const handleStartDateChange = (event) => {
    const value = event.target.value;
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const selectedStartDate = new Date(value).setHours(0, 0, 0, 0);
    const selectedEndDate = endDate
      ? new Date(endDate).setHours(0, 0, 0, 0)
      : null;

    if (selectedStartDate < currentDate) {
      setError("Pickup date cannot be before the current date.");
      setStartDate("");
    } else if (selectedEndDate && selectedStartDate > selectedEndDate) {
      setError("Pickup date cannot be after the end date.");
      setStartDate("");
    } else {
      setError("");

      setStartDate(value);
      localStorage.setItem("pickUpTime", value);
    }
  };

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!selectedVehicleId) {
          setError("Vehicle ID is missing.");
          setLoading(false);
          return;
        }
        const response = await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/${selectedVehicleId}`,
          {
            method: "GET",
          }
        );
        if (response && response.body) {
          console.log("API Response for Vehicle Details:", response.body);
          setVehicleDetails(response.body);
          setStatus(response.body.isActive ? "Active" : "Inactive");
          setParsedCalendar(response.body.events || []);
          if (
            response.body.vehicleImageKeys &&
            response.body.vehicleImageKeys.length > 0
          ) {
            const urls = {};
            for (const imageKey of response.body.vehicleImageKeys) {
              try {
                const downloadURL = await getDownloadUrl(imageKey);
                urls[imageKey] = downloadURL?.body;
                console.log(
                  "Download URL for",
                  imageKey,
                  ":",
                  downloadURL.body
                );
                if (!selectedImage) {
                  setSelectedImage(imageKey);
                }
              } catch (downloadUrlError) {
                console.error(
                  `Failed to fetch download URL for ${imageKey}:`,
                  downloadUrlError
                );
                urls[imageKey] = audia1;
                if (!selectedImage) {
                  setSelectedImage(audia1);
                }
              }
            }
            setImageUrls(urls);
            if (!selectedImage && response.body.vehicleImageKeys.length > 0) {
              setSelectedImage(response.body.vehicleImageKeys[0]);
            }
          } else {
            setSelectedImage(audia1);
          }
          if (response.body.events) {
            setParsedCalendar(response.body.events);
          } else {
            setParsedCalendar(); // Ensure parsedCalendar is always an array
          }
        } else {
          setError(
            "Failed to fetch vehicle details or invalid response format."
          );
        }
      } catch (err) {
        console.error("Error fetching vehicle details:", err);
        setError("Error fetching vehicle details.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [
    selectedVehicleId,
    apiCallWithRetry,
    selectedImage,
    customer?.AccessToken, // Added optional chaining in case customer is null
  ]);

  const handleEndDateChange = (event) => {
    const value = event.target.value;
    if (new Date(value) <= new Date(startDate)) {
      setError("End date must be after the pickup date.");
      setEndDate("");
    } else if (new Date(value).toDateString() === new Date().toDateString()) {
      setError("End date cannot be the current date.");
      setEndDate("");
    } else {
      setError("");
      setEndDate(value);
      localStorage.setItem("dropOffTime", value);
    }
  };

  const fetchData = async () => {
    setImageLoading(true);
    try {
      const response = await getOneVehicle(id);
      const data = response.body;
      console.log("data is", data);
      let imageUrls = [];

      if (data.vehicleImageKeys && data.vehicleImageKeys.length > 0) {
        const fetchedUrls = await Promise.all(
          data.vehicleImageKeys.map(async (imageKey) => {
            try {
              const path = await getDownloadUrl(imageKey);
              console.log("getDownloadUrl path:", path, "HI", imageKey);
              return path?.body || placeholderImage;
            } catch (error) {
              console.error(
                "Error in getDownloadUrl for key:",
                imageKey,
                error
              );
              return placeholderImage;
            }
          })
        );
        imageUrls = fetchedUrls;
      } else {
        imageUrls.push(placeholderImage);
      }

      setSelected({
        ...data,

        imageLoading: false,
      });
      console.log("selected is", selected);
      setVehicleImages(imageUrls);
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      setError("Failed to load vehicle details.");
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  useEffect(() => {
    const getQueryParam = (name) => {
      const params = new URLSearchParams(window.location.search);
      return params.get(name);
    };
    const pickUpTime = getQueryParam("pickUpTime");
    const dropOffTime = getQueryParam("dropOffTime");

    setStartDate(pickUpTime);
    setEndDate(dropOffTime);
  });

  const styles = {
    formControl: {
      minWidth: "20%",
      marginRight: "16px",
      marginBottom: "10px",
      flex: "1 0 20%",
      marginTop: "2rem",
      fontSize: "16px",
    },
    container: {
      paddingTop: "300px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      maxWidth: "2000px",
      alignItems: "center",
      alignContent: "center",
      paddingLeft: windowWidth < 700 ? "10px" : "0px",
    },
  };

  const boxStyle = {
    display: "flex",
    flexDirection: windowWidth < 497 ? "column" : "row",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    alignItems: "flex-start",
    maxWidth: "1000px",
    width: "100%",
    padding: "15px",
  };

  const [pickUp, setPickUp] = useState("");

  const handlePick = (e) => setPickUp(e.target.value);

  const locations = ["Addis Ababa", "Adama", "Hawassa", "Bahir Dar"];
  if (imageLoading) {
    return <p>Loading vehicle details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  // Calculate the number of days
  const pickUpDate = new Date(pickUpTime);
  const dropOffDate = new Date(DropOffTime);
  const timeDifference = dropOffDate.getTime() - pickUpDate.getTime();
  const days = Math.ceil(timeDifference / (1000 * 3600 * 24));

  // Get vehicle price from state
  const dailyPrice = selected?.price || 0;
  const totalPrice = days * dailyPrice;

  return (
    <div className="py-32 md:py-8 lg:flex-row flex-col bg-[#FAF9FE] md:px-16 p-4  gap-10 flex ">
      <div className="flex  flex-col lg:w-3/4">
        {/* Car Details Section */}
        <div className="flex md:flex-row flex-col gap-10 md:mt-24">
          {/* Left Side - Car Info */}
          <div className="p-6 bg-white md:w-1/2 h-fit shadow-lg rounded-lg">
            <div className="flex px-2  flex-col">
              {" "}
              <button
                onClick={() => navigate(-1)} // Add onClick handler to navigate back
                className="mb-4 flex self-start text-black text-base font-normal items-center cursor-pointer" // Added cursor-pointer for visual feedback
              >
                <span className="mr-6">
                  {" "}
                  <FaArrowLeft className="text-gray-700" size={12} />
                </span>{" "}
                Car Details
              </button>{" "}
            </div>

            <h1 className=" text-base font-semibold px-2 mb-8 my-4">
              {selected?.make} {selected?.model}
            </h1>
            {/* Back Button */}
            <img
              src={
                vehicleImages && vehicleImages[0]
                  ? vehicleImages[0]
                  : placeholderImage
              }
              alt={`${selected?.make} ${selected?.model}`}
              className="w-[300px] h-[250px] rounded-lg mb-4"
            />
            <div className="flex justify-start  space-x-2 items-center mt-6">
              {vehicleImages &&
                vehicleImages.map((thumb, index) => (
                  <img
                    key={index}
                    src={thumb || placeholderImage}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => setSelectedImage(thumb)}
                    className="w-20 h-20 cursor-pointer rounded-lg"
                  />
                ))}
            </div>
            <div className="flex  mt-4">
              <div className="flex justify-between w-full items-center px-2 py-4 my-2 text-gray-700 text-base">
                <div className="flex items-center space-x-2">
                  <FaGasPump size={16} /> <span>{selected?.fuelType}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCogs size={16} />
                  <span>{selected?.transmission}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaUserFriends size={16} />
                  <span>{selected?.seats} People</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Specifications and Reviews */}
          <div className=" bg-white w-full h-fit flex justify-center items-center flex-col  shadow-lg rounded-lg">
            <div className="bg-blue-100 w-11/12  text-blue-700 py-2 px-4 rounded-lg text-center mt-10">
              <div className="flex justify-between  items-center">
                <h3 className="text-base font-semibold">Price</h3>
                <span className="text-base font-bold">
                  {selected?.price} Birr
                </span>
              </div>
            </div>
            <div className="p-10 pt-0 w-full h-fit  shadow-lg rounded-lg">
              {/* Car Specification */}
              <h4 className="mt-8 text-lg font-semibold">Car Specification</h4>
              <div className="grid grid-cols-3 text-base gap-4 mt-4">
                <div>
                  <span className="font-medium ">Car Brand</span>
                  <p className="text-gray-500">{selected?.make}</p>
                </div>
                <div>
                  <span className="font-medium">Car Model</span>
                  <p className="text-gray-500">{selected?.model}</p>
                </div>

                <div>
                  <span className="font-medium">Category</span>
                  <p className="text-gray-500">{selected?.category}</p>
                </div>
              </div>

              <section className="my-16">
                <h2 className="font-semibold text-lg mb-4">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {vehicleDetails?.carFeatures?.map((feature, index) => (
                    <span
                      key={index}
                      className="border border-gray-400 text-base px-3 py-1 rounded-xl"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </section>

              <section className="my-8">
                <h2 className="font-semibold text-lg mb-4">
                  Pick up Locations
                </h2>
                <div className="flex flex-wrap gap-2">
                  {pickUpLocations.map((place, index) => (
                    <span
                      key={index}
                      className="border border-gray-400 text-sm px-3 py-1 rounded-xl"
                    >
                      {place}
                    </span>
                  ))}
                </div>
              </section>

              <section className="my-8">
                <h2 className="font-semibold text-2xl my-4 mb-4">
                  Drop off Locations
                </h2>
                <div className="flex flex-wrap gap-2">
                  {dropOffLocations.map((place, index) => (
                    <span
                      key={index}
                      className="border border-gray-400 text-sm px-3 py-1 rounded-xl"
                    >
                      {place}
                    </span>
                  ))}
                </div>
              </section>

              <section className="my-16">
                <h2 className="font-semibold text-lg mb-4">
                  Available Rental Dates
                </h2>
                <div className="space-y-4">
                  {parsedCalendar.map((dateRange, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FaCalendarAlt size={16} />
                      <span className="text-sm">{`${formatDate(
                        dateRange.startDate
                      )} - ${formatDate(dateRange.endDate)}`}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:w-1/4">
        <section className=" bg-white p-6 md:mt-24 mb-8  rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-[#00113D] mb-8">
            Pick Up and Drop Off
          </h2>
          <div className="flex flex-col  text-sm text-[#5A5A5A]">
            <div className="flex items-start gap-2">
              <div>
                <p className="flex items-center ">
                  <FaRegCircle className="text-gray-600" />{" "}
                  <span className="px-4 text-black">
                    Pick-up Date: {""}
                    {new Date(pickUpTime).toLocaleDateString()}
                  </span>
                </p>
                <br />

                <div className="ml-2 px-6 border-l pb-12 border-gray-300">
                  <p className="font-semibold">
                    {" "}
                    <p>
                      {pickupLocation ? (
                        <span className="text-green-500">{pickupLocation}</span>
                      ) : (
                        <span className="text-red-400">
                          Please Select a location
                        </span>
                      )}
                    </p>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div>
                <p className="flex items-center">
                  <FaRegCircle className="text-gray-600" />{" "}
                  <span className="px-4 text-black">
                    Drop-Off Date: {new Date(DropOffTime).toLocaleDateString()}
                  </span>
                </p>
                <br />
                <div className="ml-2 px-6  pb-8 ">
                  <p className="font-semibold">
                    <p>
                      {dropoffLocation ? (
                        <span className="text-green-500">
                          {dropoffLocation}
                        </span>
                      ) : (
                        <span className="text-red-400">
                          Please Select a location
                        </span>
                      )}
                    </p>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className=" w-full">
            <Dropdown
              label="Select Pick up location"
              options={pickUpLocations}
              selectedOption={pickupLocation}
              onSelect={setPickupLocation}
            />

            <Dropdown
              label="Select Drop off location"
              options={dropOffLocations}
              selectedOption={dropoffLocation}
              onSelect={setDropoffLocation}
            />
          </div>
          <div className="mt-4 text-sm">
            <span className="font-medium text-black"> Driver request</span>
            <p className="text-gray-500">Yes</p>
          </div>
          <div className="p-4  bg-blue-100 text-sm mt-4 py-4 h-fit">
            Having no driver selected means that you are liable for any issues
            that is related to an accident to the rented vechile.
          </div>
        </section>
        <PriceBreakdown
          days={days}
          dailyPrice={dailyPrice}
          totalPrice={totalPrice}
          id={vehicleDetails?.id}
          ownerId={vehicleDetails?.ownerId} // Ensure ownerId is passed
          dropOffTime={DropOffTime}
          pickUpTime={pickUpTime}
          pickUpLocation={pickUpLocations} // Ensure pickupLocation is passed
          dropOffLocation={dropOffLocations} // Ensure dropoffLocation is passed
        />
      </div>
    </div>
  );
}
