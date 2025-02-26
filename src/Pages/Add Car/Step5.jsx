import React, { useState, useEffect } from "react";
import audia1 from "../../images/cars-big/toyota-box.png";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import {
  FaArrowLeft,
  FaBackspace,
  FaCalendar,
  FaCalendarAlt,
  FaCogs,
  FaGasPump,
  FaLocationArrow,
  FaStar,
  FaTag,
  FaUserFriends,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoIosCloseCircleOutline, IoMdClose } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";

const GOOGLE_MAPS_API_KEY = "AIzaSyC3TxwdUzV5gbwZN-61Hb1RyDJr0PRSfW4";
const libraries = ["places"];

const Step5 = ({ prevStep }) => {
  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const myLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(myLocation);
          if (map) {
            map.panTo(myLocation);
            map.setZoom(15);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };
  // State management
  const [showModal, setShowModal] = useState(false);
  const [markers, setMarkers] = useState({
    pickup: [],
    dropoff: [],
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationType, setLocationType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [map, setMap] = useState(null);
  const [placesService, setPlacesService] = useState(null);

  const mapStyles = {
    height: "50vh",
    width: "100%",
  };

  const defaultCenter = {
    lat: 9.0233,
    lng: 38.7468,
  };

  const locationTypes = [
    "Pickup Location",
    "Drop-off Location",
    "Pickup and Drop-off",
  ];

  // Get current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Initialize places service when map is loaded
  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);
    if (window.google) {
      setPlacesService(
        new window.google.maps.places.PlacesService(mapInstance)
      );
    }
  };

  // Handle map click event
  const handleMapClick = (event) => {
    if (!locationType) return;

    const newLocation = {
      position: {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      },
    };

    // Get address for clicked location
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: newLocation.position }, (results, status) => {
      if (status === "OK" && results[0]) {
        newLocation.address = results[0].formatted_address;

        if (
          locationType === "Pickup Location" ||
          locationType === "Pickup and Drop-off"
        ) {
          setMarkers((prev) => ({
            ...prev,
            pickup: [...prev.pickup, newLocation],
          }));
        }
        if (
          locationType === "Drop-off Location" ||
          locationType === "Pickup and Drop-off"
        ) {
          setMarkers((prev) => ({
            ...prev,
            dropoff: [...prev.dropoff, newLocation],
          }));
        }
      }
    });
  };

  // Handle search input
  useEffect(() => {
    if (!searchQuery || !map) return;

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input: searchQuery,
        componentRestrictions: { country: "ET" },
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSuggestions(predictions);
        }
      }
    );
  }, [searchQuery, map]);

  // Handle search selection
  const handleSearchSelect = (placeId) => {
    if (!placesService) return;

    placesService.getDetails(
      {
        placeId: placeId,
        fields: ["geometry", "formatted_address", "name"],
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const newLocation = {
            position: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
            address: place.formatted_address,
            name: place.name,
          };

          if (
            locationType === "Pickup Location" ||
            locationType === "Pickup and Drop-off"
          ) {
            setMarkers((prev) => ({
              ...prev,
              pickup: [...prev.pickup, newLocation],
            }));
          }
          if (
            locationType === "Drop-off Location" ||
            locationType === "Pickup and Drop-off"
          ) {
            setMarkers((prev) => ({
              ...prev,
              dropoff: [...prev.dropoff, newLocation],
            }));
          }

          setSearchQuery("");
          setSuggestions([]);
          map.panTo(newLocation.position);
        }
      }
    );
  };

  // Mock data for car details and reviews
  const carDetails = {
    name: "Tesla Model Y",
    image: audia1,
    thumbnails: [
      "/path-to-thumb1.jpg",
      "/path-to-thumb2.jpg",
      "/path-to-thumb3.jpg",
    ],
    fuelType: "Benzene",
    seating: "5 Seater",
    transmission: "Manual",
    rentPrice: {
      total: "7,843 birr",
      daily: "2,450 birr",
    },
    brand: "Tesla",
    model: "Model Y",
    manufactureDate: "2018",
    features: ["Air Conditioning", "4WD", "Android system"],
    pickupLocations: ["CMC Roundabout", "Bole Airport", "Ayat Zone 8"],
    dropOffLocations: ["CMC Roundabout", "Bole Airport"],
    insurance: "Full Coverage",
    rating: 4,
    reviews: [
      {
        name: "Veronika",
        rating: 4,
        reviewText: "Very comfortable and reliable car!",
        avatar: audia1,
      },
    ],
  };
  const [selectedImage, setSelectedImage] = useState(carDetails.image);

  // Remove location
  const removeLocation = (type, index) => {
    setMarkers((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  // Clear all locations of a type
  const clearLocations = (type) => {
    setMarkers((prev) => ({
      ...prev,
      [type]: [],
    }));
  };

  // Location list component

  return (
    <div className="flex bg-[#F8F8FF] md:flex-row flex-col gap-10">
      <div className="mx-auto md:p-16 p-6 w-full h-fit  md:w-9/12 bg-white rounded-2xl shadow-sm text-sm">
        <div className="flex items-center justify-center">
          <div className="w-full border-b-4 border-[#00113D] mr-2"></div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col w-1/2 items-start">
            <p className="text-xl text-gray-800 my-4 font-medium text-center mb-4">
              Steps 5 of 5
            </p>
          </div>
        </div>
        <h1 className="text-3xl font-semibold mt-8">Summary</h1>
        <div className="flex md:flex-row flex-col w-full items-center">
          <div className="w-fit pr-8">
            <img
              src={audia1}
              alt="Tesla Model Y"
              className="w-[350px] h-[300px] rounded-lg mb-4"
            />
            <div className="flex justify-start  space-x-2 items-center mt-6">
              {carDetails.thumbnails.map((thumb, index) => (
                <img
                  key={index}
                  src={audia1}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setSelectedImage(thumb)}
                  className="w-20 h-20 cursor-pointer rounded-lg"
                />
              ))}
            </div>
          </div>
          <div className="w-1/2 ">
            <div className="flex   items-center">
              <h3 className="text-lg font-semibold mb-4">Toyota Corolla</h3>
            </div>
            <div className="flex justify-between  space-x-6 items-center  mb-8 w-fit text-gray-800 text-sm">
              <div className="bg-blue-100 flex items-center text-blue-700 py-2 px-3 rounded-lg text-center ">
                <FaTag size={12} className="mx-2" /> 900 Birr
              </div>
              <div className="flex items-center space-x-2">
                <FaGasPump size={12} />
                <span>{"Benzene" || "Unknown"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCogs size={12} />
                <span>{"Automatic" || "Unknown"}</span>
              </div>
              <div className="flex items-center w-28 space-x-2">
                <FaUserFriends size={13} />
                <span>{"5" || "Unknown"} People</span>
              </div>
            </div>

            {/* Car Specification */}
            <h4 className="mt-8 text-lg font-semibold">Car Specification</h4>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <span className="text-gray-500">Car Brand</span>
                <p className="">Toyota</p>
              </div>
              <div>
                <span className="text-gray-500">Car Model</span>
                <p className="">Camry</p>
              </div>
              <div>
                <span className="text-gray-500">Manufacture Date</span>
                <p className="">2008</p>
              </div>
            </div>
            <div className="  text-[#000000]">
              {/* Features */}
              <section className="my-8">
                <h2 className="font-semibold text-lg mb-4">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Air Conditioning",
                    "4WD",
                    "Android system",
                    "Android system",
                    "Android system",
                  ].map((feature, index) => (
                    <span
                      key={index}
                      className="border border-gray-400 text-sm px-3 py-1 rounded-xl"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-[350px] gap-4">
        {" "}
        <div className="mx-auto p-8 h-fit w-full bg-white rounded-xl shadow-sm ">
          <div className=" flex items-center gap-20 text-sm">
            Booking{" "}
            <span className=" text-gray-700 px-4 py-1 rounded-xl text-sm border border-gray-300">
              Instant
            </span>
          </div>
          <div className=" flex items-center my-4 gap-4 text-sm">
            Notice Period For Rent{" "}
            <span className=" text-gray-700 px-4 py-1 rounded-xl text-sm border border-gray-300">
              2 days before pickup
            </span>
          </div>
        </div>
        <div className="mx-auto p-8 h-fit w-full bg-white rounded-xl shadow-sm ">
          <div className="">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Pick up Locations
            </h3>
            <ul className=" text-sm space-y-6 text-gray-700">
              <li className="flex items-center gap-4">
                <IoLocationOutline size={16} /> CMC roundabout
              </li>
              <li className="flex items-center gap-4">
                <IoLocationOutline size={16} /> Ayat Zone 8
              </li>
              <li className="flex items-center gap-4">
                <IoLocationOutline size={16} /> Bole Airport
              </li>
            </ul>
          </div>
          <div className="my-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Drop off Locations
            </h3>
            <ul className=" text-sm space-y-6 text-gray-700">
              <li className="flex items-center gap-4">
                <IoLocationOutline size={16} /> CMC roundabout
              </li>
              <li className="flex items-center gap-4">
                <IoLocationOutline size={16} /> Ayat Zone 8
              </li>
              <li className="flex items-center gap-4">
                <IoLocationOutline size={16} /> Bole Airport
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto p-4  h-fit bg-white w-full text-sm space-y-6 rounded-xl shadow-sm ">
          <div className="flex gap-4 items-center">
            <FaCalendarAlt size={16} /> August 28 - September 28, 2024
          </div>
          <div className="flex gap-4 items-center">
            <FaCalendarAlt size={16} /> August 28 - September 28, 2024
          </div>
          <div className="flex gap-4 items-center">
            <FaCalendarAlt size={16} /> August 28 - September 28, 2024
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default Step5;
