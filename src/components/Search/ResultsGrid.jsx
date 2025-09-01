import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { getDownloadUrl, paginatedSearch } from "../../api";
import {
  FaGasPump,
  FaCogs,
  FaUserFriends,
  FaSpinner,
  FaExclamationTriangle,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
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
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [imageLoadStates, setImageLoadStates] = useState({});

  // Fullscreen image viewer state
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [fullScreenVehicleImages, setFullScreenVehicleImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hasAttemptedFetchRef = useRef(false);
  const prevPageRef = useRef(1);
  const topOfGridRef = useRef(null);

  // Track when a Next/Previous click requested a scroll
  const pendingScrollRef = useRef(false);
  const prevLoadingRef = useRef(false);

  const itemsPerPage = 10;
  const placeholderImage = "https://via.placeholder.com/400x225?text=Vehicle";
  const fallbackImage = "/images/cars-big/toyota-box.png";

  const navigate = useNavigate();

  // If you have a sticky header, set its height here (px) so we scroll a bit above the grid
  const HEADER_OFFSET = 0; // e.g. 72

  // --- Scroll helpers -------------------------------------------------------
  const getScrollParent = (node) => {
    if (!node) return window;
    let parent = node.parentElement;
    const overflowRe = /(auto|scroll)/i;

    while (parent && parent !== document.body) {
      const style = getComputedStyle(parent);
      const overflowY = style.overflowY || style.overflow;
      const hasScrollableY =
        overflowRe.test(overflowY) && parent.scrollHeight > parent.clientHeight;

      if (hasScrollableY) return parent;
      parent = parent.parentElement;
    }
    return window;
  };

  const scrollToGridTop = useCallback(() => {
    const target = topOfGridRef.current;
    if (!target) return;

    const container = getScrollParent(target);
    const targetRect = target.getBoundingClientRect();

    if (container === window) {
      const y = Math.max(
        window.pageYOffset + targetRect.top - HEADER_OFFSET,
        0
      );
      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      const containerRect = container.getBoundingClientRect();
      const y =
        targetRect.top -
        containerRect.top +
        container.scrollTop -
        HEADER_OFFSET;
      container.scrollTo({ top: Math.max(y, 0), behavior: "smooth" });
    }
  }, [HEADER_OFFSET]);

  // After loading finishes, if a page change triggered a scroll, do it now
  useEffect(() => {
    const wasLoading = prevLoadingRef.current;
    const nowLoading = isLoadingData;

    if (wasLoading && !nowLoading && pendingScrollRef.current) {
      // Ensure we scroll after the DOM has painted new content
      requestAnimationFrame(() => {
        scrollToGridTop();
        pendingScrollRef.current = false;
      });
    }
    prevLoadingRef.current = nowLoading;
  }, [isLoadingData, scrollToGridTop]);

  // --- Data/image helpers ---------------------------------------------------
  const fetchAndSetIndividualImage = useCallback(
    async (vehicleId, imageKey, isPrimary = true) => {
      if (!imageKey) {
        if (isPrimary)
          setImageLoadStates((prev) => ({ ...prev, [vehicleId]: "error" }));
        return placeholderImage;
      }

      if (isPrimary) {
        setImageLoadStates((prev) => ({ ...prev, [vehicleId]: "loading" }));
      }

      const MAX_RETRIES = 5;
      const INITIAL_DELAY = 1000;

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const pathResult = await getDownloadUrl(imageKey);
          const imageUrl = pathResult?.body;

          if (imageUrl) {
            if (isPrimary) {
              setImageLoadStates((prev) => ({
                ...prev,
                [vehicleId]: "loaded",
              }));
            }
            return imageUrl;
          }
          throw new Error("Image URL not found in API response body.");
        } catch (error) {
          const delay = INITIAL_DELAY * Math.pow(2, attempt - 1);
          console.warn(
            `Attempt ${attempt} failed for image key ${imageKey}. Retrying in ${delay}ms...`,
            error?.message || error
          );

          if (attempt === MAX_RETRIES) {
            console.error(
              `All ${MAX_RETRIES} retries failed for image key ${imageKey} (vehicle ${vehicleId}).`
            );
            if (isPrimary) {
              setImageLoadStates((prev) => ({ ...prev, [vehicleId]: "error" }));
            }
            return fallbackImage;
          }

          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      if (isPrimary) {
        setImageLoadStates((prev) => ({ ...prev, [vehicleId]: "error" }));
      }
      return fallbackImage;
    },
    [fallbackImage, placeholderImage]
  );

  const processVehicles = useCallback(
    async (vehiclesToProcess) => {
      if (!vehiclesToProcess || vehiclesToProcess.length === 0) return [];

      const newImageStatesForPrimary = {};
      vehiclesToProcess.forEach((v) => {
        if (
          v &&
          v.id &&
          imageLoadStates[v.id] !== "loaded" &&
          imageLoadStates[v.id] !== "error"
        ) {
          newImageStatesForPrimary[v.id] = "loading";
        }
      });
      if (Object.keys(newImageStatesForPrimary).length > 0) {
        setImageLoadStates((prev) => ({
          ...prev,
          ...newImageStatesForPrimary,
        }));
      }

      const dataWithImagePromises = vehiclesToProcess.map(async (vehicle) => {
        if (!vehicle || !vehicle.id) {
          return {
            ...vehicle,
            displayImage: placeholderImage,
            allDisplayImages: [placeholderImage],
            id: `ph-${Math.random()}`,
          };
        }

        let allResolvedImages = [];
        if (vehicle.vehicleImageKeys && vehicle.vehicleImageKeys.length > 0) {
          allResolvedImages = await Promise.all(
            vehicle.vehicleImageKeys.map(async (imageKeyObj, index) => {
              const key =
                typeof imageKeyObj === "string"
                  ? imageKeyObj
                  : imageKeyObj?.key;
              return fetchAndSetIndividualImage(vehicle.id, key, index === 0);
            })
          );
        }

        allResolvedImages = allResolvedImages.filter((url) => url);
        if (allResolvedImages.length === 0) {
          allResolvedImages = [placeholderImage];
        }

        return {
          ...vehicle,
          displayImage: allResolvedImages[0],
          allDisplayImages: allResolvedImages,
        };
      });
      return Promise.all(dataWithImagePromises);
    },
    [fetchAndSetIndividualImage, imageLoadStates, placeholderImage]
  );

  const applyProcessedVehicles = useCallback(
    async (vehiclesToProcess) => {
      hasAttemptedFetchRef.current = true;
      setIsLoadingData(true);
      const processed = await processVehicles(vehiclesToProcess);
      setCurrentVehicles(processed.filter((v) => v && v.id));
      setIsLoadingData(false);
    },
    [processVehicles]
  );

  const fetchVehiclesForPageAPI = useCallback(
    async (page, keyForPage) => {
      hasAttemptedFetchRef.current = true;
      setIsLoadingData(true);
      try {
        const data = await paginatedSearch(itemsPerPage, keyForPage);
        if (data && data.Items) {
          const processed = await processVehicles(data.Items);
          setCurrentVehicles(processed);
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
        setIsLoadingData(false);
      }
    },
    [processVehicles]
  );

  // Effect 1: Initial load or filters change
  useEffect(() => {
    hasAttemptedFetchRef.current = false;
    setLastEvaluated(lastEvaluatedKey || null);
    setCurrentPage(1);
    prevPageRef.current = 1;

    if (vehicles && Array.isArray(vehicles)) {
      applyProcessedVehicles(vehicles.slice(0, itemsPerPage));
    } else {
      fetchVehiclesForPageAPI(1, lastEvaluatedKey || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicles, lastEvaluatedKey]);

  // Effect 2: Handle page changes (fetch/update data)
  useEffect(() => {
    if (currentPage === prevPageRef.current) return;

    if (vehicles && Array.isArray(vehicles)) {
      const startIdx = (currentPage - 1) * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      applyProcessedVehicles(vehicles.slice(startIdx, endIdx));
    } else if (!vehicles && currentPage > 1) {
      fetchVehiclesForPageAPI(currentPage, lastEvaluated);
    }

    prevPageRef.current = currentPage;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || isLoadingData || newPage === currentPage) return;
    if (vehicles && Array.isArray(vehicles)) {
      const totalPages = Math.ceil(vehicles.length / itemsPerPage);
      if (newPage > totalPages && totalPages > 0) return;
    }
    if (!vehicles && newPage > currentPage && lastEvaluated === null) {
      if (currentVehicles.length < itemsPerPage && currentPage > 0) return;
    }

    // mark that we should scroll once loading finishes
    pendingScrollRef.current = true;
    setCurrentPage(newPage);
  };

  const handleNavigation = (vehicle) => {
    navigate(`/details2/${vehicle.id}`, { state: { pickUpTime, DropOffTime } });
  };

  const handleImageError = (vehicleId) => {
    setImageLoadStates((prev) => ({ ...prev, [vehicleId]: "error" }));
  };

  const openFullScreenViewer = (vehicleAllImages, startIndex = 0) => {
    if (vehicleAllImages && vehicleAllImages.length > 0) {
      setFullScreenVehicleImages(vehicleAllImages);
      setCurrentImageIndex(startIndex);
      setIsFullScreenOpen(true);
    }
  };

  const closeFullScreenViewer = () => {
    setIsFullScreenOpen(false);
    setFullScreenVehicleImages([]);
    setCurrentImageIndex(0);
  };

  const nextImageInFullScreen = () => {
    if (fullScreenVehicleImages.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev + 1) % fullScreenVehicleImages.length
      );
    }
  };

  const previousImageInFullScreen = () => {
    if (fullScreenVehicleImages.length > 0) {
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + fullScreenVehicleImages.length) %
          fullScreenVehicleImages.length
      );
    }
  };

  if (isLoadingData && currentVehicles.length === 0) {
    return (
      <div className="flex justify-center items-center my-20">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
        <p className="ml-3 text-xl text-black">Loading available cars...</p>
      </div>
    );
  }

  return (
    <div ref={topOfGridRef} className="container mx-auto px-4 py-8">
      {isLoadingData && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white/80 p-4 rounded-lg shadow-xl">
          <FaSpinner className="animate-spin text-3xl text-blue-500" />
        </div>
      )}

      <div className="flex flex-col space-y-6">
        {currentVehicles.length > 0 ? (
          currentVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex flex-col sm:flex-row w-full bg-white rounded-md shadow-md overflow-hidden"
            >
              <div
                className="w-full sm:w-2/5 h-56 flex-shrink-0 bg-gray-200 flex justify-center items-center relative cursor-pointer group"
                onClick={() => openFullScreenViewer(vehicle.allDisplayImages)}
              >
                {imageLoadStates[vehicle.id] === "loading" && (
                  <FaSpinner className="animate-spin text-2xl text-blue-600" />
                )}
                {imageLoadStates[vehicle.id] === "error" && (
                  <div className="flex flex-col items-center text-gray-500">
                    <FaExclamationTriangle size={30} className="mb-2" />
                    <p className="text-sm">Image unavailable</p>
                  </div>
                )}
                {imageLoadStates[vehicle.id] === "loaded" &&
                  vehicle.displayImage && (
                    <img
                      className="w-full h-full object-cover"
                      src={vehicle.displayImage}
                      alt={`${vehicle.make || "Vehicle"} ${
                        vehicle.model || ""
                      }`}
                      onError={() => handleImageError(vehicle.id)}
                    />
                  )}
                {!imageLoadStates[vehicle.id] && (
                  <FaSpinner className="animate-spin text-2xl text-blue-600" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex justify-center items-center">
                  <p className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Images
                  </p>
                </div>
              </div>

              <div
                className="flex w-full sm:w-3/5 flex-col p-5 justify-between text-black cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleNavigation(vehicle)}
              >
                <div>
                  <div className="flex w-full justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl lg:text-2xl font-semibold">
                        {vehicle.make || "N/A"}{" "}
                        <span className="font-medium">
                          {vehicle.model || "N/A"}
                        </span>
                        <span className="font-medium text-gray-500">
                          {" "}
                          ({vehicle.year || "N/A"})
                        </span>
                      </h3>
                      <p className="text-sm mt-1">
                        {vehicle.category || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-2 my-3 text-sm">
                    <div className="flex items-center space-x-1.5">
                      <FaGasPump size={15} className="text-gray-600" />
                      <span>{vehicle.fuelType || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <FaCogs size={15} className="text-gray-600" />
                      <span>{vehicle.transmission || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <FaUserFriends size={16} className="text-gray-600" />
                      <span>{vehicle.seats || "N/A"} Seats</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-200">
                  <div>
                    <p className="text-xs">Daily Price</p>
                    <p className="text-lg lg:text-xl font-semibold">
                      {vehicle.price ? `${vehicle.price} Birr` : "N/A"}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigation(vehicle);
                    }}
                    className="bg-blue-950 hover:bg-blue-800 transition-colors text-white rounded-full px-6 py-2.5 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : !isLoadingData && hasAttemptedFetchRef.current ? (
          <div className="w-full text-center py-10 text-black text-lg">
            No vehicles found for your selection. Adjust your search criteria.
          </div>
        ) : null}
      </div>

      {((!vehicles &&
        (lastEvaluated !== null ||
          (currentPage > 1 && currentVehicles.length > 0))) ||
        (vehicles && vehicles.length > itemsPerPage)) &&
        currentVehicles.length > 0 && (
          <div className="flex text-base font-normal justify-center mt-10 items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoadingData}
              className={`px-4 py-2 mx-2 rounded-lg transition-colors ${
                currentPage === 1 || isLoadingData
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
                isLoadingData ||
                (vehicles && currentPage * itemsPerPage >= vehicles.length) ||
                (!vehicles &&
                  lastEvaluated === null &&
                  currentVehicles.length < itemsPerPage &&
                  currentPage > 0)
              }
              className={`px-4 py-2 mx-2 rounded-lg transition-colors ${
                isLoadingData ||
                (vehicles && currentPage * itemsPerPage >= vehicles.length) ||
                (!vehicles &&
                  lastEvaluated === null &&
                  currentVehicles.length < itemsPerPage &&
                  currentPage > 0)
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Next
            </button>
          </div>
        )}

      {isFullScreenOpen && fullScreenVehicleImages.length > 0 && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 z-[110] flex justify-center items-center p-4">
          <button
            onClick={closeFullScreenViewer}
            className="absolute top-5 right-5 text-white text-3xl hover:opacity-75"
            aria-label="Close fullscreen image viewer"
          >
            <FaTimes />
          </button>
          <img
            src={fullScreenVehicleImages[currentImageIndex]}
            alt={`Fullscreen vehicle image ${currentImageIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
          {fullScreenVehicleImages.length > 1 && (
            <>
              <button
                onClick={previousImageInFullScreen}
                className="absolute top-1/2 left-5 text-white text-4xl transform -translate-y-1/2 hover:opacity-75"
                aria-label="Previous image"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextImageInFullScreen}
                className="absolute top-1/2 right-5 text-white text-4xl transform -translate-y-1/2 hover:opacity-75"
                aria-label="Next image"
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsGrid;
