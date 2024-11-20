import React, { useEffect, useState } from "react";
import { getDownloadUrl, paginatedSearch } from "../../api";
import { FaStar, FaGasPump, FaCogs, FaUserFriends } from "react-icons/fa";
import { GoHeart } from "react-icons/go";

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
  const itemsPerPage = 4;
  const placeholderImage = "https://via.placeholder.com/300";

  const fetchPagination = async (page) => {
    setIsLoading(true);

    if (vehicles && vehicles.length > 0) {
      const startIdx = (page - 1) * itemsPerPage;
      const paginatedData = vehicles.slice(startIdx, startIdx + itemsPerPage);

      const dataWithImages = await Promise.all(
        paginatedData.map(async (vehicle) => {
          let urls = [];
          for (let image of vehicle.vehicleImageKeys) {
            try {
              const path = await getDownloadUrl(image.key);
              urls.push(path.body || placeholderImage);
            } catch {
              urls.push(placeholderImage);
            }
          }
          return { ...vehicle, images: urls, imageLoading: false };
        })
      );

      setCurrentVehicles(dataWithImages);
      setIsLoading(false);
    } else {
      try {
        const data = await paginatedSearch(itemsPerPage, lastEvaluated);
        if (data && data.Items) {
          const dataWithImages = await Promise.all(
            data.Items.map(async (vehicle) => {
              let urls = [];
              for (let image of vehicle.vehicleImageKeys) {
                try {
                  const path = await getDownloadUrl(image.key);
                  urls.push(path.body || placeholderImage);
                } catch {
                  urls.push(placeholderImage);
                }
              }
              return { ...vehicle, images: urls, imageLoading: false };
            })
          );

          setCurrentVehicles(dataWithImages);
          setLastEvaluated(data.LastEvaluatedKey || null);
        } else {
          setCurrentVehicles([]);
        }
      } catch (error) {
        console.error("Error fetching paginated data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchPagination(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {isLoading && (
        <div className="flex justify-center items-center my-8">
          <div className="w-12 h-12 border-4 border-blue-400 border-solid border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!isLoading && (
        <div className="flex flex-wrap justify-between">
          {currentVehicles.map((vehicle, index) => (
            <div
              key={index}
              className="max-w-xs w-full h-fit my-4 bg-white rounded-xl shadow-md overflow-hidden"
              style={{ minWidth: "275px" }}
            >
              <div className="px-6 py-8 w-full justify-between flex">
                <div>
                  <h3 className="text-2xl font-semibold">
                    {vehicle.make || "Unknown"}{" "}
                    <span className="text-gray-400">
                      {vehicle.model || "Unknown"}
                    </span>
                  </h3>
                  <p className="text-xl font-extralight text-gray-400">
                    {vehicle.category || "Unknown"}
                  </p>
                </div>
                <div className="flex justify-end p-2">
                  <GoHeart />
                </div>
              </div>

              {/* Car Image */}
              <div className="">
                <img
                  className="w-full h-72 object-cover"
                  src={vehicle.images[0] || placeholderImage}
                  alt={`Vehicle ${index}`}
                />
              </div>

              <div className="flex justify-between items-center px-6 py-4 my-2 text-gray-400 text-base">
                <div className="flex items-center space-x-2">
                  <FaGasPump size={12} />
                  <span>{vehicle.fuelType || "Unknown"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCogs size={12} />
                  <span>{vehicle.transmission || "Unknown"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaUserFriends size={13} />
                  <span>{vehicle.seats || "Unknown"} People</span>
                </div>
              </div>

              <div className="flex justify-between items-center px-6 pb-4">
                <div>
                  <p className="text-sm text-gray-400">Total Price</p>
                  <p className="text-xl font-semibold">1,490 Birr</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Daily Rent</p>
                  <p className="text-xl font-semibold">190 Birr</p>
                </div>
              </div>

              <div className="flex justify-between items-center px-6 py-4 ">
                <div className="flex items-center mr-8 ">
                  <FaStar className="text-yellow-400" />
                  <span className="text-xl font-medium">4.5</span>
                </div>
                <button className="bg-sky-950 w-full text-white rounded-full px-4 py-3 text-base font-normal">
                  Rent Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex text-base font-normal justify-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className={`px-4 py-2 mx-2 rounded-lg ${
            currentPage === 1 || isLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-400 text-white"
          }`}
        >
          Previous
        </button>

        <span className="px-4 py-2 mx-2 text-gray-700">Page {currentPage}</span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={lastEvaluated === null || isLoading}
          className={`px-4 py-2 mx-2 rounded-lg ${
            lastEvaluated === null || isLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-400 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ResultsGrid;
