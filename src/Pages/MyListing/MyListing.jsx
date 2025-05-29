import React, { useEffect, useState } from "react";
import { getDownloadUrl } from "../../api";
import { FaGasPump, FaCogs, FaUserFriends, FaSpinner } from "react-icons/fa";
import audia1 from "../../images/cars-big/toyota-box.png"; // Default/fallback image
import Details from "./Details";

const MyListing = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [vehicleImages, setVehicleImages] = useState({});
  const [loadingImages, setLoadingImages] = useState(true);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const customer = JSON.parse(localStorage.getItem("customer"));
  const placeholderImage = "https://via.placeholder.com/300"; // A generic placeholder

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoadingVehicles(true);
      try {
        const response = await fetch(
          "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/owner_car",
          {
            headers: {
              Authorization: `Bearer ${customer.AccessToken}`,
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          let vehiclesData = data.body?.Items || [];

          // Sort vehicles: newest first
          // Assuming 'createdAt' is a timestamp field on your vehicle object.
          // If it's an ISO string (e.g., "2023-10-27T10:30:00.000Z"):
          vehiclesData.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0); // Fallback for missing/invalid dates
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB - dateA; // For descending order (newest first)
          });
          // If 'createdAt' is a Unix timestamp (number, e.g., 1698402600000):
          // vehiclesData.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

          setVehicles(vehiclesData);
          // It's good practice to pass the (potentially sorted) data to fetchVehicleImages
          // if its logic depends on the order, though in your current implementation
          // fetchVehicleImages builds an object keyed by id, so order might not strictly matter there.
          await fetchVehicleImages(vehiclesData);
        } else {
          console.error("Failed to fetch vehicles", data.body?.message);
          setVehicles([]); // Ensure vehicles is an empty array on failure
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setVehicles([]); // Ensure vehicles is an empty array on error
      } finally {
        setLoadingVehicles(false);
      }
    };

    const fetchVehicleImages = async (vehiclesData) => {
      // setLoadingImages(true); // Already true at the start of useEffect or when vehicles are fetched
      // Let's assume images load in parallel with vehicle details or slightly after
      // If you want a separate loading spinner just for images for each card, that's more complex.
      // The current global loadingImages state might be sufficient.

      if (!vehiclesData || vehiclesData.length === 0) {
        setLoadingImages(false);
        return;
      }
      setLoadingImages(true); // Set loading true before starting image fetch for these vehicles
      try {
        const imageUrls = {};
        // Create a map of promises
        const imagePromises = vehiclesData.map(async (vehicle) => {
          if (vehicle.vehicleImageKeys && vehicle.vehicleImageKeys.length > 0) {
            const fetchedUrls = await Promise.all(
              vehicle.vehicleImageKeys.map(async (imageKey) => {
                try {
                  const path = await getDownloadUrl(imageKey);
                  return path?.body || null;
                } catch (error) {
                  console.error(
                    `Error in getDownloadUrl for key ${imageKey} in vehicle ${vehicle.id}:`,
                    error
                  );
                  return null; // Return null on error for this specific image
                }
              })
            );
            imageUrls[vehicle.id] = fetchedUrls.filter((url) => url !== null);
            if (imageUrls[vehicle.id].length === 0) {
              imageUrls[vehicle.id] = [placeholderImage]; // Fallback if all image fetches fail
            }
          } else {
            imageUrls[vehicle.id] = [placeholderImage]; // Use generic placeholder if no keys
          }
        });

        await Promise.all(imagePromises); // Wait for all vehicle image groups to be processed
        setVehicleImages(imageUrls);
      } catch (error) {
        console.error("Error fetching vehicle images:", error);
        // Potentially set a default error image for all if the whole process fails
      } finally {
        setLoadingImages(false);
      }
    };

    if (customer?.AccessToken) {
      // Only fetch if customer and token exist
      fetchVehicles();
    } else {
      console.log("No customer token found. Cannot fetch vehicles.");
      setLoadingVehicles(false);
      setLoadingImages(false);
      setVehicles([]);
    }
  }, [customer?.AccessToken]); // Re-run if customer.AccessToken changes (e.g., on login/logout)

  const handleSeeDetails = (vehicleId) => {
    setLoadingDetails(true); // Start loading indicator for details
    setSelectedVehicleId(vehicleId);
    // Simulate loading time or actual async operation for details if needed
    setTimeout(() => {
      setLoadingDetails(false); // Stop loading indicator for details
    }, 300); // Adjust timeout as needed, or remove if Details component has its own loading
  };

  // Main loading state: true if vehicles are loading OR images are still loading for the initial set
  const isPageLoading =
    loadingVehicles ||
    (vehicles.length > 0 &&
      loadingImages &&
      Object.keys(vehicleImages).length < vehicles.length);

  if (loadingVehicles) {
    // Initial loading state for the whole vehicle list
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#FAF9FE]">
        <FaSpinner className="animate-spin text-4xl text-[#00173C]" />
        <p className="ml-3 text-xl">Loading your listings...</p>
      </div>
    );
  }

  return (
    <div className="flex lg:flex-row flex-col gap-10 py-10 bg-[#FAF9FE] md:px-20 md:pt-40">
      <div className="p-6 bg-white lg:w-2/4 w-full shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold my-4">My Listings</h1>{" "}
        {/* Adjusted margin */}
        <div className="flex flex-col">
          {" "}
          {/* Changed to flex-col for consistent item flow */}
          {vehicles.length > 0 ? (
            vehicles.map((vehicle, index) => (
              <div
                key={vehicle.id || index} // Prefer vehicle.id if available and unique
                className="flex flex-col sm:flex-row w-full h-fit my-4 bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="w-full sm:w-2/5 h-48 sm:h-auto flex-shrink-0 mx-auto sm:mx-4 my-4 rounded-2xl">
                  {loadingImages && !vehicleImages[vehicle.id] ? ( // Show spinner if images are globally loading AND this specific vehicle's image isn't ready
                    <div className="w-full h-full flex justify-center items-center bg-gray-200 rounded-2xl">
                      <FaSpinner className="animate-spin text-2xl text-[#00173C]" />
                    </div>
                  ) : (
                    <img
                      className="w-full h-full rounded-2xl object-cover" // ensure object-cover
                      src={vehicleImages[vehicle.id]?.[0] || audia1} // Use audia1 as a more specific fallback
                      alt={`${vehicle.make || "Vehicle"} ${
                        vehicle.model || ""
                      }`}
                      onError={(e) => {
                        e.target.src = audia1;
                      }} // Fallback on image load error
                    />
                  )}
                </div>
                <div className="flex w-full sm:w-3/5 flex-col p-4">
                  {" "}
                  {/* Added padding for content */}
                  <div className="flex w-full justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {vehicle.make || "N/A"}{" "}
                        <span className="font-medium">
                          {" "}
                          {/* Slightly less emphasis for model */}
                          {vehicle.model || "N/A"}
                        </span>
                      </h3>
                      <p className="text-sm mt-1 text-gray-500">
                        {vehicle.category || "N/A"}
                      </p>
                    </div>
                    <div
                      className={`w-fit text-white rounded-full px-3 py-1 text-xs font-normal whitespace-nowrap ${
                        // Adjusted padding
                        vehicle.isActive === "Active" ||
                        vehicle.isActive === "active"
                          ? "bg-green-500" // Changed to green for active
                          : vehicle.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-red-600" // For inactive or other statuses
                      }`}
                    >
                      {vehicle.isActive || "N/A"}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-2 my-4 text-gray-600 text-sm">
                    <div className="flex items-center space-x-1">
                      <FaGasPump size={14} className="text-[#00173C]" />
                      <span>{vehicle.fuelType || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaCogs size={14} className="text-[#00173C]" />
                      <span>{vehicle.transmission || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaUserFriends size={15} className="text-[#00173C]" />
                      <span>{vehicle.seats || "N/A"} People</span>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-between items-center">
                    {" "}
                    {/* Pushes to bottom */}
                    <div>
                      <p className="text-xs text-gray-500">Daily Rent</p>
                      <p className="text-lg font-semibold text-[#00173C]">
                        {vehicle.price ? `${vehicle.price} Birr` : "N/A"}
                      </p>
                    </div>
                    <button
                      className="bg-[#00173C] hover:bg-blue-800 transition-colors text-white rounded-full px-5 py-2.5 text-xs font-medium"
                      onClick={() => handleSeeDetails(vehicle.id)}
                      disabled={
                        loadingDetails && selectedVehicleId === vehicle.id
                      }
                    >
                      {loadingDetails && selectedVehicleId === vehicle.id ? (
                        <FaSpinner className="animate-spin mx-auto" />
                      ) : (
                        "See Details"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">
                You have no vehicles listed yet.
              </p>
              {/* Optionally, add a button/link to add a new vehicle */}
            </div>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div
        className={`lg:w-2/4 w-full transition-opacity duration-300 ease-in-out ${
          loadingDetails ? "opacity-50" : "opacity-100"
        }`}
      >
        {selectedVehicleId ? (
          loadingDetails ? (
            <div className="flex justify-center items-center h-64 bg-white shadow-lg rounded-lg p-6">
              <FaSpinner className="animate-spin text-3xl text-[#00173C]" />
              <p className="ml-2">Loading details...</p>
            </div>
          ) : (
            <Details selectedVehicleId={selectedVehicleId} />
          )
        ) : (
          <div className="flex justify-center items-center h-64 bg-white shadow-lg rounded-lg p-6">
            <p className="text-gray-500">
              Select a vehicle to see its details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListing;
