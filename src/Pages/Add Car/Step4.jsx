import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { FaMapMarkerAlt, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { IoIosCloseCircleOutline, IoMdClose } from "react-icons/io";
import useVehicleFormStore from "../../store/useVehicleFormStore";
// import { v4 as uuidv4 } from "uuid"; // Import UUID generator - currently commented out

const GOOGLE_MAPS_API_KEY = "AIzaSyC3TxwdUzV5gbwZN-61Hb1RyDJr0PRSfW4"; // Replace with your actual API key
const libraries = ["places"];

const Step4 = ({ nextStep, prevStep }) => {
  const { vehicleData, updateVehicleData, submitVehicleListing } =
    useVehicleFormStore();

  // Initialize state from store with proper fallbacks
  const [markers, setMarkers] = useState({
    pickup: vehicleData.pickUpLocation || [], // Corrected: use pickUpLocation
    dropoff: vehicleData.dropOffLocation || [], // Corrected: use dropOffLocation
  });

  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationType, setLocationType] = useState(""); // For the modal
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [map, setMap] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Sync with store on any marker changes
  useEffect(() => {
    updateVehicleData({
      pickUpLocation: markers.pickup, // Corrected: use pickUpLocation
      dropOffLocation: markers.dropoff, // Corrected: use dropOffLocation
    });
  }, [markers, updateVehicleData]);

  const mapStyles = {
    height: "40vh", // Increased height for better usability
    width: "100%",
    borderRadius: "0.5rem", // Added some rounding
  };

  const defaultCenter = {
    lat: 9.0233, // Addis Ababa
    lng: 38.7468,
  };

  const locationTypes = [
    "Pickup Location",
    "Drop-off Location",
    "Pickup and Drop-off", // This option adds to both
  ];

  // Geolocation setup
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
          console.error("Geolocation error:", error);
          // Fallback or notify user that default location is used
        }
      );
    }
  }, []);

  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);
    if (window.google && window.google.maps && window.google.maps.places) {
      setPlacesService(
        new window.google.maps.places.PlacesService(mapInstance)
      );
    } else {
      console.error("Google Maps Places Service not available.");
    }
  };

  const handleMapClick = (event) => {
    if (!locationType) {
      alert("Please select a location type first (e.g., Pickup, Drop-off).");
      return;
    }
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      console.error("Google Maps Geocoder not available.");
      return;
    }

    const newPosition = { lat: event.latLng.lat(), lng: event.latLng.lng() };

    new window.google.maps.Geocoder().geocode(
      { location: newPosition },
      (results, status) => {
        if (status === "OK" && results[0]) {
          const newLocation = {
            id: Date.now().toString(), // Simple unique ID for React keys
            position: newPosition,
            address: results[0].formatted_address,
            name:
              results[0].address_components[0]?.long_name ||
              results[0].formatted_address.split(",")[0], // Try to get a more concise name
          };
          updateMarkers(newLocation);
        } else {
          console.error("Geocoder failed due to: " + status);
          // Fallback: add with just coordinates if geocoding fails
          const newLocation = {
            id: Date.now().toString(),
            position: newPosition,
            address: `Lat: ${newPosition.lat.toFixed(
              4
            )}, Lng: ${newPosition.lng.toFixed(4)}`,
            name: `Location at ${newPosition.lat.toFixed(
              2
            )}, ${newPosition.lng.toFixed(2)}`,
          };
          updateMarkers(newLocation);
        }
      }
    );
  };

  const updateMarkers = (newLocationWithDetails) => {
    if (!locationType) return; // Should be caught by handleMapClick, but defensive

    setMarkers((prev) => {
      const newPickup = [...prev.pickup];
      const newDropoff = [...prev.dropoff];

      if (locationType.includes("Pickup")) {
        newPickup.push(newLocationWithDetails);
      }
      if (locationType.includes("Drop-off")) {
        newDropoff.push(newLocationWithDetails);
      }
      return { pickup: newPickup, dropoff: newDropoff };
    });
    // Optionally close modal or clear search after adding
    // setShowModal(false);
    // setSearchQuery('');
    // setSuggestions([]);
    // setLocationType(''); // Reset location type for next addition
  };

  // Search handling
  useEffect(() => {
    if (
      !searchQuery ||
      !window.google ||
      !window.google.maps ||
      !window.google.maps.places
    ) {
      setSuggestions([]);
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      { input: searchQuery, componentRestrictions: { country: "ET" } }, // Restrict to Ethiopia
      (predictions, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      }
    );
  }, [searchQuery]);

  const handleSearchSelect = (placeId) => {
    if (!locationType) {
      alert("Please select a location type first (e.g., Pickup, Drop-off).");
      return;
    }
    if (!placesService) {
      console.error("PlacesService is not initialized.");
      return;
    }

    placesService.getDetails(
      { placeId, fields: ["geometry", "formatted_address", "name"] },
      (place, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place &&
          place.geometry
        ) {
          const newLocation = {
            id: placeId, // Use placeId as a unique ID
            position: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
            address: place.formatted_address,
            name: place.name || place.formatted_address.split(",")[0],
          };

          updateMarkers(newLocation);
          map?.panTo(newLocation.position);
          map?.setZoom(15);
          setSearchQuery("");
          setSuggestions([]);
        } else {
          console.error("Place details request failed due to: " + status);
        }
      }
    );
  };

  // Location actions
  const removeLocation = (type, idToRemove) => {
    // Use id for removal
    setMarkers((prev) => ({
      ...prev,
      [type]: prev[type].filter((loc) => loc.id !== idToRemove),
    }));
  };

  const clearLocations = (type) => {
    setMarkers((prev) => ({ ...prev, [type]: [] }));
  };

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const myLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(myLocation); // Update current location for map center
          map?.panTo(myLocation);
          map?.setZoom(15);
        },
        (error) => alert("Location access failed: " + error.message)
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const LocationList = ({ title, locations, type }) => (
    <div className="mt-4 border border-blue-200 p-4 rounded-2xl bg-white">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
        {locations.length > 0 && (
          <button
            onClick={() => clearLocations(type)}
            className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
          >
            <FaTrash /> Clear All
          </button>
        )}
      </div>
      {locations.length === 0 ? (
        <p className="text-gray-500 text-xs italic">
          No {type} locations added yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {locations.map((loc) => (
            <li
              key={loc.id} // Use unique ID for key
              className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md border border-gray-200 text-xs"
            >
              <span className="truncate flex-1 mr-2" title={loc.address}>
                {loc.name || loc.address}
              </span>
              <button
                onClick={() => removeLocation(type, loc.id)} // Pass id
                className="text-gray-400 hover:text-red-600"
              >
                <IoIosCloseCircleOutline size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // --- Validation Logic ---
  const isPickupLocationFilled = markers.pickup.length > 0;
  const isDropoffLocationFilled = markers.dropoff.length > 0;
  const allRequiredLocationsFilled =
    isPickupLocationFilled && isDropoffLocationFilled;
  // --- End Validation Logic ---

  const handleSubmitAndProceed = () => {
    if (!allRequiredLocationsFilled) {
      // This should ideally not be needed if button is disabled, but as a safeguard
      alert("Please add at least one pickup and one drop-off location.");
      return;
    }
    // const vehicleId = uuidv4(); // UUID generation, if needed
    // updateVehicleData({ id: vehicleId });
    submitVehicleListing();
    nextStep();
  };

  return (
    <div className="flex bg-[#F8F8FF] gap-10">
      <div className="mx-auto md:p-10 p-6 lg:w-2/3 w-full bg-white rounded-2xl shadow-lg text-sm">
        {/* Progress Header */}
        <div className="flex items-center justify-center">
          <div className="w-4/5 border-b-4 border-[#00113D] mr-2"></div>
          <div className="w-1/5 border-b-4 border-blue-200"></div>
        </div>
        <p className="text-lg text-gray-800 my-4 font-medium">Step 4 of 5</p>

        <h1 className="text-3xl font-semibold my-6 text-gray-800">
          Car Locations
        </h1>
        <p className="text-gray-600 mb-6">
          Specify where customers can pick up and drop off the car. You can add
          multiple locations for each.
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="py-3  hover:bg-blue-50  gap-2 w-full justify-center shadow-sm border border-gray-600 items-center rounded-2xl text-base flex transition-colors duration-150 "
        >
          <FaPlus size={14} /> Add New Location
        </button>

        {/* Validation Messages for overall form */}
        {(!isPickupLocationFilled || !isDropoffLocationFilled) &&
          !showModal && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs">
              {!isPickupLocationFilled && (
                <p>• Please add at least one pickup location.</p>
              )}
              {!isDropoffLocationFilled && (
                <p className={!isPickupLocationFilled ? "mt-1" : ""}>
                  • Please add at least one drop-off location.
                </p>
              )}
            </div>
          )}

        {/* Selected Locations */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">
            Selected Locations
          </h2>
          <div className="gap-6 grid grid-cols-1 md:grid-cols-2 w-full">
            <LocationList
              title="Pickup Locations"
              locations={markers.pickup}
              type="pickup"
            />
            <LocationList
              title="Drop-off Locations"
              locations={markers.dropoff}
              type="dropoff"
            />
          </div>
          {markers.pickup.length === 0 &&
            markers.dropoff.length === 0 &&
            !showModal && (
              <p className="text-gray-500 text-sm italic mt-4">
                No locations selected yet. Click "Add New Location" to get
                started.
              </p>
            )}
        </div>

        {/* Location Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-out">
            <div className="bg-white rounded-xl shadow-2xl w-full md:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Set Location on Map
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setLocationType(""); // Reset type when closing modal
                    setSearchQuery("");
                    setSuggestions([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <IoMdClose size={28} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-grow">
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Location Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value)}
                    required
                  >
                    <option value="">Select location type...</option>
                    {locationTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {!locationType && (
                    <p className="text-xs text-red-500 mt-1">
                      Please select a type to add a location.
                    </p>
                  )}
                </div>

                <div className="relative mb-4">
                  <input
                    type="text"
                    className="w-full p-2.5 pl-10 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search for a location (e.g., Bole, Addis Ababa)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={!locationType} // Disable if no type selected
                  />
                  <FaSearch
                    size={16}
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      !locationType ? "text-gray-300" : "text-gray-400"
                    }`}
                  />
                  {suggestions.length > 0 && searchQuery && (
                    <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 rounded-md max-h-48 overflow-y-auto z-20 shadow-lg">
                      {suggestions.map((suggestion) => (
                        <li
                          key={suggestion.place_id}
                          onClick={() => {
                            if (locationType)
                              handleSearchSelect(suggestion.place_id);
                          }}
                          className="p-3 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                          {suggestion.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Or, click directly on the map to select a location.
                </p>

                <LoadScript
                  googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                  libraries={libraries}
                  loadingElement={
                    <div className="text-center py-4">Loading Map...</div>
                  }
                >
                  <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={currentLocation ? 13 : 6} // Zoom further out if no current location
                    center={currentLocation || defaultCenter}
                    onClick={handleMapClick}
                    onLoad={onMapLoad}
                    options={{
                      gestureHandling: "greedy", // Allows map interaction without holding ctrl/cmd
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: false,
                    }}
                  >
                    {/* Show current markers on the map */}
                    {markers.pickup.map((marker) => (
                      <Marker
                        key={`map-pickup-${marker.id}`}
                        position={marker.position}
                        icon={{
                          url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                        }}
                      />
                    ))}
                    {markers.dropoff.map((marker) => (
                      <Marker
                        key={`map-dropoff-${marker.id}`}
                        position={marker.position}
                        icon={{
                          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        }}
                      />
                    ))}
                    {currentLocation && (
                      <Marker
                        position={currentLocation}
                        title="Your Current Location"
                        icon={{
                          url: "http://maps.google.com/mapfiles/kml/paddle/blu-blank.png", // A different marker for current location
                        }}
                      />
                    )}
                  </GoogleMap>
                </LoadScript>

                <button
                  onClick={handleMyLocation}
                  className="w-full p-2.5 border flex justify-center gap-2 mt-4 items-center border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FaMapMarkerAlt size={16} /> Center Map on My Location
                </button>
              </div>
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setLocationType(""); // Reset type when closing modal
                    setSearchQuery("");
                    setSuggestions([]);
                  }}
                  className="w-full p-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Done Adding Locations
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-4 md:flex-row mt-10 pt-6 border-t border-gray-200 justify-between">
          <button
            onClick={prevStep}
            className="px-10 py-3 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSubmitAndProceed}
            className={`px-10 py-3 rounded-full text-sm font-medium text-white transition-all duration-150 ease-in-out
              ${
                allRequiredLocationsFilled
                  ? "bg-navy-900 hover:bg-navy-800 shadow-md"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            disabled={!allRequiredLocationsFilled}
          >
            Submit Listing & Continue
          </button>
        </div>
      </div>

      <div className="p-6 w-1/3 lg:flex hidden flex-col gap-4 text-sm bg-blue-50 border border-blue-200 rounded-lg shadow-sm h-fit">
        <h3 className="font-semibold text-blue-700">Location Tips:</h3>
        <ul className="list-disc list-inside text-blue-600 space-y-1 text-xs">
          <li>Be precise with your pickup and drop-off points.</li>
          <li>
            Consider adding locations near popular landmarks or transport hubs.
          </li>
          <li>You can add multiple options for flexibility.</li>
          <li>Use the search or click directly on the map.</li>
        </ul>
        <p className="text-xs text-gray-600 mt-2">
          Clear and convenient locations improve the chances of your car being
          booked.
        </p>
      </div>
    </div>
  );
};

export default Step4;
