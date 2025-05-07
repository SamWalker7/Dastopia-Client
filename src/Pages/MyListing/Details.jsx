import React, { useState, useEffect } from "react";
import audia1 from "../../images/cars-big/toyota-box.png";
import {
  FaCalendar,
  FaCogs,
  FaGasPump,
  FaTag,
  FaUserFriends,
  FaStar,
} from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import useVehicleFormStore from "../../store/useVehicleFormStore";
import { getDownloadUrl } from "../../api";
const customer = JSON.parse(localStorage.getItem("customer"));
const fetchPlaceName = async (lat, lng) => {
  const apiKey = "AIzaSyC3TxwdUzV5gbwZN-61Hb1RyDJr0PRSfW4";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === "OK") {
      return data.results[0].formatted_address;
    } else {
      console.error("Geocoding failed:", data.status);
      return `Lat: ${lat}, Lng: ${lng}`;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return `Lat: ${lat}, Lng: ${lng}`;
  }
};
const Details = ({ selectedVehicleId }) => {
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { apiCallWithRetry } = useVehicleFormStore();
  const [imageUrls, setImageUrls] = useState({});
  const [parsedCalendar, setParsedCalendar] = useState([]);

  const Status = ["Active", "Inactive"];
  const [pickUpLocations, setPickUpLocations] = useState([]);
  const [dropOffLocations, setDropOffLocations] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const fetchRatings = async (carID) => {
    try {
      const response = await fetch(
        "https://xo55y7ogyj.execute-api.us-east-1.amazonaws.com/prod/add_vehicle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            operation: "getRatingsbyID",
            carId: carID,
          }),
        }
      );
      const data = await response.json();
      if (data.statusCode === 200 && data.body.success) {
        return {
          ratings: data.body.data.ratings,
          averageRating: data.body.data.averageRating,
        };
      } else {
        console.error("Failed to fetch ratings:", data);
        return { ratings: [], averageRating: 0 };
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
      return { ratings: [], averageRating: 0 };
    }
  };

  useEffect(() => {
    if (selectedVehicleId) {
      fetchRatings(selectedVehicleId)
        .then((data) => {
          setRatings(data.ratings);
          setAverageRating(data.averageRating);
        })
        .catch((error) => console.error("Error setting ratings:", error));
    }
  }, [selectedVehicleId]);

  useEffect(() => {
    const fetchLocations = async (locations, setLocations) => {
      if (Array.isArray(locations)) {
        const placeNames = await Promise.all(
          locations.map(async (location) => {
            if (Array.isArray(location) && location.length === 2) {
              return await fetchPlaceName(location[0], location[1]);
            }
            return "Invalid location";
          })
        );
        setLocations(placeNames);
      }
    };

    if (vehicleDetails?.pickUp) {
      fetchLocations(vehicleDetails.pickUp, setPickUpLocations);
    }

    if (vehicleDetails?.dropOff) {
      fetchLocations(vehicleDetails.dropOff, setDropOffLocations);
    }
  }, [vehicleDetails]);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!selectedVehicleId) {
          setError("Vehicle ID is missing.");
          setLoading(false);
          return;
        }
        const response = await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/${selectedVehicleId}`,
          {
            method: "GET",
          }
        );
        if (response && response.body) {
          console.log("API Response for Vehicle Details:", response.body);
          setVehicleDetails(response.body);
          setStatus(response.body.isActive ? "Active" : "Inactive");

          if (
            response.body.vehicleImageKeys &&
            response.body.vehicleImageKeys.length > 0
          ) {
            const urls = {};
            for (const imageKey of response.body.vehicleImageKeys) {
              try {
                const downloadURL = await getDownloadUrl(imageKey);
                urls[imageKey] = downloadURL?.body;
                console.log(
                  "Download URL for",
                  imageKey,
                  ":",
                  downloadURL.body
                );
                if (!selectedImage) {
                  setSelectedImage(imageKey);
                }
              } catch (downloadUrlError) {
                console.error(
                  `Failed to fetch download URL for ${imageKey}:`,
                  downloadUrlError
                );
                urls[imageKey] = audia1;
                if (!selectedImage) {
                  setSelectedImage(audia1);
                }
              }
            }
            setImageUrls(urls);
            if (!selectedImage && response.body.vehicleImageKeys.length > 0) {
              setSelectedImage(response.body.vehicleImageKeys[0]);
            }
          } else {
            setSelectedImage(audia1);
          }
          // Use vehicleDetails.events directly for calendar data
          if (vehicleDetails?.events) {
            setParsedCalendar(vehicleDetails.events);
          } else {
            setParsedCalendar([]); // Ensure parsedCalendar is always an array, even if no events
          }
        } else {
          setError(
            "Failed to fetch vehicle details or invalid response format."
          );
        }
      } catch (err) {
        console.error("Error fetching vehicle details:", err);
        setError("Error fetching vehicle details.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [
    selectedVehicleId,
    apiCallWithRetry,
    selectedImage,
    customer.AccessToken,
  ]);

  const handleStatus = async (e) => {
    const newStatusValue = e.target.value;
    setStatus(newStatusValue);
    setLoading(true);
    setError(null);
    try {
      let response;
      if (newStatusValue === "Active") {
        response = await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/activate_status/${selectedVehicleId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${customer.AccessToken}`,
            },
          }
        );
      } else if (newStatusValue === "Inactive") {
        response = await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/deactivate_status/${selectedVehicleId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${customer.AccessToken}`,
            },
          }
        );
      }

      if (response && response.status === 200) {
        console.log("Vehicle status updated successfully");
      } else if (response && response.status === 404) {
        setError("Vehicle not found.");
      } else if (response && response.status === 401) {
        setError("Unauthorized.");
      } else if (response) {
        setError(`Failed to update status. Status code: ${response.status}`);
      } else {
        setError("Failed to update status. No response received.");
      }
    } catch (error) {
      console.error("Error updating vehicle status:", error);
      setError("Error updating vehicle status.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return console.log("Loading...");
  }

  if (error) {
    console.log("Error:", error);
    return (
      <div>
        {" "}
        <h3 className="text-base  mt-4">
          {" "}
          Click "See Details" To See more information{" "}
        </h3>
      </div>
    );
  }

  if (!vehicleDetails) {
    return console.log("Vehicle Details not found");
  }

  const getImageUrl = (imageKey) => {
    return imageUrls[imageKey] || audia1;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown Date";
    }
  };

  return (
    <div className="lg:w-3/5 w-full">
      <div className="p-10 bg-white w-full shadow-lg rounded-lg">
        <h1 className="text-2xl my-4 mb-8 font-semibold">Detail Listing</h1>

        <div className="flex lg:flex-row flex-col space-x-4 w-full">
          <img
            src={selectedImage ? getImageUrl(selectedImage) : audia1}
            alt={vehicleDetails.model || "Vehicle Image"}
            className="w-1/2 h-2/3 rounded-md mb-4"
          />

          <div className="grid md:grid-cols-3 grid-cols-2 justify-start gap-2 ">
            {vehicleDetails.vehicleImageKeys &&
              vehicleDetails.vehicleImageKeys.map((imageKey, index) => (
                <img
                  key={index}
                  src={getImageUrl(imageKey)}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setSelectedImage(imageKey)}
                  className="w-full max-w-32 h-20 cursor-pointer rounded-md"
                />
              ))}
          </div>
        </div>

        <div className="relative inline-block my-8 text-base w-[200px] ">
          <label className="absolute -top-2 left-3 text-sm bg-white px-1 text-gray-500">
            Status
          </label>
          <select
            className="border border-gray-400 flex justify-between w-full p-3 py-2 bg-white text-gray-500 rounded-md hover:bg-gray-100 focus:outline focus:outline-1 focus:outline-blue-400 "
            value={status}
            onChange={handleStatus}
          >
            {Status.map((stat, index) => (
              <option
                className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md max-h-60 overflow-y-auto z-10"
                key={index}
                value={stat}
              >
                {stat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex  items-center">
          <h3 className="text-xl font-semibold">
            {vehicleDetails.make} {vehicleDetails.model}
          </h3>
        </div>

        <div className="grid lg:grid-cols-4 grid-cols-2 justify-between space-x-6 items-center  my-8 w-fit text-gray-800 text-sm">
          <div className="bg-blue-100 flex text-blue-700 py-2 items-center px-3 rounded-lg text-center ">
            <FaTag size={12} className="mx-2" />
            {vehicleDetails.price} Birr
          </div>

          <div className="flex items-center space-x-2">
            <FaGasPump size={12} />
            <span>{vehicleDetails.fuelType || "Unknown"}</span>
          </div>

          <div className="flex items-center space-x-2">
            <FaCogs size={12} />
            <span>{vehicleDetails.transmission || "Unknown"}</span>
          </div>

          <div className="flex items-center w-28 space-x-2">
            <FaUserFriends size={13} />
            <span>{vehicleDetails.seats || "Unknown"} People</span>
          </div>
        </div>

        <h4 className="mt-8 text-xl font-semibold">Car Specification</h4>
        <div className="grid lg:grid-cols-3 grid-cols-2 gap-4 mt-4">
          <div>
            <span className="text-gray-500">Car Brand</span>
            <p className="font-medium">{vehicleDetails.make || "Unknown"}</p>
          </div>
          <div>
            <span className="text-gray-500">Car Model</span>
            <p className="font-medium">{vehicleDetails.model || "Unknown"}</p>
          </div>
          <div>
            <span className="text-gray-500">Manufacture Date</span>
            <p className="font-medium">{vehicleDetails.year || "Unknown"}</p>
          </div>
          <div>
            <span className="text-gray-500">Mileage</span>
            <p className="font-medium">{vehicleDetails.mileage || "Unknown"}</p>
          </div>
          <div>
            <span className="text-gray-500">Color</span>
            <p className="font-medium">{vehicleDetails.color || "Unknown"}</p>
          </div>
          <div>
            <span className="text-gray-500">Vehicle Number</span>
            <p className="font-medium">
              {vehicleDetails.vehicleNumber || "Unknown"}
            </p>
          </div>
        </div>

        <div className=" text-[#000000]">
          <section className="my-16">
            <h2 className="font-semibold text-lg mb-4">Features</h2>
            <div className="flex flex-wrap gap-2">
              {vehicleDetails.carFeatures &&
                vehicleDetails.carFeatures.map((feature, index) => (
                  <span
                    key={index}
                    className="border border-gray-400 text-base px-3 py-1 rounded-xl"
                  >
                    {feature}
                  </span>
                ))}
            </div>
          </section>

          <section className="flex flex-col my-16 gap-4">
            <div className="flex space-x-4 items-center text-lg ">
              <h3 className="font-semibold mb-1">Booking</h3>
              <span className="border border-gray-400 text-sm px-4 py-2 rounded-xl">
                {vehicleDetails.instantBooking
                  ? "Instant"
                  : "Requires Approval"}
              </span>
            </div>

            <div className="flex space-x-4 items-center text-lg">
              <h3 className="font-semibold mb-1">Notice Period For Rent</h3>
              <span className="border border-gray-400 text-sm px-4 py-2 rounded-xl">
                {vehicleDetails.advanceNoticePeriod || "Not specified"}
              </span>
            </div>
          </section>

          <section className="my-16">
            <h2 className="font-semibold text-lg mb-4">Pick up Locations</h2>
            <div className="flex flex-wrap gap-2">
              {pickUpLocations.map((place, index) => (
                <span
                  key={index}
                  className="border border-gray-400 text-sm px-3 py-1 rounded-xl"
                >
                  {place}
                </span>
              ))}
            </div>
          </section>

          <section className="my-16">
            <h2 className="font-semibold text-2xl my-4 mb-4">
              Drop off Locations
            </h2>
            <div className="flex flex-wrap gap-2">
              {dropOffLocations.map((place, index) => (
                <span
                  key={index}
                  className="border border-gray-400 text-sm px-3 py-1 rounded-xl"
                >
                  {place}
                </span>
              ))}
            </div>
          </section>
          <section className="my-16">
            <h2 className="font-semibold text-lg mb-4">
              Available Rental Dates
            </h2>
            <div className="space-y-4">
              {status === "Active" &&
                parsedCalendar.map((dateRange, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FaCalendarAlt size={16} />
                    <span className="text-sm">{`${formatDate(
                      dateRange.startDate
                    )} - ${formatDate(dateRange.endDate)}`}</span>
                  </div>
                ))}
            </div>
          </section>

          {/* Rating & Reviews Section */}
          <section className="my-16">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Rating & Reviews
            </h3>
            <div className="flex items-center mb-2">
              <span className="font-semibold text-gray-700 mr-2">
                Average Rating:
              </span>
              <div className="text-yellow-500 text-base">
                {Array.from({ length: Math.round(averageRating) }).map(
                  (_, i) => (
                    <FaStar key={`star-${i}`} className="inline-block" />
                  )
                )}
                {Array.from({ length: 5 - Math.round(averageRating) }).map(
                  (_, i) => (
                    <FaStar
                      key={`empty-star-${i}`}
                      className="inline-block text-gray-300"
                    />
                  )
                )}
              </div>
              <span className="ml-2 text-gray-600">
                ({averageRating?.toFixed(2)})
              </span>
            </div>
            {ratings.length > 0 ? (
              ratings.map((review, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border rounded-md shadow-sm"
                >
                  <div className="flex items-center">
                    {/* Basic star rating - you might want a more visual component */}
                    <div className="text-yellow-500 text-base">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <FaStar
                          key={`review-star-${index}-${i}`}
                          className="inline-block"
                        />
                      ))}
                      {Array.from({ length: 5 - review.rating }).map((_, i) => (
                        <FaStar
                          key={`review-empty-star-${index}-${i}`}
                          className="inline-block text-gray-300"
                        />
                      ))}
                    </div>
                    <p className="ml-3 text-base text-gray-700">
                      {review.rating}/5
                    </p>
                  </div>
                  <p className="text-base text-gray-700 mt-1">
                    {review.userName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{review.review}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Details;
