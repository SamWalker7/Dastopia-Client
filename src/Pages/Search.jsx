import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import ResultsGrid from "../components/Search/ResultsGrid";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles, fetchImages } from "../store/slices/vehicleSlice";
import makesData from "../api/makes.json";
import modelData from "../api/models.json";
import MapComponent from "../components/GoogleMaps";

const Search = () => {
  const dispatch = useDispatch();

  const vehicles = useSelector((state) => state?.vehicle.vehicles);
  const isLoading = useSelector((state) => state?.vehicle.loading);

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
    const loadData = async () => {
      const response = await dispatch(fetchVehicles());
      if (fetchVehicles.fulfilled.match(response)) {
        const vehicles = response.payload;
        vehicles.forEach(async (vehicle) => {
          await dispatch(fetchImages(vehicle));
        });
      }
    };

    if (vehicles.length < 1) {
      loadData();
    }
  }, [dispatch, vehicles.length]);

  console.log("vehicles", vehicles);

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

  const gridContainerStyle = {
    display: "flex",
    width: "100%",
    borderRadius: "5px",
    padding: "10px",
    justifyContent: "center",
  };

  const colSpanStyle = {
    width: "50%",
  };

  const mapContainerStyle = {
    backgroundColor: "white",
    width: "50%",

    "@media (max-width: 768px)": {
      display: "none",
    },
  };

  const mapDetailsStyle = {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    fontSize: "20px",
  };

  const styles = {
    filterContainer: {
      paddingLeft: "16px",
      paddingRight: "16px",
      paddingTop: "5px",
      backgroundColor: "#ffffff",
      borderRadius: "4px",
      display: "flex",
      flexWrap: "wrap",
    },
    topFormControl: {
      minWidth: "20%",
      marginRight: "16px",
      marginTop: "0.5rem",
      marginBottom: "2rem",
      height: "3vh",
    },
    formControl: {
      minWidth: "20%",
      marginRight: "16px",
      marginBottom: "10px",
      flex: "1 0 20%",
      marginTop: "0.5rem",
      height: "6vh",
    },
    label: {
      fontWeight: "bold",
      marginBottom: "2px",
      display: "block",
    },
    select: {
      padding: "3px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      width: "100%",
      height: "4vh",
    },
    resultInfo: {
      color: "#6b7280",
      fontSize: "15px",
      paddingLeft: "30px",
      marginBottom: "3px",
    },
  };

  if (typeof window !== "undefined" && window.innerWidth < 768) {
    gridContainerStyle.flexDirection = "column";
    colSpanStyle.width = "100%";
    mapContainerStyle.display = "none";

    styles.formControl = {
      ...styles.formControl,
      minWidth: "100%",
    };
    styles.topFormControl = {
      ...styles.topFormControl,
      minWidth: "100%",
    };
  }

  return (
    <div style={{ padding: "30px", position: "relative", paddingTop: "20rem" }}>
      <main>
        <div
          style={{
            boxShadow: "shadows[4]",
            paddingBottom: "16px",
            marginBottom: "5px",
          }}
        >
          {error && (
            <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
          )}
          <div style={styles.filterContainer}>
            <div style={styles.topFormControl}>
              <label>
                <i className="fa-solid fa-location-dot"></i> &nbsp; Pick-up
                Location <b>*</b>
              </label>
              <select
                style={styles.select}
                value={selectedCity}
                onChange={handleCityChange}
              >
                {ethiopianCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.topFormControl}>
              <label htmlFor="picktime">
                <i className="fa-regular fa-calendar-days "></i> &nbsp; Pick-up{" "}
                <b>*</b>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                style={styles.select}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div style={styles.topFormControl}>
              <label htmlFor="droptime">
                <i className="fa-regular fa-calendar-days "></i> &nbsp; Drop-off{" "}
                <b>*</b>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                style={styles.select}
                min={startDate}
              />
            </div>
          </div>
          <div style={styles.filterContainer}>
            <div style={styles.topFormControl}>
              <label style={styles.label}>Make</label>
              <select
                style={styles.select}
                value={make}
                onChange={handleMakeChange}
              >
                <option value="any">Any</option>
                {makesData.Makes.map((make) => (
                  <option key={make.make_id} value={make.make_display}>
                    {make.make_display}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.topFormControl}>
              <label style={styles.label}>Model</label>
              <select
                style={styles.select}
                value={selectedModel}
                onChange={handleModelChange}
                disabled={make === "any" || model.length === 0}
              >
                <option value="any">Any</option>
                {model.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.topFormControl}>
              <label style={styles.label}>Transmission</label>
              <select
                style={styles.select}
                value={transmission}
                onChange={handleTransmissionChange}
              >
                <option value="any">Any</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div style={styles.topFormControl}>
              <label style={styles.label}>Category</label>
              <select
                style={styles.select}
                value={category}
                onChange={handleCategoryChange}
              >
                <option value="any">Any</option>
                <option value="Sedan">Sedan</option>
                <option value="Suv">SUV</option>
                <option value="Convertible">Convertible</option>
              </select>
            </div>
          </div>
        </div>

        <div style={gridContainerStyle}>
          <div style={colSpanStyle}>
            {isLoading ? (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                }}
              >
                <CircularProgress />
              </div>
            ) : filteredVehicles.length > 0 ? (
              <div
                style={{
                  "@media (min-width: 768px)": {
                    width: "90vw",
                    maxWidth: "800px",
                    margin: "0 auto",
                    paddingLeft: "30px",
                  },
                  "@media (max-width: 768px)": {
                    width: "100vw",
                    paddingLeft: "0px",
                  },
                }}
              >
                <div style={styles.resultInfo}>
                  {filteredVehicles.length} vehicle(s) found.
                </div>
                <ResultsGrid
                  vehicles={filteredVehicles}
                  pickUpTime={startDate}
                  DropOffTime={endDate}
                />
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  color: "#6b7280",
                }}
              >
                No vehicles found.
              </div>
            )}
          </div>
          <div style={mapContainerStyle}>
            <div style={mapDetailsStyle}>
              <MapComponent />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Search;
