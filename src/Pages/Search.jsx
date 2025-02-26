import React, { useState, useEffect } from "react";
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

  const fetchPagination = async () => {
    setIsLoading(true);
    const response = await paginatedSearch(10);
    if (response.statusCode === 200) {
      setLastEvaluated(response.body.lastEvaluatedKey);

      const data = response.body.items.map((item) => {
        return {
          ...item,
          images: [],
          imageLoading: true,
        };
      });
      setVehicles(data);

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
          imageLoading: false,
        });
      }
      setVehicles(fetched);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPagination();
  }, []);

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

  const handleMakeChange = (event) => {
    const value = event.target.value;
    setMake(value);

    const filteredModels = modelData.filter((model) => {
      return Object.keys(model)[0] === value;
    });

    let newModel = [];
    if (filteredModels.length > 0) {
      newModel = Object.values(filteredModels[0])[0];
    }

    setModel(newModel);
    setSelectedModel(newModel.length > 0 ? newModel[0] : "any");
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

  const filteredVehicles = vehicles.filter((vehicle) => {
    return (
      (make === "any" || vehicle.make === make) &&
      (selectedModel === "any" || vehicle.model === selectedModel) &&
      (transmission === "any" || vehicle.transmission === transmission) &&
      (category === "any" || vehicle.category === category) &&
      (!selectedCity || vehicle.city === selectedCity)
    );
  });
  console.log("filteredVehicles ", filteredVehicles);
  // State to hold the input value
  const [inputValue, setInputValue] = useState("");

  // Function to handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const transmissionType = ["Any", "Automatic", "Manual"];
  const Category = ["Any", "Sedan", "SUV", "Convertable"];

  // Optional: Validation Example (disallow special characters)
  const isValidInput = /^[0-9 ]*$/.test(inputValue);

  return (
    <div>
      <div className=" bg-[#FAF9FE]  py-32 flex lg:flex-row flex-col items-center lg:items-start w-full">
        <div className="  flex flex-col  px-8 lg:pl-12 py-2  items-center ">
          <div className="bg-white w-full px-10 py-4 justify-between text-lg  md:flex-row flex-col  rounded-xl shadow-sm shadow-blue-300 border border-blue-300  flex">
            <div className="flex md:flex-row flex-col items-center text-base">
              {" "}
              <div className="flex flex-col ">
                <div>Bole International Airport</div>
                <div>Wed, Aug 28,2024 , 10:00</div>
              </div>
              <div className="mx-4">
                {" "}
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
            <button className=" bg-blue-950 text-sm text-white rounded-full px-4 ml-8 my-2  py-2">
              Edit
            </button>
          </div>
          <div className="flex flex-col bg-white my-12 w-full px-4 py-4 text-lg   rounded-xl shadow-md shadow-gray-100  ">
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
                      value={inputValue}
                      onChange={handleInputChange}
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
                      value={inputValue}
                      onChange={handleInputChange}
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
                      {transmissionType.map((m) => (
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

          <div className=" flex flex-col w-full  items-center ">
            <div className="flex flex-col bg-white my-4 w-full px-8 py-4 text-lg md:text-2xl  rounded-xl shadow-md shadow-gray-100  ">
              <div className="flex flex-wrap">
                {isLoading ? (
                  <div>
                    <CircularProgress />
                  </div>
                ) : filteredVehicles.length > 0 ? (
                  <div>
                    <div className="text-xl m-4 font-normal my-8">
                      Found{" "}
                      <span className="font-bold">
                        {" "}
                        ({filteredVehicles.length})
                      </span>{" "}
                      Cars
                    </div>
                    <ResultsGrid
                      vehicles={filteredVehicles}
                      pickUpTime={startDate}
                      DropOffTime={endDate}
                      lastEvaluatedKey={lastEvaluated}
                    />
                  </div>
                ) : (
                  <div>No vehicles found.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:w-2/5  h-full items-start justify-start w-5/6  lg:pr-20">
          {error && <div>{error}</div>}
          {/* <div className="flex  bg-white my-10 w-full px-8 py-4 text-lg md:text-2xl justify-between  rounded-xl shadow-md shadow-gray-100  ">
            <div className=" flex  items-center ">
              <div className=" flex space-x-6 ">
                <Dropdown label="Make" options={makeDisplayArray} />{" "}
                <Dropdown label="Make" options={makeDisplayArray} />{" "}
                <Dropdown label="Make" options={makeDisplayArray} />
              </div>
            </div>
            <button className=" bg-blue-950 text-lg text-white rounded-full px-12 ml-8  py-2 my-4">
              Filter
            </button>
          </div> */}

          <div className="flex  bg-white w-full  p-2 text-lg md:text-2xl   rounded-xl shadow-md shadow-gray-100  ">
            {" "}
            <MapComponent />{" "}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Search;
