import React, { useEffect, useState } from "react";
import { getDownloadUrl, paginatedSearch } from "../../api";
import {
  FaStar,
  FaGasPump,
  FaCogs,
  FaUserFriends,
  FaHeart,
} from "react-icons/fa";
import { GoHeart } from "react-icons/go";

const ResultsGrid = ({ pickUpTime, DropOffTime, lastEvaluatedKey }) => {
  const [vehiclesData, setVehiclesData] = useState([]); // Store fetched pages in state
  const [currentVehicles, setCurrentVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastEvaluated, setLastEvaluated] = useState(lastEvaluatedKey || null);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 4;

  // Fetch new data and store pages in state
  const fetchPagination = async (page) => {
    setIsLoading(true);

    // Check if data for this page already exists
    if (vehiclesData[page - 1]) {
      setCurrentVehicles(vehiclesData[page - 1]);
      setIsLoading(false);
      return;
    }

    // Fetch new page data from API
    const response = await paginatedSearch(itemsPerPage, lastEvaluated);
    if (response && response.statusCode && response.statusCode === 200) {
      setLastEvaluated(response.body.lastEvaluatedKey);

      const data = response.body.items.map((item) => {
        return {
          ...item,
          images: [], // Prepare the images
        };
      });

      // Fetch image URLs for each vehicle
      let fetched = [];
      for (let d of data) {
        let urls = [];
        for (let image of d.vehicleImageKeys) {
          const path = await getDownloadUrl(image.key);
          urls.push(path.body || "https://via.placeholder.com/300");
        }
        fetched.push({
          ...d,
          images: urls,
        });
      }

      // Store the fetched page in vehiclesData array
      const updatedVehiclesData = [...vehiclesData];
      updatedVehiclesData[page - 1] = fetched;
      setVehiclesData(updatedVehiclesData);

      setCurrentVehicles(fetched);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPagination(currentPage); // Fetch vehicles whenever the page changes
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className=" ">
      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex justify-center items-center my-8">
          <div className="w-12 h-12 border-4 border-blue-400 border-solid border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Vehicle Grid */}
      {!isLoading && (
        <div className="flex flex-wrap justify-between ">
          {currentVehicles.map((vehicle, index) => (
            <div
              key={index}
              className="max-w-xs w-full h-fit my-4 bg-white rounded-xl shadow-md   overflow-hidden "
              style={{ minWidth: "275px" }} // Ensuring consistent width and height
            >
              {/* Car Title & Subtitle */}
              <div className="px-6 py-8 w-full justify-between flex">
                {/* Heart Icon */}

                <div>
                  {" "}
                  <h3 className="text-2xl font-semibold">
                    {vehicle.make ? vehicle.make : "Unknown"}{" "}
                    <span className="text-gray-400">
                      {vehicle.model ? vehicle.model : "Unknown"}
                    </span>
                  </h3>
                  <p className="text-xl font-extralight text-gray-400">
                    {vehicle.category ? vehicle.category : "Unknown"}
                  </p>
                </div>
                <div className="flex justify-end p-2">
                  <GoHeart />
                </div>
              </div>

              {/* Car Image */}
              <div className="">
                <img
                  className=" w-full h-72 object-cover" // Set a fixed image size for uniformity
                  src={vehicle.images[0]}
                  alt={`Vehicle ${index}`}
                />
              </div>

              {/* Car Features */}
              <div className="flex justify-between items-center px-6 py-4 my-2 text-gray-400 text-base">
                <div className="flex items-center space-x-2">
                  <FaGasPump size={12} />
                  <span>{vehicle.fuelType ? vehicle.fuelType : "Unknown"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCogs size={12} />
                  <span>
                    {vehicle.transmission ? vehicle.transmission : "Unknown"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaUserFriends size={13} />
                  <span>
                    {vehicle.seats ? vehicle.seats : "Unknown"} People
                  </span>
                </div>
              </div>

              {/* Pricing */}
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

              {/* Rating and Rent Button */}
              <div className="flex justify-between items-center px-6 py-4 ">
                <div className="flex items-center mr-8 ">
                  <FaStar className="text-yellow-400" />
                  <span className="text-xl  font-medium">4.5</span>
                </div>
                <button className="bg-sky-950 w-full text-white rounded-full px-4 py-3 text-base font-normal">
                  Rent Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
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
