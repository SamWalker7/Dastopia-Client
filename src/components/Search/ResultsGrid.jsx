import React, { useEffect, useState } from "react";
import { getDownloadUrl, paginatedSearch } from "../../api";
import { FaGasPump, FaCogs, FaUserFriends, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ResultsGrid = ({
  vehicles,
  pickUpTime,
  DropOffTime,
  lastEvaluatedKey,
}) => {
  const [currentVehicles, setCurrentVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastEvaluated, setLastEvaluated] = useState(lastEvaluatedKey || null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoadStates, setImageLoadStates] = useState({});

  const itemsPerPage = 10;
  const placeholderImage = "https://via.placeholder.com/400x225?text=Vehicle"; // Adjusted aspect ratio
  // Ensure this path is correct relative to your public folder or how assets are served
  const fallbackImage = "/images/cars-big/toyota-box.png"; // Replace with your actual fallback image path

  const navigate = useNavigate();

  const processAndSetVehicles = async (vehiclesToProcess) => {
    if (!vehiclesToProcess || vehiclesToProcess.length === 0) {
      setCurrentVehicles([]);
      return;
    }

    const initialImageStates = {};
    vehiclesToProcess.forEach((v) => {
      if (v.id) initialImageStates[v.id] = true;
    });
    setImageLoadStates((prev) => ({ ...prev, ...initialImageStates }));

    const dataWithImages = await Promise.all(
      vehiclesToProcess.map(async (vehicle) => {
        if (!vehicle || !vehicle.id)
          return { ...vehicle, images: [placeholderImage] };

        let urls = [];
        if (
          vehicle.vehicleImageKeys &&
          Array.isArray(vehicle.vehicleImageKeys) &&
          vehicle.vehicleImageKeys.length > 0
        ) {
          const firstImageKeyObj = vehicle.vehicleImageKeys[0];
          const keyToFetch =
            typeof firstImageKeyObj === "string"
              ? firstImageKeyObj
              : firstImageKeyObj?.key;

          if (keyToFetch) {
            try {
              const path = await getDownloadUrl(keyToFetch);
              urls.push(path?.body || placeholderImage);
            } catch (error) {
              console.error(
                `Error fetching image for key ${keyToFetch} in vehicle ${vehicle.id}:`,
                error
              );
              urls.push(placeholderImage);
            }
          } else {
            urls.push(placeholderImage);
          }
        } else {
          urls.push(placeholderImage);
        }
        setImageLoadStates((prev) => ({ ...prev, [vehicle.id]: false }));
        return { ...vehicle, images: urls };
      })
    );
    setCurrentVehicles(dataWithImages.filter((v) => v && v.id));
  };

  const fetchVehiclesForPage = async (page, keyForPage) => {
    setIsLoading(true);
    try {
      const data = await paginatedSearch(itemsPerPage, keyForPage);
      if (data && data.Items) {
        await processAndSetVehicles(data.Items);
        setLastEvaluated(data.LastEvaluatedKey || null);
      } else {
        setCurrentVehicles([]);
        setLastEvaluated(null);
      }
    } catch (error) {
      console.error("Error fetching paginated data:", error);
      setCurrentVehicles([]);
      setLastEvaluated(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setLastEvaluated(lastEvaluatedKey || null);
    setImageLoadStates({}); // Reset image loading states

    if (vehicles && Array.isArray(vehicles) && vehicles.length > 0) {
      setIsLoading(true);
      processAndSetVehicles(vehicles.slice(0, itemsPerPage)).finally(() =>
        setIsLoading(false)
      );
    } else if (!vehicles && !lastEvaluatedKey) {
      fetchVehiclesForPage(1, null);
    } else if (!vehicles && lastEvaluatedKey) {
      fetchVehiclesForPage(1, lastEvaluatedKey);
    } else {
      setCurrentVehicles([]);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicles, lastEvaluatedKey]);

  useEffect(() => {
    if (!vehicles) {
      // API-based pagination
      if (currentPage === 1 && !lastEvaluatedKey) {
        // Fetch initial page 1 if no prop key
        // This case is largely handled by the first useEffect.
        // This ensures if page somehow gets to 1 and it wasn't an initial load.
        // fetchVehiclesForPage(1, null);
      } else if (currentPage > 1) {
        fetchVehiclesForPage(currentPage, lastEvaluated);
      }
    } else {
      // Client-side pagination
      const startIdx = (currentPage - 1) * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      setIsLoading(true);
      processAndSetVehicles(vehicles.slice(startIdx, endIdx)).finally(() =>
        setIsLoading(false)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || isLoading) return;
    if (vehicles && vehicles.length > 0) {
      const totalPages = Math.ceil(vehicles.length / itemsPerPage);
      if (newPage > totalPages && totalPages > 0) return;
    }
    setCurrentPage(newPage);
  };

  const handleNavigation = (vehicle) => {
    navigate(`/details2/${vehicle.id}`, {
      state: {
        pickUpTime: pickUpTime,
        DropOffTime: DropOffTime,
      },
    });
  };

  if (isLoading && currentVehicles.length === 0) {
    return (
      <div className="flex justify-center items-center my-20">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
        <p className="ml-3 text-xl text-black">Loading available cars...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading && currentVehicles.length > 0 && (
        <div className="flex justify-center items-center my-8">
          <FaSpinner className="animate-spin text-3xl text-blue-500" />
        </div>
      )}

      <div className="flex flex-col space-y-6">
        {Array.isArray(currentVehicles) && currentVehicles.length > 0
          ? currentVehicles.map((vehicle, index) => (
              <div
                key={vehicle.id || index}
                className="flex flex-col sm:flex-row w-full bg-white rounded-md shadow-md overflow-hidden"
              >
                {/* Fixed Height Image Container */}
                <div className="w-full sm:w-2/5 h-56 flex-shrink-0 bg-gray-100">
                  {imageLoadStates[vehicle.id] ||
                  !vehicle.images ||
                  vehicle.images.length === 0 ? ( // Show spinner if loading or no images yet
                    <div className="w-full h-full flex justify-center items-center">
                      <FaSpinner className="animate-spin text-2xl text-blue-600" />
                    </div>
                  ) : (
                    <img
                      className="w-full h-full object-cover"
                      src={vehicle.images[0]} // Assumes images[0] is set by processAndSetVehicles
                      alt={`${vehicle.make || "Vehicle"} ${
                        vehicle.model || ""
                      }`}
                      onError={(e) => {
                        e.target.src = fallbackImage;
                      }}
                    />
                  )}
                </div>

                {/* Content Area - All text will default to black or inherit black */}
                <div className="flex w-full sm:w-3/5 flex-col p-5 justify-between text-black">
                  <div>
                    <div className="flex w-full justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl lg:text-2xl font-semibold">
                          {vehicle.make || "N/A"}{" "}
                          <span className="font-medium">
                            {vehicle.model || "N/A"}
                          </span>
                        </h3>
                        <p className="text-sm mt-1">
                          {vehicle.category || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-2 my-3 text-sm">
                      <div className="flex items-center space-x-1.5">
                        <FaGasPump size={15} className="text-gray-600" />{" "}
                        {/* Icon color can be distinct */}
                        <span>{vehicle.fuelType || "N/A"}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <FaCogs size={15} className="text-gray-600" />{" "}
                        {/* Icon color can be distinct */}
                        <span>{vehicle.transmission || "N/A"}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <FaUserFriends size={16} className="text-gray-600" />{" "}
                        {/* Icon color can be distinct */}
                        <span>{vehicle.seats || "N/A"} Seats</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs">Total Price</p>
                      <p className="text-lg lg:text-xl font-semibold">
                        {vehicle.price ? `${vehicle.price} Birr` : "N/A"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleNavigation(vehicle)}
                      className="bg-blue-950 hover:bg-blue-800 transition-colors text-white rounded-full px-6 py-2.5 text-sm font-medium"
                    >
                      Rent Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          : !isLoading && (
              <div className="w-full text-center py-10 text-black text-lg">
                No vehicles found matching your criteria.
              </div>
            )}
      </div>

      {/* Pagination Controls - Show if meaningful */}
      {((!vehicles && (lastEvaluated !== null || currentPage > 1)) ||
        (vehicles && vehicles.length > itemsPerPage)) &&
        currentVehicles.length > 0 && (
          <div className="flex text-base font-normal justify-center mt-10 items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className={`px-4 py-2 mx-2 rounded-lg transition-colors ${
                currentPage === 1 || isLoading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Previous
            </button>

            <span className="px-4 py-2 mx-2 text-black">
              Page {currentPage}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                isLoading ||
                (vehicles &&
                  vehicles.length > 0 &&
                  currentPage * itemsPerPage >= vehicles.length) ||
                (!vehicles && lastEvaluated === null)
              }
              className={`px-4 py-2 mx-2 rounded-lg transition-colors ${
                isLoading ||
                (vehicles &&
                  vehicles.length > 0 &&
                  currentPage * itemsPerPage >= vehicles.length) ||
                (!vehicles && lastEvaluated === null)
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Next
            </button>
          </div>
        )}
    </div>
  );
};

export default ResultsGrid;
