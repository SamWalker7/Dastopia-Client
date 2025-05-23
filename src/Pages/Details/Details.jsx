import React, { useEffect, useState, useRef } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button, TextField } from "@mui/material";
import MapComponent from "../../components/GoogleMaps";
import { useParams, useNavigate } from "react-router-dom";
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
  FaStar,
  FaUserFriends,
} from "react-icons/fa";
import RentalModal from "./RentalModal";

export default function Details(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // use useRef to target the modal for outside click detection
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const { id } = useParams();
  const [selected, setSelected] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageLoading, setImageLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [error, setError] = useState("");
  const placeholderImage = "https://via.placeholder.com/300";
  const [vehicleImages, setVehicleImages] = useState([]);

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
      let imageUrls = [];

      if (data.vehicleImageKeys && data.vehicleImageKeys.length > 0) {
        const fetchedUrls = await Promise.all(
          data.vehicleImageKeys.map(async (imageKey) => {
            try {
              const path = await getDownloadUrl(imageKey.key);
              console.log("getDownloadUrl path:", path);
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
  }, []);

  useEffect(() => {
    const getQueryParam = (name) => {
      const params = new URLSearchParams(window.location.search);
      return params.get(name);
    };
    const pickUpTime = getQueryParam("pickUpTime");
    const dropOffTime = getQueryParam("dropOffTime");

    setStartDate(pickUpTime);
    setEndDate(dropOffTime);
  }, []);

  useEffect(() => {
    // Function to handle clicks outside the modal
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    }

    // Add event listener when modal is open
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Remove event listener when component unmounts or modal is closed
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

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

  const [selectedImage, setSelectedImage] = useState(audia1);
  const [pickUp, setPickUp] = useState("");

  const handlePick = (e) => setPickUp(e.target.value);

  const locations = ["Addis Ababa", "Adama", "Hawassa", "Bahir Dar"];

  if (imageLoading) {
    return <p>Loading vehicle details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const goBack = () => {
    navigate(-1); // Go back one page in history
  };

  return (
    <div className="md:py-16 py-32 bg-[#FAF9FE] px-4 md:px-16 flex flex-col">
      <div className="bg-white md:flex-row flex-col md:mt-24 mb-8 w-full px-10 py-4 justify-between text-lg md:text-lg rounded-xl shadow-sm shadow-blue-300 border border-blue-300 flex">
        <div className="flex md:flex-row flex-col w-full md:w-2/3 justify-between items-center">
          <div className="flex flex-col ">
            <div>Bole International Airport</div>
            <div>Wed, Aug 28,2024 , 10:00</div>
          </div>

          <div className="mx-4">
            <svg
              className=" text-gray-800 w-8 h-8 transform transition-transform duration-200
  -rotate-90"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 010-1.06z" />
            </svg>
          </div>

          <div className="flex flex-col ">
            <div>Bole International Airport</div>
            <div>Wed, Aug 28,2024 , 10:00</div>
          </div>
        </div>

        <button className="text-sm border border-blue-950 text-black hover:bg-blue-200 hover:border-none rounded-full px-6 ml-8 my-2 py-1">
          Edit
        </button>
      </div>
      {/* Car Details Section */}
      <div className="flex lg:flex-row flex-col gap-10 ">
        {/* Left Side - Car Info */}
        <div className="p-6 bg-white lg:w-2/5 w-full h-fit shadow-lg rounded-lg">
          <div className="flex px-2 flex-col">
            <button
              className="mb-4 flex self-start text-black text-base font-normal items-center"
              onClick={goBack}
            >
              <span className="mr-6">
                <FaArrowLeft className="text-gray-700" size={12} />
              </span>
              Car Details
            </button>
          </div>

          <div className="flex justify-between items-center py-4 ">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-950 w-full text-white rounded-full px-2 py-2 text-sm font-normal"
            >
              Confirm Availability
            </button>

            <div ref={modalRef}>
              {" "}
              {/* Ref added here to the modal wrapper */}
              <RentalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                vehicleId={id} // Pass vehicleId as prop to RentalModal
              />
            </div>
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

          <div className="flex justify-start space-x-2 items-center mt-6">
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

          <div className="flex mt-4">
            <div className="flex justify-between w-full items-center px-2 py-4 my-2 text-gray-700 text-base">
              <div className="flex items-center space-x-2">
                <FaGasPump size={16} />
                <span>{selected?.fuelType}</span>
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
        <div className="p-10 bg-white w-full shadow-lg rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold">Price</h3>

            <span className="text-base font-bold">{selected?.price} Birr</span>
          </div>

          <div className="bg-blue-100 text-blue-700 py-2 px-4 rounded-lg text-center mt-4">
            Daily Rent Price: 190 Birr
          </div>
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

          <div className="my-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Features
            </h3>

            <div className="flex flex-wrap gap-3">
              {/* Safe handling of carFeatures */}
              {selected?.carFeatures &&
                (Array.isArray(selected.carFeatures) ? ( // Check if it's already an array
                  selected.carFeatures.map((feature, index) => (
                    <span
                      key={index}
                      className=" text-gray-700 px-4 py-2 rounded-xl text-base border border-gray-300"
                    >
                      {feature}
                    </span>
                  ))
                ) : // If not an array, treat it as a string (or fallback to empty array)
                typeof selected.carFeatures === "string" ? (
                  selected.carFeatures.split(",").map(
                    (
                      feature,
                      index // Split if it's a string
                    ) => (
                      <span
                        key={index}
                        className=" text-gray-700 px-4 py-2 rounded-xl text-base border border-gray-300"
                      >
                        {feature.trim()}
                        {/* Trim whitespace */}
                      </span>
                    )
                  )
                ) : (
                  // Fallback if it's neither string nor array - render nothing or a placeholder
                  <span>No features listed</span>
                ))}
            </div>
          </div>
          {/* Pickup and Drop-off Locations */}
          <div className="flex justify-between md:pr-52 mb-6">
            <div className="my-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Pick up Locations
              </h3>

              <ul className=" text-base space-y-6 text-gray-700">
                {selected?.pickupLocations &&
                  selected?.pickupLocations.map((location, index) => (
                    <li className="flex items-center gap-4" key={index}>
                      <IoLocationOutline size={16} />
                      {location}
                    </li>
                  ))}
              </ul>
            </div>

            <div className="my-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Drop off Locations
              </h3>

              <ul className=" text-base space-y-6 text-gray-700">
                {selected?.dropOffLocations &&
                  selected?.dropOffLocations.map((location, index) => (
                    <li className="flex items-center gap-4" key={index}>
                      <IoLocationOutline size={16} />
                      {location}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          {/* Insurance */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Insurance</h3>

            <p className="text-base text-gray-700 mt-2">
              {selected?.insurance}
            </p>
          </div>
          {/* Rating & Reviews */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Rating & Reviews
            </h3>

            <div className="flex items-center">
              <div className="text-yellow-500 text-base">⭐⭐⭐⭐⭐</div>
              <p className="ml-3 text-base text-gray-700">4/5</p>
            </div>
            <p className="text-base text-gray-700 mt-1">Veronika</p>
          </div>
        </div>
      </div>
    </div>
  );
}
