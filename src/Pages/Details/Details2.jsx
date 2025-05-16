import React, { useEffect, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MapComponent from "../../components/GoogleMaps"; // ADJUST PATH
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { getDownloadUrl } from "../../api"; // ADJUST PATH
import {
  FaArrowLeft,
  FaCogs,
  FaGasPump,
  FaRegCircle,
  FaStar,
  FaUserFriends,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import PriceBreakdown from "./PriceBreakdown"; // ADJUST PATH
import Dropdown from "../../components/Search/Dropdown"; // ADJUST PATH
import useVehicleFormStore from "../../store/useVehicleFormStore"; // ADJUST PATH

// --- CONFIGURATION ---
const GOOGLE_MAPS_API_KEY = "AIzaSyC3TxwdUzV5gbwZN-61Hb1RyDJr0PRSfW4"; // <<<--- REPLACE THIS
const PLACEHOLDER_IMAGE_URL =
  "https://via.placeholder.com/600x400.png?text=No+Image+Available";

// --- HELPER COMPONENTS & FUNCTIONS ---
const PopupNotification = ({ message, type, visible, onClose }) => {
  useEffect(() => {
    let timer;
    if (visible) {
      timer = setTimeout(() => {
        onClose();
      }, 3500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, onClose]);

  if (!visible) return null;
  const baseStyle =
    "fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl text-white text-sm z-[120] transition-all duration-300 ease-in-out";
  const typeStyle =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-yellow-500 text-black";
  return (
    <div className={`${baseStyle} ${typeStyle}`}>
      {message}{" "}
      <button onClick={onClose} className="ml-4 font-bold">
        ×
      </button>
    </div>
  );
};

const fetchPlaceName = async (lat, lng) => {
  const isValidLat = typeof lat === "number" && !isNaN(lat);
  const isValidLng = typeof lng === "number" && !isNaN(lng);
  const isKeyValid =
    GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== "YOUR_GOOGLE_MAPS_API_KEY"; // Check against actual placeholder
  if (!isValidLat || !isValidLng || !isKeyValid) {
    console.warn(
      `Geocoding skipped: Missing valid coords (Lat valid: ${isValidLat}, Lng valid: ${isValidLng}) or API key issue (Key valid: ${isKeyValid}).`,
      {
        lat,
        lng,
        keyStatus: isKeyValid
          ? "Valid (but may have other issues)"
          : "Invalid/Placeholder",
      }
    );
    const fLat = isValidLat ? lat.toFixed(2) : "N/A";
    const fLng = isValidLng ? lng.toFixed(2) : "N/A";
    return `Coord: ${fLat}, ${fLng} (API Call Skipped)`;
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === "OK" && data.results[0]) {
      const result = data.results[0];
      const poi = result.address_components.find(
        (c) =>
          c.types.includes("point_of_interest") ||
          c.types.includes("establishment")
      );
      if (poi) return poi.long_name;
      const neighborhood = result.address_components.find((c) =>
        c.types.includes("neighborhood")
      );
      if (neighborhood) return neighborhood.long_name;
      const sublocality = result.address_components.find(
        (c) =>
          c.types.includes("sublocality_level_1") ||
          c.types.includes("sublocality")
      );
      if (sublocality) return sublocality.long_name;
      const locality = result.address_components.find((c) =>
        c.types.includes("locality")
      );
      if (locality) return locality.long_name;
      return result.formatted_address.split(",").slice(0, 2).join(", ");
    } else {
      console.error("Geocoding API Error:", data.status, data.error_message);
      return `Location @ ${lat.toFixed(2)}, ${lng.toFixed(2)} (API Error: ${
        data.status
      })`;
    }
  } catch (error) {
    console.error("Error fetching place name (Network/Fetch):", error);
    return `Location @ ${lat.toFixed(2)}, ${lng.toFixed(2)} (Network Error)`;
  }
};

const formatDateInternal = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Unknown Date";
  }
};
const formatDateForDisplayInternal = (date) => {
  if (!date) return "Not set";
  try {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date for display:", e);
    return "Invalid Date";
  }
};

// --- MAIN COMPONENT ---
export default function Details2() {
  const locationHook = useLocation();
  const navigate = useNavigate();
  const { id: selectedVehicleId } = useParams();

  const [customer, setCustomer] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });
  const [currentPickUpDate, setCurrentPickUpDate] = useState(
    locationHook.state?.pickUpTime
      ? new Date(locationHook.state.pickUpTime)
      : null
  );
  const [currentDropOffDate, setCurrentDropOffDate] = useState(
    locationHook.state?.DropOffTime // Note: DropOffTime had a capital 'O' in original code
      ? new Date(locationHook.state.DropOffTime)
      : null
  );
  const [dateError, setDateError] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [vehicleImages, setVehicleImages] = useState([]);
  const [selectedImageForDisplay, setSelectedImageForDisplay] = useState(
    PLACEHOLDER_IMAGE_URL
  );
  const [imageLoading, setImageLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const { apiCallWithRetry } = useVehicleFormStore();
  const [pickUpLocationOptions, setPickUpLocationOptions] = useState([]);
  const [dropOffLocationOptions, setDropOffLocationOptions] = useState([]);
  const [selectedPickUpLocationName, setSelectedPickUpLocationName] = useState(
    locationHook.state?.pickupLocationName || ""
  );
  const [selectedDropOffLocationName, setSelectedDropOffLocationName] =
    useState(locationHook.state?.dropoffLocationName || "");
  const [actualSelectedPickUp, setActualSelectedPickUp] = useState(
    locationHook.state?.pickupLocationData || null
  );
  const [actualSelectedDropOff, setActualSelectedDropOff] = useState(
    locationHook.state?.dropoffLocationData || null
  );
  // REMOVED: const [allVehicleEvents, setAllVehicleEvents] = useState([]);
  // REMOVED: const [availableEvents, setAvailableEvents] = useState([]);
  // We will use vehicleDetails.unavailableDates directly (Array of ISO strings)

  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showMapPopup, setShowMapPopup] = useState(false);
  const [mapPopupData, setMapPopupData] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const showStatusPopup = (message, type) => {
    setPopup({ visible: true, message, type });
  };

  useEffect(() => {
    /* Auth Check */
    const storedCustomer = JSON.parse(localStorage.getItem("customer"));
    if (!storedCustomer || !storedCustomer.AccessToken) {
      showStatusPopup("You must be logged in. Redirecting...", "error");
      setTimeout(() => navigate("/search"), 4000);
    } else {
      setCustomer(storedCustomer);
    }
    setAuthChecked(true);
  }, [navigate]);

  useEffect(() => {
    /* Fetch Vehicle Data */
    if (!authChecked || !customer) return;
    const fetchVehicleData = async () => {
      if (!selectedVehicleId) {
        setApiError("Vehicle ID is missing.");
        setDetailsLoading(false);
        setImageLoading(false);
        return;
      }
      setDetailsLoading(true);
      setImageLoading(true);
      setApiError(null);
      try {
        const response = await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/${selectedVehicleId}`,
          { method: "GET" }
        );
        if (response && response.body) {
          setVehicleDetails(response.body);
          // Events logic removed. Assuming response.body.unavailableDates exists and is an array of ISO strings.
          // Example: response.body.unavailableDates = ["2024-08-10T00:00:00.000Z", "2024-08-15T00:00:00.000Z"]
          // If your API returns unavailable dates under a different key or format, adjust here.

          if (response.body.vehicleImageKeys?.length > 0) {
            const fetchedUrls = await Promise.all(
              response.body.vehicleImageKeys.map(
                async (key) =>
                  (await getDownloadUrl(key))?.body || PLACEHOLDER_IMAGE_URL
              )
            );
            const validUrls = fetchedUrls.filter(
              (url) => url !== PLACEHOLDER_IMAGE_URL && url
            );
            setVehicleImages(
              validUrls.length > 0 ? validUrls : [PLACEHOLDER_IMAGE_URL]
            );
            setSelectedImageForDisplay(
              validUrls.length > 0 ? validUrls[0] : PLACEHOLDER_IMAGE_URL
            );
          } else {
            setVehicleImages([PLACEHOLDER_IMAGE_URL]);
            setSelectedImageForDisplay(PLACEHOLDER_IMAGE_URL);
          }
        } else {
          setApiError("Failed to fetch vehicle details or invalid format.");
        }
      } catch (err) {
        console.error("API Call Error:", err);
        setApiError(`Error: ${err.message}`);
      } finally {
        setDetailsLoading(false);
        setImageLoading(false);
      }
    };
    fetchVehicleData();
  }, [selectedVehicleId, apiCallWithRetry, authChecked, customer]);

  // Effect to PROCESS RAW COORDINATES into options with human-readable NAMES (Unchanged)
  useEffect(() => {
    if (!vehicleDetails) return;

    const processLocationOptions = async (
      coordsArray,
      setOptionsState,
      setActualSelectedState,
      setSelectedNameState,
      initialSelectedFullData,
      initialSelectedNameOnly
    ) => {
      if (!Array.isArray(coordsArray) || coordsArray.length === 0) {
        setOptionsState([]);
        setSelectedNameState("");
        setActualSelectedState(null);
        return;
      }

      const optionsPromises = coordsArray.map(async (coordData, index) => {
        let lat, lng, originalCoordsForOption;
        if (Array.isArray(coordData) && coordData.length === 2) {
          lat = parseFloat(coordData[0]);
          lng = parseFloat(coordData[1]);
          if (
            typeof lat === "number" &&
            typeof lng === "number" &&
            !isNaN(lat) &&
            !isNaN(lng)
          ) {
            originalCoordsForOption = { lat, lng };
          } else {
            return null;
          }
        } else if (
          coordData?.position?.lat !== undefined &&
          coordData?.position?.lng !== undefined
        ) {
          lat = parseFloat(coordData.position.lat);
          lng = parseFloat(coordData.position.lng);
          if (
            typeof lat === "number" &&
            typeof lng === "number" &&
            !isNaN(lat) &&
            !isNaN(lng)
          ) {
            originalCoordsForOption = { lat, lng };
          } else {
            return null;
          }
        } else if (
          coordData?.lat !== undefined &&
          coordData?.lng !== undefined
        ) {
          lat = parseFloat(coordData.lat);
          lng = parseFloat(coordData.lng);
          if (
            typeof lat === "number" &&
            typeof lng === "number" &&
            !isNaN(lat) &&
            !isNaN(lng)
          ) {
            originalCoordsForOption = { lat, lng };
          } else {
            return null;
          }
        } else {

          return null;
        }

        const displayName = await fetchPlaceName(lat, lng);
        const id = `${displayName.replace(/\W/g, "")}-${index}-${Math.random()
          .toString(16)
          .slice(2)}`;
        return { originalCoords: originalCoordsForOption, displayName, id };
      });

      const createdOptions = (await Promise.all(optionsPromises)).filter(
        Boolean
      );
      setOptionsState(createdOptions);

      let matchedOption = null;
      if (initialSelectedFullData && initialSelectedFullData.originalCoords) {
        matchedOption = createdOptions.find(
          (opt) =>
            opt.originalCoords.lat ===
              initialSelectedFullData.originalCoords.lat &&
            opt.originalCoords.lng ===
              initialSelectedFullData.originalCoords.lng &&
            (!initialSelectedFullData.displayName ||
              opt.displayName === initialSelectedFullData.displayName)
        );
      }
      if (!matchedOption && initialSelectedNameOnly) {
        matchedOption = createdOptions.find(
          (opt) => opt.displayName === initialSelectedNameOnly
        );
      }
      if (matchedOption) {
        setActualSelectedState(matchedOption);
        setSelectedNameState(matchedOption.displayName);
      } else {
        if (
          (setOptionsState === setPickUpLocationOptions &&
            !selectedPickUpLocationName) ||
          (setOptionsState === setDropOffLocationOptions &&
            !selectedDropOffLocationName)
        ) {
          setSelectedNameState("");
          setActualSelectedState(null);
        }
      }
    };

    if (vehicleDetails.pickUp) {
      processLocationOptions(
        vehicleDetails.pickUp,
        setPickUpLocationOptions,
        setActualSelectedPickUp,
        setSelectedPickUpLocationName,
        locationHook.state?.pickupLocationData,
        locationHook.state?.pickupLocationName
      );
    } else {
      setPickUpLocationOptions([]);
      setSelectedPickUpLocationName("");
      setActualSelectedPickUp(null);
    }
    if (vehicleDetails.dropOff) {
      processLocationOptions(
        vehicleDetails.dropOff,
        setDropOffLocationOptions,
        setActualSelectedDropOff,
        setSelectedDropOffLocationName,
        locationHook.state?.dropoffLocationData,
        locationHook.state?.dropoffLocationName
      );
    } else {
      setDropOffLocationOptions([]);
      setSelectedDropOffLocationName("");
      setActualSelectedDropOff(null);
    }
  }, [
    vehicleDetails,
    locationHook.state,
    selectedPickUpLocationName,
    selectedDropOffLocationName,
  ]);

  const isDaySelectable = useCallback(
    (dateToTest) => {
      const currentDay = new Date(dateToTest);
      currentDay.setHours(0, 0, 0, 0); // Normalize to start of day for comparison

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (currentDay < today) return false; // Cannot select past dates

      if (
        vehicleDetails &&
        vehicleDetails.unavailableDates &&
        Array.isArray(vehicleDetails.unavailableDates)
      ) {
        const isUnavailable = vehicleDetails.unavailableDates.some(
          (isoString) => {
            const unavailableDate = new Date(isoString);
            unavailableDate.setHours(0, 0, 0, 0); // Normalize
            return unavailableDate.getTime() === currentDay.getTime();
          }
        );
        return !isUnavailable; // Day is selectable if it's NOT in the unavailable list
      }
      return true; // If no unavailableDates array, assume all future dates are selectable
    },
    [vehicleDetails]
  ); // Depends on vehicleDetails (specifically vehicleDetails.unavailableDates)

  const isDateRangeValid = useCallback(
    (startDate, endDate) => {
      if (!startDate || !endDate) return true; // No range to validate or one end is missing
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);

      if (start >= end) return false; // Start date must be before end date

      // Iterate through each day in the range
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (!isDaySelectable(new Date(d))) {
          // Use a new Date object for each iteration
          return false; // If any day in the range is not selectable, the range is invalid
        }
      }
      return true; // All days in the range are selectable
    },
    [isDaySelectable]
  );

  const handlePickUpDateChange = (date) => {
    setCurrentPickUpDate(date);
    setDateError("");
    if (date && currentDropOffDate) {
      if (date >= currentDropOffDate) {
        setDateError("Pick-up date must be before drop-off.");
        setCurrentDropOffDate(null); // Clear drop-off if invalid
      } else if (!isDateRangeValid(date, currentDropOffDate)) {
        setDateError("Date range includes unavailable days.");
        // Optionally clear drop-off or leave it, depending on desired UX
        // setCurrentDropOffDate(null);
      }
    }
  };

  const handleDropOffDateChange = (date) => {
    setDateError("");
    if (!currentPickUpDate) {
      setDateError("Select pick-up date first.");
      setCurrentDropOffDate(null);
      return;
    }
    if (date && date <= currentPickUpDate) {
      setDateError("Drop-off date must be after pick-up.");
      setCurrentDropOffDate(null);
      return;
    }

    // Check if the new drop-off date forms a valid range with the current pick-up date
    if (date && currentPickUpDate) {
      if (isDateRangeValid(currentPickUpDate, date)) {
        setCurrentDropOffDate(date);
      } else {
        setDateError("Date range includes unavailable days.");
        setCurrentDropOffDate(null); // Clear drop-off if range becomes invalid
      }
    } else {
      setCurrentDropOffDate(date); // Allow clearing the drop-off date
    }
  };

  useEffect(() => {
    /* Initial Date Validation */
    if (
      authChecked &&
      customer &&
      vehicleDetails && // Ensure vehicleDetails (and thus unavailableDates) are loaded
      locationHook.state?.pickUpTime &&
      locationHook.state?.DropOffTime
    ) {
      const initialPickUp = new Date(locationHook.state.pickUpTime);
      const initialDropOff = new Date(locationHook.state.DropOffTime);

      // Only set dates if they are not already set, to avoid loops
      const datesNeedSetting = !currentPickUpDate && !currentDropOffDate;

      if (
        !(
          isDaySelectable(initialPickUp) &&
          isDaySelectable(initialDropOff) &&
          isDateRangeValid(initialPickUp, initialDropOff)
        )
      ) {
        setDateError(
          "Previously selected dates are unavailable. Please choose new dates."
        );
        if (datesNeedSetting) {
          // Clear dates if they were from location state and now invalid
          setCurrentPickUpDate(null);
          setCurrentDropOffDate(null);
        }
      } else {
        setDateError("");
        if (datesNeedSetting) {

          setCurrentPickUpDate(initialPickUp);
          setCurrentDropOffDate(initialDropOff);
        }
      }
    }
  }, [
    vehicleDetails, // Added vehicleDetails dependency
    locationHook.state,
    authChecked,
    customer,
    isDaySelectable,
    isDateRangeValid,
    currentPickUpDate, // Added to prevent re-setting if already set by user
    currentDropOffDate, // Added to prevent re-setting if already set by user
  ]);

  useEffect(() => {
    /* Fetch Ratings (Unchanged) */
    if (!authChecked || !customer || !selectedVehicleId) return;
    const fetchVehicleRatings = async (carID) => {
      try {
        const response = await fetch(
          "https://xo55y7ogyj.execute-api.us-east-1.amazonaws.com/prod/add_vehicle",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operation: "getRatingsbyID", carId: carID }),
          }
        );
        const data = await response.json();
        if (data.statusCode === 200 && data.body.success) {
          setRatings(data.body.data.ratings);
          setAverageRating(data.body.data.averageRating);
        } else {
          console.warn("Failed to fetch ratings:", data.body?.message);
          setRatings([]);
          setAverageRating(0);
        }
      } catch (e) {
        console.error("Error fetching ratings:", e);
        setRatings([]);
        setAverageRating(0);
      }
    };
    fetchVehicleRatings(selectedVehicleId);
  }, [selectedVehicleId, authChecked, customer]);
  const openFullScreen = (index) => {
    setCurrentImageIndex(index);
    setIsFullScreen(true);
  };
  const closeFullScreen = () => setIsFullScreen(false);
  const nextImage = () => {
    if (vehicleImages.length > 0)
      setCurrentImageIndex((prev) => (prev + 1) % vehicleImages.length);
  };
  const previousImage = () => {
    if (vehicleImages.length > 0)
      setCurrentImageIndex(
        (prev) => (prev - 1 + vehicleImages.length) % vehicleImages.length
      );
  };
  let days = 0;
  if (
    currentPickUpDate &&
    currentDropOffDate &&
    currentDropOffDate > currentPickUpDate
  ) {
    const timeDiff = currentDropOffDate.getTime() - currentPickUpDate.getTime();
    days = Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  const dailyPrice = vehicleDetails?.price
    ? parseFloat(vehicleDetails.price)
    : 0;
  const totalPrice = days * dailyPrice;

  const handleViewMap = (type, specificLocationData = null) => {
    if (!vehicleDetails) {
      showStatusPopup("Vehicle details not loaded yet.", "warning");
      return;
    }
    let vehiclesForMap = [];
    let mapCenter = { lat: 9.0054, lng: 38.7636 }; // Default center
    let popupTitleName = "";

    if (specificLocationData && specificLocationData.originalCoords) {
      const locationCoordsArray = [
        [
          specificLocationData.originalCoords.lat,
          specificLocationData.originalCoords.lng,
        ],
      ];
      vehiclesForMap = [
        {
          make: vehicleDetails.make,
          model: vehicleDetails.model,
          price: vehicleDetails.price,
          // Create dummy pickUp/dropOff for the map component to parse, only for the specific type
          pickUp: type === "pickup" ? locationCoordsArray : [],
          dropOff: type === "dropoff" ? locationCoordsArray : [],
        },
      ];
      mapCenter = specificLocationData.originalCoords;
      popupTitleName = specificLocationData.displayName;
    } else {

      // View all locations of a type
      vehiclesForMap = [vehicleDetails]; // Pass the full vehicle details
      const locationsOfType =
        type === "pickup"
          ? vehicleDetails.pickUp || []
          : vehicleDetails.dropOff || [];
      // Attempt to center on the first location of the specified type
      if (locationsOfType.length > 0) {
        const firstLoc = locationsOfType[0];
        if (Array.isArray(firstLoc) && firstLoc.length === 2) {
          // [lat, lng] format
          mapCenter = { lat: firstLoc[0], lng: firstLoc[1] };
        } else if (
          firstLoc &&
          typeof firstLoc.lat === "number" &&
          typeof firstLoc.lng === "number"
        ) {
          // {lat, lng} format
          mapCenter = { lat: firstLoc.lat, lng: firstLoc.lng };
        } else if (
          firstLoc &&
          firstLoc.position &&
          typeof firstLoc.position.lat === "number" &&
          typeof firstLoc.position.lng === "number"
        ) {
          // {position: {lat, lng}}
          mapCenter = {
            lat: firstLoc.position.lat,
            lng: firstLoc.position.lng,
          };
        }
      }
      popupTitleName =
        type === "pickup"
          ? "Available Pick Up Locations"
          : "Available Drop Off Locations";
    }

    // Check if there are valid coordinates to show for the selected type
    const hasValidCoords =
      vehiclesForMap.length > 0 &&
      ((type === "pickup" &&
        vehiclesForMap[0].pickUp &&
        vehiclesForMap[0].pickUp.length > 0) ||
        (type === "dropoff" &&
          vehiclesForMap[0].dropOff &&
          vehiclesForMap[0].dropOff.length > 0));

    if (hasValidCoords) {
      setMapPopupData({
        vehiclesToShow: vehiclesForMap,
        center: mapCenter,
        type: type, // This helps MapComponent know which type of pins to emphasize if needed
        displayNameForTitle: popupTitleName,
      });
      setShowMapPopup(true);
    } else {
      const message = specificLocationData
        ? `Selected ${type} location could not be shown on map.`
        : `No valid ${type} locations defined for this vehicle.`;
      showStatusPopup(message, "warning");
    }
  };

  const handleCloseMapPopup = () => {
    setShowMapPopup(false);
    setMapPopupData(null);
  };
  const handlePickUpLocationSelect = (displayNameFromDropdown) => {
    const selectedLocObj = pickUpLocationOptions.find(
      (loc) => loc.displayName === displayNameFromDropdown
    );
    if (selectedLocObj) {
      setSelectedPickUpLocationName(selectedLocObj.displayName);
      setActualSelectedPickUp(selectedLocObj);
    } else {
      setSelectedPickUpLocationName("");
      setActualSelectedPickUp(null);
    }
  };
  const handleDropOffLocationSelect = (displayNameFromDropdown) => {
    const selectedLocObj = dropOffLocationOptions.find(
      (loc) => loc.displayName === displayNameFromDropdown
    );
    if (selectedLocObj) {
      setSelectedDropOffLocationName(selectedLocObj.displayName);
      setActualSelectedDropOff(selectedLocObj);
    } else {
      setSelectedDropOffLocationName("");
      setActualSelectedDropOff(null);
    }
  };

  if (!authChecked)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        <p>Authenticating...</p>
      </div>
    );
  if (!customer && authChecked)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        <p>Please log in to continue.</p>
      </div>
    );
  if (detailsLoading)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        <p>Loading Vehicle Details...</p>
      </div>
    );
  if (apiError)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        <p>Error: {apiError}</p>
      </div>
    );
  if (!vehicleDetails)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        <p>No vehicle data found.</p>
      </div>
    );

  return (
    <div className="py-32 md:py-8 lg:flex-row flex-col bg-[#FAF9FE] md:px-16 p-4 gap-10 flex">
      <PopupNotification
        message={popup.message}
        type={popup.type}
        visible={popup.visible}
        onClose={() => setPopup({ ...popup, visible: false })}
      />
      <div className="flex flex-col lg:w-3/4">
        <div className="flex md:flex-row flex-col gap-10 md:mt-24">
          {/* Left Side - Car Info (Unchanged) */}
          <div className="p-6 bg-white md:w-1/2 h-fit shadow-lg rounded-lg">
            <div className="flex px-2 flex-col">
              <button
                onClick={() => navigate(-1)}
                className="mb-4 flex self-start text-black text-base font-normal items-center cursor-pointer"
              >
                <span className="mr-6">
                  <FaArrowLeft className="text-gray-700" size={12} />
                </span>{" "}
                Car Details
              </button>
            </div>
            <h1 className="text-lg font-semibold px-2 mb-4 mt-2">
              {vehicleDetails.make} {vehicleDetails.model}
            </h1>
            {imageLoading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={250}
                className="rounded-lg mb-4"
              />
            ) : (
              <img
                src={selectedImageForDisplay}
                alt={`${vehicleDetails.make} ${vehicleDetails.model}`}
                className="w-full h-auto max-h-[300px] object-contain rounded-lg mb-4 cursor-pointer"
                onClick={() =>
                  vehicleImages.length > 0 &&
                  openFullScreen(
                    vehicleImages.indexOf(selectedImageForDisplay) !== -1
                      ? vehicleImages.indexOf(selectedImageForDisplay)
                      : 0
                  )
                }
              />
            )}
            <div className="flex justify-start space-x-2 items-center mt-6 overflow-x-auto pb-2">
              {vehicleImages.map((thumb, index) => (
                <img
                  key={index}
                  src={thumb}
                  alt={`Thumb ${index + 1}`}
                  onClick={() => setSelectedImageForDisplay(thumb)}
                  className={`w-20 h-20 object-cover cursor-pointer rounded-lg border-2 ${
                    selectedImageForDisplay === thumb
                      ? "border-blue-500"
                      : "border-transparent hover:border-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="flex mt-4">
              <div className="flex justify-between w-full items-center px-2 py-4 my-2 text-gray-700 text-base">
                <div className="flex items-center space-x-2">
                  <FaGasPump size={16} /> <span>{vehicleDetails.fuelType}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCogs size={16} />
                  <span>{vehicleDetails.transmission}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaUserFriends size={16} />
                  <span>{vehicleDetails.seats} People</span>
                </div>
              </div>
            </div>
          </div>
          {/* Center Content - Specs, Locations, Reviews */}
          <div className="bg-white w-full h-fit flex flex-col shadow-lg rounded-lg">
            <div className="bg-blue-100 w-11/12 mx-auto text-blue-700 py-3 px-4 rounded-lg text-center mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold">Price Per Day</h3>
                <span className="text-base font-bold">{dailyPrice} Birr</span>
              </div>
            </div>
            <div className="p-6 md:p-10 pt-6 w-full">
              {/* Car Specification, Features, Pick-up/Drop-off Locations, Ratings (Unchanged in structure/style) */}
              <h4 className="mt-6 text-lg font-semibold">Car Specification</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 text-base gap-4 mt-4">
                <div>
                  <span className="font-medium">Brand</span>
                  <p className="text-gray-500">{vehicleDetails.make}</p>
                </div>
                <div>
                  <span className="font-medium">Model</span>
                  <p className="text-gray-500">{vehicleDetails.model}</p>
                </div>
                <div>
                  <span className="font-medium">Category</span>
                  <p className="text-gray-500">{vehicleDetails.category}</p>
                </div>
                <div>
                  <span className="font-medium">Year</span>
                  <p className="text-gray-500">{vehicleDetails.year}</p>
                </div>
                <div>
                  <span className="font-medium">Mileage</span>
                  <p className="text-gray-500">
                    {vehicleDetails.mileage || "N/A"}
                  </p>
                </div>
              </div>
              <section className="my-8">
                <h2 className="font-semibold text-lg mb-4">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {vehicleDetails.carFeatures?.length > 0 ? (
                    vehicleDetails.carFeatures.map((f, i) => (
                      <span
                        key={i}
                        className="border border-gray-300 text-sm px-3 py-1 rounded-full bg-gray-50"
                      >
                        {f}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No features listed.</p>
                  )}
                </div>
              </section>
              <section className="my-8">
                <h2 className="font-semibold text-lg mb-4">
                  Pick-up Locations
                </h2>
                <div className="flex flex-wrap gap-2">
                  {pickUpLocationOptions.length > 0 ? (
                    pickUpLocationOptions.map((loc) => (
                      <span
                        key={loc.id}
                        className="flex items-center gap-1 border border-gray-300 text-sm px-3 py-1 rounded-full bg-gray-50 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleViewMap("pickup", loc)}
                      >
                        {" "}
                        <FaMapMarkerAlt
                          className="text-gray-500"
                          size={12}
                        />{" "}
                        {loc.displayName}{" "}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No pick-up locations specified.
                    </p>
                  )}
                </div>
              </section>
              <section className="my-8">
                <h2 className="font-semibold text-lg mb-4">
                  Drop-off Locations
                </h2>
                <div className="flex flex-wrap gap-2">
                  {dropOffLocationOptions.length > 0 ? (
                    dropOffLocationOptions.map((loc) => (
                      <span
                        key={loc.id}
                        className="flex items-center gap-1 border border-gray-300 text-sm px-3 py-1 rounded-full bg-gray-50 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleViewMap("dropoff", loc)}
                      >
                        {" "}
                        <FaMapMarkerAlt
                          className="text-gray-500"
                          size={12}
                        />{" "}
                        {loc.displayName}{" "}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No drop-off locations specified.
                    </p>
                  )}
                </div>
              </section>

              {/* MODIFIED SECTION: Unavailability Dates */}
              <section className="my-8">
                <h2 className="font-semibold text-lg mb-4">
                  Unavailable Dates
                </h2>
                {vehicleDetails &&
                vehicleDetails.unavailableDates &&
                vehicleDetails.unavailableDates.length > 0 ? (
                  <div className="space-y-2">
                    {vehicleDetails.unavailableDates.map((isoDateString, i) => (
                      <div
                        key={`unavailable-${i}`}
                        className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md"
                      >
                        <FaCalendarAlt className="text-red-600" size={16} />
                        <span className="text-sm text-red-700">
                          {formatDateInternal(isoDateString)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    This vehicle has no specific unavailable dates marked.
                    Please check the calendar when selecting your rental period.
                  </p>
                )}
              </section>
              {/* END MODIFIED SECTION */}

              <section className="my-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Rating & Reviews
                </h3>
                <div className="flex items-center mb-4">
                  <div className="text-yellow-500 text-xl flex">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < Math.round(averageRating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                  </div>
                  <span className="ml-2 text-gray-600 text-sm">
                    (
                    {averageRating > 0
                      ? averageRating.toFixed(1)
                      : "No ratings"}
                    )
                  </span>
                </div>
                {ratings.length > 0 ? (
                  ratings.map((r, i) => (
                    <div
                      key={i}
                      className="mb-3 p-3 border rounded-md bg-gray-50"
                    >
                      <div className="flex items-center mb-1">
                        <div className="text-yellow-400 text-sm flex">
                          {Array(5)
                            .fill(0)
                            .map((_, j) => (
                              <FaStar
                                key={j}
                                className={j < r.rating ? "" : "text-gray-300"}
                              />
                            ))}
                        </div>
                        <p className="ml-2 text-xs text-gray-500">
                          {r.userName || "Anonymous"}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700">{r.review}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No reviews yet.</p>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
      {/* Right Column - Booking Panel (DatePicker filterDate prop uses the updated isDaySelectable) */}
      <div className="flex flex-col lg:w-1/4">
        <section className="bg-white p-6 md:mt-24 mb-8 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-[#00113D] mb-6">
            Pick Up and Drop Off
          </h2>
          <div className="mb-4">
            <label
              htmlFor="pickup-date-input"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pick-up Date
            </label>
            <DatePicker
              id="pickup-date-input"
              selected={currentPickUpDate}
              onChange={handlePickUpDateChange}
              selectsStart
              startDate={currentPickUpDate}
              endDate={currentDropOffDate}
              minDate={new Date()}
              filterDate={isDaySelectable} // This will now use the new logic
              placeholderText="Select pick-up date"
              dateFormat="MMMM d, yyyy"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              wrapperClassName="w-full"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="dropoff-date-input"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Drop-off Date
            </label>
            <DatePicker
              id="dropoff-date-input"
              selected={currentDropOffDate}
              onChange={handleDropOffDateChange}
              selectsEnd
              startDate={currentPickUpDate}
              endDate={currentDropOffDate}
              minDate={
                currentPickUpDate
                  ? new Date(
                      new Date(currentPickUpDate).setDate(
                        currentPickUpDate.getDate()
                      )
                    )
                  : new Date()
              }
              filterDate={isDaySelectable} // This will now use the new logic
              disabled={!currentPickUpDate}
              placeholderText="Select drop-off date"
              dateFormat="MMMM d, yyyy"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              wrapperClassName="w-full"
            />
          </div>
          {dateError && (
            <p className="text-red-500 text-xs mb-4 -mt-2">{dateError}</p>
          )}
          <div className="flex flex-col text-sm text-[#5A5A5A] mb-6">
            <div className="flex items-start gap-2">
              <div>
                <p className="flex items-center">
                  <FaRegCircle className="text-gray-600 mt-0.5" />
                  <span className="px-4 text-black">
                    Pick-up Date:{" "}
                    {formatDateForDisplayInternal(currentPickUpDate)}
                  </span>
                </p>
                <div className="ml-[7px] mt-1 pl-5 border-l border-gray-300 pb-3">
                  <div className="font-semibold mt-1">
                    {selectedPickUpLocationName ? (
                      <span className="text-green-600">
                        {selectedPickUpLocationName}
                      </span>
                    ) : (
                      <span className="text-red-500 italic">
                        Please Select a location
                      </span>
                    )}
                    {actualSelectedPickUp &&
                      actualSelectedPickUp.originalCoords && (
                        <>
                          {" "}
                          <br />{" "}
                          <button
                            onClick={() =>
                              handleViewMap("pickup", actualSelectedPickUp)
                            }
                            className="text-blue-500 underline hover:text-blue-700 cursor-pointer text-xs"
                          >
                            View On Map
                          </button>{" "}
                        </>
                      )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 mt-0">
              <div>
                <p className="flex items-center">
                  <FaRegCircle className="text-gray-600 mt-0.5" />
                  <span className="px-4 text-black">
                    Drop-off Date:{" "}
                    {formatDateForDisplayInternal(currentDropOffDate)}
                  </span>
                </p>
                <div className="ml-[7px] mt-1 pl-5 pb-3">
                  <div className="font-semibold mt-1">
                    {selectedDropOffLocationName ? (
                      <span className="text-green-600">
                        {selectedDropOffLocationName}
                      </span>
                    ) : (
                      <span className="text-red-500 italic">
                        Please Select a location
                      </span>
                    )}
                    {actualSelectedDropOff &&
                      actualSelectedDropOff.originalCoords && (
                        <>
                          {" "}
                          <br />{" "}
                          <button
                            onClick={() =>
                              handleViewMap("dropoff", actualSelectedDropOff)
                            }
                            className="text-blue-500 underline hover:text-blue-700 cursor-pointer text-xs"
                          >
                            View On Map
                          </button>{" "}
                        </>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mb-4">
            <Dropdown
              label="Select Pick up location"
              options={pickUpLocationOptions.map((loc) => loc.displayName)}
              selectedOption={selectedPickUpLocationName}
              onSelect={handlePickUpLocationSelect}
              placeholder="Choose a pick-up point"
            />
          </div>
          <div className="w-full">
            <Dropdown
              label="Select Drop off location"
              options={dropOffLocationOptions.map((loc) => loc.displayName)}
              selectedOption={selectedDropOffLocationName}
              onSelect={handleDropOffLocationSelect}
              placeholder="Choose a drop-off point"
            />
          </div>
          <div className="p-3 bg-blue-50 text-xs text-blue-700 mt-6 rounded-md">
            Note: Driver selection and other preferences can be set during the
            final booking step if applicable.
          </div>
        </section>
        <PriceBreakdown
          days={days}
          dailyPrice={dailyPrice}
          totalPrice={totalPrice}
          id={vehicleDetails?.id}
          ownerId={vehicleDetails?.ownerId}
          dropOffTime={
            currentDropOffDate ? currentDropOffDate.toISOString() : ""
          }
          pickUpTime={currentPickUpDate ? currentPickUpDate.toISOString() : ""}
          pickUpLocation={actualSelectedPickUp?.originalCoords}
          dropOffLocation={actualSelectedDropOff?.originalCoords}
        />
      </div>
      {showMapPopup && mapPopupData && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">
                {mapPopupData.displayNameForTitle ||
                  (mapPopupData.type === "pickup"
                    ? "Pick Up Location(s)"
                    : "Drop Off Location(s)")}
              </h2>
              <button
                onClick={handleCloseMapPopup}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="flex-1 p-1 overflow-auto">
              <MapComponent vehicles={mapPopupData.vehiclesToShow} />
            </div>
          </div>
        </div>
      )}
      {isFullScreen && vehicleImages.length > 0 && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 z-[110] flex justify-center items-center p-4">
          <button
            onClick={closeFullScreen}
            className="absolute top-5 right-5 text-white text-3xl hover:opacity-75"
          >
            <FaTimes />
          </button>
          <img
            src={vehicleImages[currentImageIndex]}
            alt={`Fullscreen ${currentImageIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
          {vehicleImages.length > 1 && (
            <>
              {" "}
              <button
                onClick={previousImage}
                className="absolute top-1/2 left-5 text-white text-4xl transform -translate-y-1/2 hover:opacity-75"
              >
                <FaChevronLeft />
              </button>{" "}
              <button
                onClick={nextImage}
                className="absolute top-1/2 right-5 text-white text-4xl transform -translate-y-1/2 hover:opacity-75"
              >
                <FaChevronRight />
              </button>{" "}
            </>
          )}
        </div>
      )}
    </div>
  );
}
