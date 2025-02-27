import React, { useEffect, useState } from "react";
import { getDownloadUrl, paginatedSearch } from "../../api";
import { FaStar, FaGasPump, FaCogs, FaUserFriends } from "react-icons/fa";
import { GoHeart } from "react-icons/go";
import audia1 from "../../images/cars-big/toyota-box.png";
import Details from "./Details";

const MyListing = () => {
  const currentVehicles = [
    {
      make: "Toyota",
      model: "Corolla",
      category: "Sedan",
      images: audia1,
      fuelType: "Benzene",
      transmission: "Automatic",
      seats: "4",
      price: "1200",
      status: "Active",
    },
    {
      make: "Toyota",
      model: "Corolla",
      category: "Sedan",
      images: audia1,
      fuelType: "Benzene",
      transmission: "Automatic",
      seats: "4",
      price: "1200",
      status: "Inactive",
    },
    {
      make: "Toyota",
      model: "Corolla",
      category: "Sedan",
      images: audia1,
      fuelType: "Benzene",
      transmission: "Automatic",
      seats: "4",
      price: "1200",
      status: "Active",
    },
    {
      make: "Toyota",
      model: "Corolla",
      category: "Sedan",
      images: audia1,
      fuelType: "Benzene",
      transmission: "Automatic",
      seats: "4",
      price: "1200",
      status: "Active",
    },
    {
      make: "Toyota",
      model: "Corolla",
      category: "Sedan",
      images: audia1,
      fuelType: "Benzene",
      transmission: "Automatic",
      seats: "4",
      price: "1200",
      status: "Active",
    },
    {
      make: "Toyota",
      model: "Corolla",
      category: "Sedan",
      images: audia1,
      fuelType: "Benzene",
      transmission: "Automatic",
      seats: "4",
      price: "1200",
      status: "Active",
    },
  ];
  const placeholderImage = "https://via.placeholder.com/300";
  return (
    <div className="flex lg:flex-row flex-col gap-10 py-10 bg-[#FAF9FE] md:px-20 md:pt-40  ">
      {" "}
      <div className="p-6 bg-white lg:w-2/4 w-full shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold mt-4">My Listings</h1>
        <div className="flex flex-wrap justify-between">
          {currentVehicles.map((vehicle, index) => (
            <div
              key={index}
              className=" flex justify-between w-full h-fit my-4 bg-white rounded-xl shadow-md overflow-hidden"
            >
              {/* Car Image */}
              <div className="w-2/6 flex rounded-2xl mx-4 py-4">
                <img
                  className="w-full h-full rounded-2xl object-center object-cover "
                  src={vehicle.images}
                  alt={`Vehicle ${index}`}
                />
              </div>
              <div className="flex  w-4/6 flex-col">
                <div className="px-2 pt-8  w-full justify-between flex">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {vehicle.make || "Unknown"}{" "}
                      <span className="text-xl font-semibold">
                        {vehicle.model || "Unknown"}
                      </span>
                    </h3>
                    <p className="text-base  mt-2 text-gray-400">
                      {vehicle.category || "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 grid-cols-2 justify-between  items-center px-2 my-4 w-fit text-gray-400 text-base">
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
                        ? "bg-[#00173C] "
                        : "bg-red-600"
                    }`}
                  >
                    {vehicle.status}
                  </div>
                </div>

                <div className="flex justify-between items-center px-2 pb-4 ">
                  <button className="bg-[#00173C] w-full text-white rounded-full px-4 py-2 text-xs font-normal">
                    See Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Details />
    </div>
  );
};

export default MyListing;
