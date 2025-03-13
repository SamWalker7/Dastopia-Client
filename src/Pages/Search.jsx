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
  const [lastEvaluated, setLastEvaluated] = useState(null);
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

  const fetchVehiclesByAttribute = async (attributeName, attributeValue) => {
    setIsLoading(true);
    if (attributeName === "make" && attributeValue === "any") {
      setVehicles([]);
    } else if (!(attributeName === "make" && attributeValue === "any")) {
      setVehicles([]);
    }

    const baseUrl =
      "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/search"; // Updated base URL to the new backend endpoint
    let url = baseUrl;
    let queryParams = [];

    if (attributeName && attributeValue && attributeValue !== "any") {
      queryParams.push(`${attributeName}=${attributeValue}`);
    } // Add other filters based on the current state

    if (make && make !== "any" && attributeName !== "make") {
      queryParams.push(`make=${make}`);
    }
    if (selectedModel && selectedModel !== "any" && attributeName !== "model") {
      queryParams.push(`model=${selectedModel}`);
    }
    if (
      transmission &&
      transmission !== "any" &&
      attributeName !== "transmission"
    ) {
      queryParams.push(`transmission=${transmission}`);
    }
    if (category && category !== "any" && attributeName !== "category") {
      queryParams.push(`category=${category}`);
    }
    if (minPrice) {
      queryParams.push(`price[gte]=${minPrice}`); // Assuming backend supports price ranges, adjust if needed
    }
    if (maxPrice) {
      queryParams.push(`price[lte]=${maxPrice}`); // Assuming backend supports price ranges, adjust if needed
    }

    queryParams.push(`isActive=active`);
    queryParams.push(`isApproved=approved`);

    if (queryParams.length > 0) {
      url += `?${queryParams.join("&")}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.log("response:", response);
        console.error(`HTTP error! status: ${response.status}`);
        setIsLoading(false);
        return;
      }
      const responseData = await response.json();

      if (responseData.body && Array.isArray(responseData.body)) {
        const data = responseData.body.map((item) => ({
          ...item,
          images: [],
          imageLoading: true,
        }));
        setVehicles(data);

        let fetchedWithImages = [];
        for (let d of data) {
          let urls = [];
          if (d.vehicleImageKeys && Array.isArray(d.vehicleImageKeys)) {
            //Added check for vehicleImageKeys
            for (let image of d.vehicleImageKeys) {
              const imageKey = image.key;
              console.log("image.key before getDownloadUrl:", imageKey);
              const path = await getDownloadUrl(imageKey);
              console.log("path:", path);
              if (path && path.body) {
                urls.push(path.body || "https://via.placeholder.com/300");
              } else {
                console.warn(
                  "getDownloadUrl did not return a valid path.body for key:",
                  imageKey,
                  ". Using placeholder image."
                );
                urls.push("https://via.placeholder.com/300");
              }
            }
          } else {
            urls = ["https://via.placeholder.com/300"]; // Use placeholder if no image keys
          }
          fetchedWithImages.push({
            ...d,
            images: urls,
            imageLoading: false,
          });
        }
        setVehicles(fetchedWithImages);
      } else {
        console.error(
          "API response was not successful: Unexpected response format",
          responseData
        );
        if (!(attributeName === "make" && attributeValue === "any")) {
          setVehicles([]);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      if (!(attributeName === "make" && attributeValue === "any")) {
        setVehicles([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [make, setMake] = useState("any");
  const [model, setModel] = useState([]);
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
    // Fetch initial vehicles when component mounts, showing "Any" make
    fetchVehiclesByAttribute("make", "any");

    const getQueryParam = (name) => {
      const params = new URLSearchParams(window.location.search);
      return params.get(name);
    };
    const pickupLocation = getQueryParam("pickUp");
    const pickupTime = getQueryParam("pickTime");
    const dropOffTime = getQueryParam("dropTime");
    if (pickupLocation && ethiopianCities.includes(pickupLocation)) {
      setSelectedCity(pickupLocation);
    }
    if (pickupTime) {
      setStartDate(pickupTime);
    }
    if (dropOffTime) {
      setEndDate(dropOffTime);
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

  const handleMakeChange = async (event) => {
    const value = event.target.value;
    setMake(value);
    setModel([]);
    setSelectedModel("any");

    await fetchVehiclesByAttribute("make", value);

    const filteredModels = modelData.filter((model) => {
      return Object.keys(model)[0] === value;
    });

    let newModel = [];
    if (filteredModels.length > 0) {
      newModel = Object.values(filteredModels[0])[0];
    }

    setModel(newModel);
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
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  }; // useCallback to memoize the filtering logic

  const getFilteredVehicles = useCallback(
    (
      currentVehicles,
      currentMake,
      currentModel,
      currentTransmission,
      currentCategory,
      currentMinPrice,
      currentMaxPrice
    ) => {
      let initiallyFilteredVehicles = [...currentVehicles];

      if (currentModel !== "any") {
        initiallyFilteredVehicles = initiallyFilteredVehicles.filter(
          (vehicle) => vehicle.model === currentModel
        );
      }

      if (currentTransmission !== "any") {
        initiallyFilteredVehicles = initiallyFilteredVehicles.filter(
          (vehicle) => vehicle.transmission === currentTransmission
        );
      }

      if (currentCategory !== "any") {
        initiallyFilteredVehicles = initiallyFilteredVehicles.filter(
          (vehicle) => vehicle.category === currentCategory
        );
      } // Price filtering - Convert prices to numbers using parseFloat

      const minPriceFilter = parseFloat(currentMinPrice) || 0;
      const maxPriceFilter = parseFloat(currentMaxPrice) || Infinity;

      initiallyFilteredVehicles = initiallyFilteredVehicles.filter(
        (vehicle) => {
          const vehiclePrice = parseFloat(vehicle.price) || 0;
          return (
            vehiclePrice >= minPriceFilter && vehiclePrice <= maxPriceFilter
          );
        }
      );
      return initiallyFilteredVehicles;
    },
    []
  );

  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const transmissionType = ["Automatic", "Manual"];
  const Category = ["Sedan", "SUV", "Convertable"];
  const isValidInput = /^[0-9 ]*$/.test(inputValue); // Get filtered vehicles right before rendering ResultsGrid

  const currentFilteredVehicles = getFilteredVehicles(
    vehicles,
    make,
    selectedModel,
    transmission,
    category,
    minPrice,
    maxPrice
  ); // useEffect to trigger filtering whenever filter states change

  useEffect(() => {
    // Fetch vehicles based on filters
    const fetchFiltered = async () => {
      setIsLoading(true);
      setVehicles([]); // Clear existing vehicles before fetching new ones

      const baseUrl =
        "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/search";
      let url = baseUrl;
      let queryParams = [];

      if (make && make !== "any") {
        queryParams.push(`make=${make}`);
      }
      if (selectedModel && selectedModel !== "any") {
        queryParams.push(`model=${selectedModel}`);
      }
      if (transmission && transmission !== "any") {
        queryParams.push(`transmission=${transmission}`);
      }
      if (category && category !== "any") {
        queryParams.push(`category=${category}`);
      }
      if (minPrice) {
        queryParams.push(`price[gte]=${minPrice}`);
      }
      if (maxPrice) {
        queryParams.push(`price[lte]=${maxPrice}`);
      }

      queryParams.push(`isActive=active`);
      queryParams.push(`isApproved=approved`);

      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        if (responseData.body && Array.isArray(responseData.body)) {
          const data = responseData.body.map((item) => ({
            ...item,
            images: [],
            imageLoading: true,
          }));
          setVehicles(data);

          let fetchedWithImages = [];
          for (let d of data) {
            let urls = [];
            if (d.vehicleImageKeys && Array.isArray(d.vehicleImageKeys)) {
              for (let image of d.vehicleImageKeys) {
                const imageKey = image.key;
                const path = await getDownloadUrl(imageKey);
                if (path && path.body) {
                  urls.push(path.body || "https://via.placeholder.com/300");
                } else {
                  console.warn(
                    "getDownloadUrl did not return a valid path.body for key:",
                    imageKey,
                    ". Using placeholder image."
                  );
                  urls.push("https://via.placeholder.com/300");
                }
              }
            } else {
              urls = ["https://via.placeholder.com/300"];
            }
            fetchedWithImages.push({
              ...d,
              images: urls,
              imageLoading: false,
            });
          }
          setVehicles(fetchedWithImages);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiltered();
  }, [make, selectedModel, transmission, category, minPrice, maxPrice]);

  return (
    <div>
      <div className=" bg-[#FAF9FE] py-32 flex lg:flex-row flex-col items-center lg:items-start w-full">
        <div className=" flex flex-col px-8 lg:pl-12 py-2 items-center ">
          <div className="bg-white w-full px-10 py-4 justify-between text-lg md:flex-row flex-col rounded-xl shadow-sm shadow-blue-300 border border-blue-300 flex">
            <div className="flex md:flex-row flex-col items-center text-base">
              <div className="flex flex-col ">
                <div>Bole International Airport</div>
                <div>Wed, Aug 28,2024 , 10:00</div>
              </div>

              <div className="mx-4">
                <svg
                  className=" text-gray-800 w-8 h-8 transform transition-transform duration-200
         -rotate-90"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 010-1.06z" />
                </svg>
              </div>

              <div className="flex flex-col ">
                <div>Bole International Airport</div>
                <div>Wed, Aug 28,2024 , 10:00</div>
              </div>
            </div>

            <button className=" bg-blue-950 text-sm text-white rounded-full px-4 ml-8 my-2 py-2">
              Edit
            </button>
          </div>

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

                      {model.map((m) => (
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
                      label="Min Price"
                      variant="outlined"
                      size="small"
                      value={minPrice}
                      onChange={handleMinPriceChange}
                      error={!isValidInput}
                      helperText={
                        !isValidInput
                          ? "Only numeric characters are allowed."
                          : ""
                      }
                    />
                  </div>
                  {/* Max Price Input */}
                  <div className="relative inline-block my-3 text-lg w-full">
                    <TextField
                      fullWidth
                      label="Max Price"
                      variant="outlined"
                      size="small"
                      value={maxPrice}
                      onChange={handleMaxPriceChange}
                      error={!isValidInput}
                      helperText={
                        !isValidInput
                          ? "Only numeric characters are allowed."
                          : ""
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
            {/* Search Button Removed */}
          </div>

          <div className=" flex flex-col w-full items-center ">
            <div className="flex flex-col bg-white my-4 w-full px-8 py-4 text-lg md:text-2xl  rounded-xl shadow-md shadow-gray-100 ">
              <div className="flex flex-wrap">
                {isLoading ? (
                  <div>
                    <CircularProgress />
                  </div>
                ) : currentFilteredVehicles.length > 0 ? (
                  <div>
                    <div className="text-xl m-4 font-normal my-8">
                      Found
                      <span className="font-bold">
                        ({currentFilteredVehicles.length})
                      </span>
                      Cars
                    </div>

                    <ResultsGrid
                      key={`${make}-${selectedModel}-${transmission}-${category}-${minPrice}-${maxPrice}`}
                      vehicles={currentFilteredVehicles}
                      pickUpTime={startDate}
                      DropOffTime={endDate}
                      lastEvaluatedKey={lastEvaluated}
                    />
                  </div>
                ) : (
                  <div>No vehicles found. Adjust filters to search.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:w-2/5 h-full items-start justify-start w-5/6 lg:pr-20">
          {error && <div>{error}</div>}
          <div className="flex bg-white w-full p-2 text-lg md:text-2xl  rounded-xl shadow-md shadow-gray-100  ">
            <MapComponent />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Search;
