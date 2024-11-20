import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
      <div className=" bg-[#FAF9FE]  py-32 flex w-full">
        <div className=" w-1/2 flex flex-col px-32 py-12  items-center ">
          <div className="bg-white w-full px-10 py-4 justify-between text-lg md:text-2xl  rounded-xl shadow-sm shadow-blue-300 border border-blue-300  flex">
            <div className="flex items-center">
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
            <button className=" bg-blue-950 text-lg text-white rounded-full px-12 ml-8 my-2  py-2">
              Edit
            </button>
          </div>
          <div className="flex flex-col bg-white my-12 w-full px-8 py-4 text-lg md:text-2xl  rounded-xl shadow-md shadow-gray-100  ">
            <div className="text-3xl mx-4 font-normal mt-4">Filters</div>
            <div className=" flex justify-center items-center">
              <div className="flex flex-col m-4 w-1/2 ">
                <div className="relative inline-block my-3 text-lg w-full">
                  <FormControl fullWidth>
                    {/* Label inside the box */}
                    <label
                      id="make"
                      className="absolute -top-2 left-3 text-sm bg-white px-1 text-gray-500"
                    >
                      Make
                    </label>

                    {/* Dropdown button */}
                    <div className="border border-gray-400 rounded-md bg-white">
                      <button
                        onClick={toggleDropdown}
                        className="flex justify-between w-full p-3 py-4 bg-white text-gray-500 rounded-md hover:bg-gray-100 focus:outline focus:outline-1 focus:outline-blue-400"
                      >
                        <span>{make || "Select your car type"}</span>

                        {/* Arrow icon */}
                        <svg
                          className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 010-1.06z" />
                        </svg>
                      </button>

                      {/* Dropdown options */}
                      {isOpen && (
                        <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md max-h-60 overflow-y-auto z-10">
                          <MenuItem
                            sx={{ fontSize: "16px" }}
                            value="any"
                            onClick={() =>
                              handleMakeChange({ target: { value: "any" } })
                            }
                          >
                            Any
                          </MenuItem>

                          {makesData.Makes.map((m) => (
                            <li
                              key={m.make_display}
                              onClick={() =>
                                handleMakeChange({
                                  target: { value: m.make_display },
                                })
                              }
                              className="p-2 text-gray-700 hover:bg-gray-200 cursor-pointer"
                            >
                              {m.make_display}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </FormControl>
                </div>

                {/* Model */}
                <div className="relative inline-block my-3 text-lg w-full">
                  <FormControl fullWidth>
                    <label
                      id="demo-simple-select-label"
                      className="absolute -top-2 left-3 text-sm bg-white px-1 text-gray-500"
                    >
                      Model
                    </label>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedModel}
                      label="Age"
                      onChange={handleModelChange}
                    >
                      <MenuItem sx={{ fontSize: "16px" }} value="any">
                        Any
                      </MenuItem>
                      {model.map((m) => {
                        return (
                          <MenuItem sx={{ fontSize: "16px" }} value={m}>
                            {m}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>

                <div className="relative inline-block my-3 text-lg w-full">
                  <FormControl fullWidth>
                    <label
                      id="demo-simple-select-label"
                      className="absolute -top-2 left-3 text-sm bg-white px-1  text-gray-500"
                    >
                      Transmission
                    </label>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={transmission}
                      label="Age"
                      onChange={handleTransmissionChange}
                    >
                      <MenuItem sx={{ fontSize: "16px" }} value="any">
                        Any
                      </MenuItem>
                      {transmissionType.map((m) => {
                        return (
                          <MenuItem sx={{ fontSize: "16px" }} value={m}>
                            {m}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>

                {/* <Dropdown
                  label="Transmission"
                  options={transmissionType}
                  onSelect={transmission}
                /> */}
              </div>

              <div className="flex flex-col justify-start items-start h-full  m-4 w-1/2">
                <div className="flex mt-4">
                  {" "}
                  {/* input box */}
                  <div className="relative inline-block my-3 text-lg w-full mr-4 ">
                    <label className="absolute -top-2 left-3 text-sm bg-white px-1  text-gray-500">
                      Min Price
                    </label>
                    <div className="border  border-gray-400 rounded-md bg-white">
                      <input
                        id="textBox"
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Type here..."
                        style={{
                          padding: "10px",
                          width: "100%",
                          border: isValidInput
                            ? "1px solid #D6D9DE"
                            : "1px solid red",
                        }}
                      />
                      {!isValidInput && (
                        <p style={{ color: "red", marginTop: "10px" }}>
                          Only numeric characters are allowed.
                        </p>
                      )}
                    </div>
                  </div>
                  {/* input box */}
                  <div className="relative inline-block my-3 text-lg w-full  ">
                    <label className="absolute -top-2 left-3 text-sm bg-white px-1  text-gray-500">
                      Max Price
                    </label>
                    <div className="border  border-gray-400 rounded-md bg-white">
                      <input
                        id="textBox"
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Type here..."
                        style={{
                          padding: "10px",
                          width: "100%",
                          border: isValidInput
                            ? "1px solid #D6D9DE"
                            : "1px solid red",
                        }}
                      />
                      {!isValidInput && (
                        <p style={{ color: "red", marginTop: "10px" }}>
                          Only numeric characters are allowed.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="relative inline-block my-3 text-lg w-full">
                  <FormControl fullWidth>
                    <label className="absolute -top-2 left-3 text-sm bg-white px-1  text-gray-500">
                      Category
                    </label>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={category}
                      label="Age"
                      onChange={handleCategoryChange}
                    >
                      <MenuItem sx={{ fontSize: "16px" }} value="any">
                        Any
                      </MenuItem>
                      {transmissionType.map((m) => {
                        return (
                          <MenuItem sx={{ fontSize: "16px" }} value={m}>
                            {m}
                          </MenuItem>
                        );
                      })}
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
                    <div className="text-3xl m-4 font-normal my-8">
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

        <div className="flex flex-col w-1/2 pr-20">
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
          <div></div>
          <div>
            <div className="flex  bg-white  w-full p-8 text-lg md:text-2xl justify-between  rounded-xl shadow-md shadow-gray-100  ">
              {" "}
              <MapComponent />{" "}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Search;
