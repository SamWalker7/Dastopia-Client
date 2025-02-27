import { useState } from "react";
import audia1 from "../../images/cars-big/toyota-box.png";
import {
  FaCalendar,
  FaCogs,
  FaGasPump,
  FaTag,
  FaUserFriends,
} from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
const Details = () => {
  const carDetails = {
    name: "Tesla Model Y",
    image: audia1,
    thumbnails: [
      "/path-to-thumb1.jpg",
      "/path-to-thumb2.jpg",
      "/path-to-thumb3.jpg",
    ],
    fuelType: "Benzene",
    seating: "5 Seater",
    transmission: "Manual",
    rentPrice: {
      total: "7,843 birr",
      daily: "2,450 birr",
    },
    brand: "Tesla",
    model: "Model Y",
    manufactureDate: "2018",
    features: ["Air Conditioning", "4WD", "Android system"],
    pickupLocations: ["CMC Roundabout", "Bole Airport", "Ayat Zone 8"],
    dropOffLocations: ["CMC Roundabout", "Bole Airport"],
    insurance: "Full Coverage",
    rating: 4,
    reviews: [
      {
        name: "Veronika",
        rating: 4,
        reviewText: "Very comfortable and reliable car!",
        avatar: audia1,
      },
    ],
  };

  const [selectedImage, setSelectedImage] = useState(carDetails.image);

  const [status, setStatus] = useState("");

  const handleStatus = (e) => setStatus(e.target.value);

  const Status = ["Active", "Inactive"];

  return (
    <div className="lg:w-3/5 w-full">
      <div className="p-10 bg-white w-full  shadow-lg rounded-lg">
        <h1 className="text-2xl my-4 mb-8 font-semibold">Detail Listing</h1>
        <div className="flex lg:flex-row flex-col space-x-4 w-full">
          {" "}
          <img
            src={audia1}
            alt="Tesla Model Y"
            className="w-1/2 h-2/3 rounded-md mb-4"
          />
          <div className="grid md:grid-cols-3 grid-cols-2 justify-start  gap-2 ">
            {carDetails.thumbnails.map((thumb, index) => (
              <img
                key={index}
                src={audia1}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setSelectedImage(thumb)}
                className="w-full max-w-32 h-20 cursor-pointer rounded-md"
              />
            ))}
          </div>
        </div>
        {/* Pickup and Drop-off */}
        <div className="relative inline-block my-8 text-base w-[200px] ">
          <label className="absolute -top-2 left-3 text-sm bg-white px-1  text-gray-500">
            Status
          </label>
          <select
            className="border  border-gray-400 flex justify-between w-full p-3 py-2 bg-white text-gray-500 rounded-md hover:bg-gray-100 focus:outline focus:outline-1 focus:outline-blue-400 "
            value={status}
            onChange={handleStatus}
          >
            <option value="">Select Status</option>
            {Status.map((stat, index) => (
              <option
                className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md max-h-60 overflow-y-auto z-10"
                key={index}
                value={stat.toLowerCase().replace(/\s+/g, "-")}
              >
                {stat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex   items-center">
          <h3 className="text-xl font-semibold">Toyota Corolla</h3>
        </div>
        <div className="grid lg:grid-cols-4 grid-cols-2 justify-between  space-x-6 items-center  my-8 w-fit text-gray-800 text-sm">
          <div className="bg-blue-100 flex text-blue-700 py-2 items-center px-3 rounded-lg text-center ">
            <FaTag size={12} className="mx-2" /> 900 Birr
          </div>
          <div className="flex items-center space-x-2">
            <FaGasPump size={12} />
            <span>{"Benzene" || "Unknown"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaCogs size={12} />
            <span>{"Automatic" || "Unknown"}</span>
          </div>
          <div className="flex items-center w-28 space-x-2">
            <FaUserFriends size={13} />
            <span>{"5" || "Unknown"} People</span>
          </div>
        </div>

        {/* Car Specification */}
        <h4 className="mt-8 text-xl font-semibold">Car Specification</h4>
        <div className="grid lg:grid-cols-3 grid-cols-2 gap-4 mt-4">
          <div>
            <span className="text-gray-500">Car Brand</span>
            <p className="font-medium">Toyota</p>
          </div>
          <div>
            <span className="text-gray-500">Car Model</span>
            <p className="font-medium">Camry</p>
          </div>
          <div>
            <span className="text-gray-500">Manufacture Date</span>
            <p className="font-medium">2008</p>
          </div>
        </div>
        <div className="  text-[#000000]">
          {/* Features */}
          <section className="my-16">
            <h2 className="font-semibold text-lg mb-4">Features</h2>
            <div className="flex flex-wrap gap-2">
              {[
                "Air Conditioning",
                "4WD",
                "Android system",
                "Android system",
                "Android system",
              ].map((feature, index) => (
                <span
                  key={index}
                  className="border border-gray-400 text-base px-3 py-1 rounded-xl"
                >
                  {feature}
                </span>
              ))}
            </div>
          </section>

          {/* Booking & Notice Period For Rent */}
          <section className="flex flex-col my-16 gap-4">
            <div className="flex space-x-4 items-center text-lg ">
              <h3 className="font-semibold mb-1">Booking</h3>
              <span className="border border-gray-400 text-sm px-4 py-2 rounded-xl">
                Instant
              </span>
            </div>
            <div className="flex space-x-4 items-center text-lg">
              <h3 className="font-semibold mb-1">Notice Period For Rent</h3>
              <span className="border border-gray-400 text-sm px-4 py-2 rounded-xl">
                2 Days before pick up
              </span>
            </div>
          </section>

          {/* Pick up Locations */}
          <section className="my-16">
            <h2 className="font-semibold text-lg mb-4">Pick up Locations</h2>
            <div className="flex flex-wrap gap-2">
              {["Cmc", "Cmc", "Bole Airport", "Bole Medhaniallim"].map(
                (location, index) => (
                  <span
                    key={index}
                    className="border border-gray-400 text-sm px-3 py-1 rounded-xl"
                  >
                    {location}
                  </span>
                )
              )}
            </div>
          </section>

          {/* Drop off Locations */}
          <section className="my-16">
            <h2 className="font-semibold text-2xl my-4 mb-4">
              Drop off Locations
            </h2>
            <div className="flex flex-wrap gap-2">
              {["Cmc", "Cmc", "Bole Airport", "Bole Medhaniallim"].map(
                (location, index) => (
                  <span
                    key={index}
                    className="border border-gray-400 text-base px-3 py-1 rounded-xl"
                  >
                    {location}
                  </span>
                )
              )}
            </div>
          </section>

          {/* Available Rental Dates */}
          <section className="my-16">
            <h2 className="font-semibold text-lg mb-4">
              Available Rental Dates
            </h2>
            <div className="space-y-4">
              {[
                "August 28 - September 28, 2024",
                "May 2 - September 21, 2024",
                "August 28 - September 28, 2024",
              ].map((dateRange, index) => (
                <div key={index} className="flex items-center gap-2">
                  <FaCalendar size={16} />
                  <span className="text-sm">{dateRange}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Details;
