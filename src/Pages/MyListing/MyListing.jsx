import React, { useEffect, useState } from "react";
import { FaGasPump, FaCogs, FaUserFriends } from "react-icons/fa";
import audia1 from "../../images/cars-big/toyota-box.png";
import Details from "./Details";

const MyListing = () => {
  const [vehicles, setVehicles] = useState([]); // State to store vehicle data
  const [selectedVehicleId, setSelectedVehicleId] = useState(null); // State to store selected vehicle ID
  const [vehicleImages, setVehicleImages] = useState({}); // State to store images with keys
  const customer = JSON.parse(localStorage.getItem("customer"));

  // Fetch vehicles from the API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(
          "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/owner_car",
          {
            headers: {
              Authorization: `Bearer ${customer.AccessToken}`, // Add Authorization header
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          const vehiclesData = data.body?.Items || [];
          setVehicles(vehiclesData);
          console.log("Fetched vehicles", vehiclesData);
          fetchVehicleImages(vehiclesData);
        } else {
          console.error("Failed to fetch vehicles", data.body?.message);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    // Function to fetch presigned URLs for images
    const fetchVehicleImages = async (vehiclesData) => {
      try {
        const imageUrls = {};

        for (const vehicle of vehiclesData) {
          if (vehicle.vehicleImageKeys && vehicle.vehicleImageKeys.length > 0) {
            const imagePromises = vehicle.vehicleImageKeys.map(async (key) => {
              const response = await fetch(
                "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/get_presign_download_url",
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${customer.AccessToken}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ key }),
                }
              );
              const data = await response.json();

              if (response.ok) {
                console.log(`Fetched presigned URL for ${key}`, data.url);
                return data.url;
              } else {
                console.error(
                  `Failed to fetch presigned URL for ${key}`,
                  data.message
                );
                return null;
              }
            });

            const urls = await Promise.all(imagePromises);
            imageUrls[vehicle.id] = urls.filter((url) => url !== null); // Filter out null URLs
          }
        }

        setVehicleImages(imageUrls); // Store all fetched image URLs
      } catch (error) {
        console.error("Error fetching vehicle images:", error);
      }
    };

    fetchVehicles();
  }, []);
  const handleSeeDetails = (vehicleId) => {
    setSelectedVehicleId(vehicleId); // Set the selected vehicle ID
  };

  return (
    <div className="flex lg:flex-row flex-col gap-10 py-10 bg-[#FAF9FE] md:px-20 md:pt-40">
      <div className="p-6 bg-white lg:w-2/4 w-full shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold mt-4">My Listings</h1>
        <div className="flex flex-wrap justify-between">
          {vehicles.length > 0 ? (
            vehicles.map((vehicle, index) => (
              <div
                key={index}
                className="flex justify-between w-full h-fit my-4 bg-white rounded-xl shadow-md overflow-hidden"
              >
                {/* Car Image */}
                <div className="w-2/6 flex rounded-2xl mx-4 py-4">
                  <img
                    className="w-full h-full rounded-2xl object-center object-cover"
                    src={
                      vehicleImages[vehicle.id]?.[0] || audia1 // Use the first presigned URL or fallback to default
                    }
                    alt={`Vehicle ${index}`}
                  />
                </div>
                <div className="flex w-4/6 flex-col">
                  <div className="px-2 pt-8 w-full justify-between flex">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {vehicle.make || "Unknown"}{" "}
                        <span className="text-xl font-semibold">
                          {vehicle.model || "Unknown"}
                        </span>
                      </h3>
                      <p className="text-base mt-2 text-gray-400">
                        {vehicle.category || "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 grid-cols-2 justify-between items-center px-2 my-4 w-fit text-gray-400 text-base">
                    <div className="flex items-center space-x-2">
                      <FaGasPump size={12} />
                      <span>{vehicle.fuelType || "Unknown"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCogs size={12} />
                      <span>{vehicle.transmission || "Unknown"}</span>
                    </div>
                    <div className="flex items-center w-28 space-x-2">
                      <FaUserFriends size={13} />
                      <span>{vehicle.seats || "Unknown"} People</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center px-2 pb-4">
                    <div>
                      <p className="text-base text-gray-400">Daily Rent</p>
                      <p className="text-lg font-semibold">{vehicle.price}</p>
                    </div>
                    <div
                      className={`w-fit text-white rounded-full px-4 py-2 text-xs font-normal ${
                        vehicle.status === "Active"
                          ? "bg-[#00173C]"
                          : "bg-red-600"
                      }`}
                    >
                      {vehicle.status}
                    </div>
                  </div>

                  <div className="flex justify-between items-center px-2 pb-4">
                    <button
                      className="bg-[#00173C] w-full text-white rounded-full px-4 py-2 text-xs font-normal"
                      onClick={() => handleSeeDetails(vehicle.id)} // Pass the vehicle ID
                    >
                      See Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No vehicles available.</p> // Fallback in case no vehicles are available
          )}
        </div>
      </div>

      {/* Pass selected vehicle ID to Details component */}
      <Details selectedVehicleId={selectedVehicleId} />
    </div>
  );
};

export default MyListing;
