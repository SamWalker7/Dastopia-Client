import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import ResultsGrid from "../components/Search/ResultsGrid";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles, fetchImages } from "../store/slices/vehicleSlice";
import makesData from "../api/makes.json";
import modelData from "../api/models.json";
import MapComponent from "../components/GoogleMaps";
import zIndex from "@mui/material/styles/zIndex";
import { getDownloadUrl, paginatedSearch } from "../api";
import Dropdown from "../components/Search/Dropdown";
import Footer from "../components/Footer";

const Search = () => {
  const dispatch = useDispatch();

  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const makeDisplayArray = makesData.Makes.map((Makes) => Makes.make_display);
  const ethiopianCities = [
    "Addis Ababa",
    "Dire Dawa",
    "Mekelle",
    "Gondar",
    "Bahir Dar",
    "Jimma",
    "Hawassa",
  ];

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [make, setMake] = useState("any");
  const [model, setModel] = useState();
  const [selectedModel, setSelectedModel] = useState("any");
  const [transmission, setTransmission] = useState("any");
  const [category, setCategory] = useState("any");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const getQueryParam = (name) => {
      const params = new URLSearchParams(window.location.search);
      return params.get(name);
    };
    const pickupLocation = getQueryParam("pickUp");
    const pickupDate = getQueryParam("pickUp");
    const dropOffDate = getQueryParam("dropOff");

    if (pickupLocation && ethiopianCities.includes(pickupLocation)) {
      setSelectedCity(pickupLocation);
    }
    if (pickupDate) {
      setStartDate(pickupDate);
    }
    if (dropOffDate) {
      setEndDate(dropOffDate);
    }
  }, []);

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown1 = () => {
    setIsOpen1(!isOpen1);
  };

  const toggleDropdown2 = () => {
    setIsOpen2(!isOpen2);
  };

  const toggleDropdown3 = () => {
    setIsOpen3(!isOpen3);
  };

  const handleStartDateChange = (event) => {
    const value = event.target.value;
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const selectedStartDate = new Date(value).setHours(0, 0, 0, 0);
    const selectedEndDate = endDate
      ? new Date(endDate).setHours(0, 0, 0, 0)
      : null;

    if (selectedStartDate > currentDate) {
      setError("Pickup date cannot be before the current date.");
      setStartDate("");
    } else if (selectedEndDate && selectedStartDate > selectedEndDate) {
      setError("Pickup date cannot be after the end date.");
      setStartDate("");
    } else {
      setError("");
      setStartDate(value);
    }
  };

  const handleEndDateChange = (event) => {

const value = event.target.value;
    if (new Date(value) <= new Date(startDate)) {
      setError("End date must be after the pickup date.");
      setEndDate("");
    } else if (new Date(value).toDateString() === new Date().toDateString()) {
      setError("End date cannot be the current date.");
      setEndDate("");
    } else {
      setError("");
      setEndDate(value);
    }
  };

  const handleMakeChange = (event) => {
    const value = event.target.value;
    setMake(value);
    setSelectedModel("any");
    setModel(modelData.find((m) => Object.keys(m)[0] === value)?.[value] || []);
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleTransmissionChange = (event) => {
    setTransmission(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleMinPriceChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setMinPrice(value);
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setMaxPrice(value);
  };

  const getFilteredVehicles = useCallback(() => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;

    return vehicles.filter((vehicle) => {
      const price = parseFloat(vehicle.price) || 0;
      return price >= min && price <= max;
    });
  }, [vehicles, minPrice, maxPrice]);

  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const transmissionType = ["Automatic", "Manual"];
  const Category = ["Sedan", "SUV", "Convertable"];
  const isValidInput = /^[0-9 ]*$/.test(inputValue);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const url = new URL(
          "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/search"
        );

        const params = {
          make: make !== "any" ? make : "",
          model: selectedModel !== "any" ? selectedModel : "",
          transmission: transmission !== "any" ? transmission : "",
          category: category !== "any" ? category : "",
          pickUp: startDate,
          dropOff: endDate,
          isActive: "active",
          isApproved: "approved",
        };

        Object.entries(params).forEach(([key, value]) => {
          if (value) url.searchParams.append(key, value);
        });

        const response = await fetch(url, { signal });
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        const vehicles = data.body || [];

        const vehiclesWithImages = await Promise.all(
          vehicles.map(async (vehicle) => {
            const images = await Promise.all(
              (vehicle.vehicleImageKeys || []).map(async (image) => {
                try {
                  const path = await getDownloadUrl(image.key);
                  return path?.body || "https://via.placeholder.com/300";
                } catch {
                  return "https://via.placeholder.com/300";
                }
              })
            );
            return { ...vehicle, images };
          })
        );

        setVehicles(vehiclesWithImages);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch error:", error);
          setVehicles([]);
        }
      } finally {
        setIsLoading(false);
        setIsLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [make, selectedModel, transmission, category, startDate, endDate]);

  const isMinPriceValid = !minPrice || parseFloat(minPrice) >= 0;
  const isMaxPriceValid =
    !maxPrice || parseFloat(maxPrice) > parseFloat(minPrice);

const formatPrice = (price) => {
    return parseFloat(price).toLocaleString("en-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 2,
    });
  };
  const allLocations = vehicles.flatMap((vehicle) => [
    ...(vehicle.pickUp || []),
    ...(vehicle.dropOff || []),
  ]);
  return (
    <div>
      <div className=" bg-[#FAF9FE] py-32 flex lg:flex-row flex-col items-center lg:items-start w-full">
        <div className=" flex flex-col px-8 lg:pl-12 py-2 items-center ">
          {startDate && endDate ? (
            <div className="bg-white w-full px-10 py-4 justify-between text-lg md:flex-row flex-col rounded-xl shadow-sm shadow-blue-300 border border-blue-300 flex mb-4">
              <div className="flex md:flex-row flex-col items-center text-base">
                <div className="flex flex-col ">
                  <div>Pick-up Date</div>
                  <div>{new Date(startDate).toLocaleDateString()}</div>
                </div>

                <div className="mx-4">
                  <svg
                    className=" text-gray-800 w-8 h-8 transform transition-transform duration-200 
                  -rotate-9-rotate-90"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 010-1.06z" />
                  </svg>
                </div>

                <div className="flex flex-col ">
                  <div>Drop-off Date</div>
                  <div>{new Date(endDate).toLocaleDateString()}</div>
                </div>
              </div>
              {/* 
              <button className=" bg-blue-950 text-sm text-white rounded-full px-4 ml-8 my-2 py-2">
                Edit
              </button> */}
            </div>
          ) : (
            <div className="bg-white w-full px-10 py-4 justify-between text-lg md:flex-row flex-col rounded-xl shadow-sm shadow-blue-300 border border-blue-300 flex mb-4">
              <div>No dates selected</div>
              {/* <button className=" bg-blue-950 text-sm text-white rounded-full px-4 ml-8 my-2 py-2">
                Edit
              </button> */}
            </div>
          )}

          <div className="flex flex-col bg-white my-12 w-full px-4 py-4 text-lg  rounded-xl shadow-md shadow-gray-100 ">
            <div className="text-xl mx-4 font-semibold mt-4">Filters</div>

            <div className="flex md:flex-row flex-col justify-center lg:items-start items-center">
              <div className="flex flex-col m-4 w-full lg:w-1/2">
                {/* Make Dropdown */}
                <div className="relative inline-block my-3 text-lg w-full">
                  <FormControl fullWidth size="small">
                    <InputLabel
                      id="make-label"
                      className="bg-white px-1 text-gray-500"
                    >
                      Make
                    </InputLabel>

                    <Select
                      labelId="make-label"
                      id="make"
                      value={make}
                      onChange={handleMakeChange}
                      label="Make"
                    >
                      <MenuItem value="any">Any</MenuItem>

                      {makesData.Makes.map((m) => (
                        <MenuItem key={m.make_display} value={m.make_display}>
                          {m.make_display}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                {/* Model Dropdown */}

<div className="relative inline-block my-3 text-lg w-full">
                  <FormControl fullWidth size="small">
                    <InputLabel
                      id="model-label"
                      className="bg-white px-1 text-gray-500"
                    >
                      Model
                    </InputLabel>

                    <Select
                      labelId="model-label"
                      id="model"
                      value={selectedModel}
                      onChange={handleModelChange}
                      label="Model"
                    >
                      <MenuItem value="any">Any</MenuItem>

                      {model &&
                        model.map((m) => (
                          <MenuItem key={m} value={m}>
                            {m}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
                {/* Transmission Dropdown */}
                <div className="relative inline-block mt-3 text-lg w-full">
                  <FormControl fullWidth size="small">
                    <InputLabel
                      id="transmission-label"
                      className="bg-white px-1 text-gray-500"
                    >
                      Transmission
                    </InputLabel>

                    <Select
                      labelId="transmission-label"
                      id="transmission"
                      value={transmission}
                      onChange={handleTransmissionChange}
                      label="Transmission"
                    >
                      <MenuItem value="any">Any</MenuItem>

                      {transmissionType.map((m) => (
                        <MenuItem key={m} value={m}>
                          {m}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div className="flex flex-col justify-start items-start h-full m-4 w-full lg:w-1/2">
                {/* Min Price Input */}
                <div className="flex ">
                  <div className="relative inline-block my-3 text-lg w-full mr-4">
                    <TextField
                      fullWidth
                      label="Min Price (ETB)"
                      variant="outlined"
                      size="small"
                      value={minPrice}
                      onChange={handleMinPriceChange}
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        type: "tel",
                      }}
                      error={!isMinPriceValid}
                      helperText={!isMinPriceValid && "Invalid minimum price"}
                    />
                  </div>
                  {/* Max Price Input */}
                  <div className="relative inline-block my-3 text-lg w-full">
                    <TextField
                      fullWidth
                      label="Max Price (ETB)"
                      variant="outlined"
                      size="small"
                      value={maxPrice}
                      onChange={handleMaxPriceChange}
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        type: "tel",
                      }}
                      error={!isMaxPriceValid}
                      helperText={
                        !isMaxPriceValid && "Must be greater than min price"
                      }
                    />
                  </div>
                </div>
                {/* Category Dropdown */}

<div className="relative inline-block my-3 text-lg w-full">
                  <FormControl fullWidth size="small">
                    <InputLabel
                      id="category-label"
                      className="bg-white px-1 text-gray-500"
                    >
                      Category
                    </InputLabel>

                    <Select
                      labelId="category-label"
                      id="category"
                      value={category}
                      onChange={handleCategoryChange}
                      label="Category"
                    >
                      <MenuItem value="any">Any</MenuItem>

                      {Category.map((m) => (
                        <MenuItem key={m} value={m}>
                          {m}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>

          <div className=" flex flex-col w-full items-center ">
            <div className="flex flex-col bg-white my-4w-full px-8 py-4 text-lg md:text-2xl  rounded-xl shadow-md shadow-gray-100 ">
              <div className="flex flex-wrap">
                {isLoading ? (
                  <div>
                    <CircularProgress />
                  </div>
                ) : getFilteredVehicles().length > 0 ? (
                  <div>
                    <div className="text-xl m-4 font-normal my-8">
                      Found
                      <span className="font-bold">
                        ({getFilteredVehicles().length})
                      </span>
                      Cars
                    </div>

                    <ResultsGrid
                      key={`${make}-${selectedModel}-${transmission}-${category}-${minPrice}-${maxPrice}-${startDate}-${endDate}`}
                      vehicles={getFilteredVehicles()}
                      pickUpTime={startDate}
                      DropOffTime={endDate}
                    />
                  </div>
                ) : (
                  <div>
                    No vehicles found for the selected dates and filters. Adjust
                    your search criteria.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:w-2/5 h-full items-start justify-start w-5/6 lg:pr-20">
          {error && <div>{error}</div>}
          <div className="flex bg-white w-full p-2 text-lg md:text-2xl  rounded-xl shadow-md shadow-gray-100  ">
            <MapComponent vehicles={vehicles} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Search;