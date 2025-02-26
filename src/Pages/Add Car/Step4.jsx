import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import {
  FaLocationArrow,
  FaMapMarkerAlt,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoIosCloseCircleOutline, IoMdClose } from "react-icons/io";

const GOOGLE_MAPS_API_KEY = "AIzaSyC3TxwdUzV5gbwZN-61Hb1RyDJr0PRSfW4";
const libraries = ["places"];

const Step4 = ({ nextStep, prevStep }) => {
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
    height: "30vh",
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
  const LocationList = ({ title, locations, type }) => (
    <div className="mt-4  border border-blue-200 p-4 rounded-2xl">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl my-4 font-semibold">{title}</h3>
        {locations.length > 0 && (
          <button
            onClick={() => clearLocations(type)}
            className="text-red-500 flex items-center gap-2"
          >
            <FaTrash /> Clear All
          </button>
        )}
      </div>
      <ul className="mt-2 gap-2 space-y-2 flex flex-wrap">
        {locations.map((loc, index) => (
          <li
            key={index}
            className="flex space-x-4 w-fit items-center py-2 px-3 bg-white rounded-full border border-gray-400"
          >
            <button
              onClick={() => removeLocation(type, index)}
              className="text-gray-500 hover:text-red-700"
            >
              <IoIosCloseCircleOutline size={16} />
            </button>
            <span>{loc.name || loc.address}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="flex bg-[#F8F8FF]  gap-10">
      <div className="mx-auto md:p-16 p-6 w-full bg-white rounded-2xl shadow-sm text-sm">
        <div className="flex items-center justify-center">
          <div className="w-4/5 border-b-4 border-[#00113D] mr-2"></div>
          <div className="w-1/5 border-b-4 border-blue-200"></div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col w-1/2 items-start">
            <p className="text-lg text-gray-800 my-4 font-medium text-center mb-4">
              Steps 4 of 5
            </p>
          </div>
        </div>
        <h1 className="text-3xl font-semibold my-8">Car Details</h1>
        <button
          onClick={() => setShowModal(true)}
          className=" py-1 bg-[#F8F8FF] gap-4 w-full justify-center text-gray-700 border border-blue-200 shadow-sm items-center rounded-lg text-base hover:bg-blue-200 flex transition-colors"
        >
          <FaPlus size={12} />
          Add Location
        </button>
        {/* Display Selected Locations */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-6">Selected Locations</h2>
          <div className="gap-8 grid grid-cols-1 w-full md:grid-cols-2">
            {markers.pickup.length > 0 && (
              <LocationList
                title="Pickup Locations"
                locations={markers.pickup}
                type="pickup"
              />
            )}
            {markers.dropoff.length > 0 && (
              <LocationList
                title="Drop-off Locations"
                locations={markers.dropoff}
                type="dropoff"
              />
            )}
            {markers.pickup.length === 0 && markers.dropoff.length === 0 && (
              <p className="text-gray-500 text-sm italic">
                No locations selected yet
              </p>
            )}
          </div>
        </div>
        {/* Location Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full md:max-w-xl max-h-[80vh] overflow-y-auto relative">
              {/* Add close button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
              >
                <IoMdClose size={24} />
              </button>

              <div className="p-6">
                <h2 className="text-lg font-semibold mb-6">Set Location</h2>

                <div className="mb-6">
                  <label className="text-base text-gray-600 mb-2 block">
                    Location Type *
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg text-sm"
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value)}
                    required
                  >
                    <option value="">Select location type</option>
                    {locationTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative mb-6">
                  <FaSearch
                    size={14}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    className="w-full p-2  border rounded-lg text-base"
                    placeholder="Search location"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {suggestions.length > 0 && (
                    <ul className="absolute left-0 right-0 bg-white border mt-2 rounded-lg max-h-60 overflow-y-auto z-10">
                      {suggestions.map((suggestion) => (
                        <li
                          key={suggestion.place_id}
                          onClick={() =>
                            handleSearchSelect(suggestion.place_id)
                          }
                          className="p-3 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                          {suggestion.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <LoadScript
                  googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                  libraries={libraries}
                >
                  <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={13}
                    center={currentLocation || defaultCenter}
                    onClick={handleMapClick}
                    onLoad={onMapLoad}
                  >
                    {markers.pickup.map((marker, index) => (
                      <Marker
                        key={`pickup-${index}`}
                        position={marker.position}
                        icon={{
                          url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                        }}
                      />
                    ))}
                    {markers.dropoff.map((marker, index) => (
                      <Marker
                        key={`dropoff-${index}`}
                        position={marker.position}
                        icon={{
                          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        }}
                      />
                    ))}
                  </GoogleMap>
                </LoadScript>
                {/* Add My Location button */}
                <button
                  onClick={handleMyLocation}
                  className="w-full p-2 border h-fit flex justify-center gap-4 mt-4 items-center border-gray-300 rounded-full text-sm hover:bg-gray-50"
                >
                  <FaMapMarkerAlt size={16} /> My Location
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full p-2 bg-navy-900 text-white rounded-full text-sm mt-4"
                >
                  Set Location
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-4 md:flex-row mt-16 justify-between">
          <button
            onClick={prevStep}
            className="px-12 py-3 border border-gray-300 rounded-full text-sm"
          >
            Back
          </button>
          <button
            onClick={nextStep}
            className="px-12 py-3 bg-navy-900 text-white rounded-full text-sm"
          >
            Submit Listing
          </button>
        </div>
      </div>

      <div className="p-4 w-1/4 bg-blue-100 font-light hidden md:flex py-8 h-fit">
        Make sure to upload all documents necessary to validate that you have
        ownership of the rented car
      </div>
    </div>
  );
};

export default Step4;
