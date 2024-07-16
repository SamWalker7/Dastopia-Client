import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import ResultsGrid from "../components/Search/ResultsGrid";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles, fetchImages } from "../store/slices/vehicleSlice";
import { TextField } from "@mui/material";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

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
        vehicles.map(async (vehicle) => {
          await dispatch(fetchImages(vehicle));
        });
      }
    };

    if (vehicles.length < 1) {
      loadData();
    }
  }, [dispatch, vehicles.length]);

  const [make, setMake] = useState("any");
  const [model, setModel] = useState("any");
  const [transmission, setTransmission] = useState("any");
  const [category, setCategory] = useState("any");
  const [selectedCity, setSelectedCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleMakeChange = (event) => {
    setMake(event.target.value);
  };

  const handleModelChange = (event) => {
    setModel(event.target.value);
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
      (model === "any" || vehicle.model === model) &&
      (transmission === "any" || vehicle.transmission === transmission) &&
      (category === "any" || vehicle.category === category) &&
      (!selectedCity || vehicle.city === selectedCity) &&
      (!startDate || new Date(vehicle.startDate) >= new Date(startDate)) &&
      (!endDate || new Date(vehicle.endDate) <= new Date(endDate))
    );
  });

  const gridContainerStyle = {
    display: "flex",
    marginTop: "20px",
    width: "100%",
    border: "2px solid #6b7280",
    borderRadius: "5px",
    padding: "10px",
  };

  const colSpanStyle = {
    width: "50%",
  };

  const mapContainerStyle = {
    backgroundColor: "white",
    padding: "16px",
    width: "50%",
    marginLeft: "50px",
  };

  const isMobile = () => {
    return window.innerWidth < 768;
  };

  if (isMobile()) {
    gridContainerStyle.width = "100%";
    colSpanStyle.width = "100%";
    mapContainerStyle.width = "100%";
    mapContainerStyle.marginLeft = "0";
  }

  const mapDetailsStyle = {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    fontSize: "20px",
  };

  const styles = {
    filterContainer: {
      padding: "16px",
      backgroundColor: "#f0f0f0",
      border: "1px solid #ccc",
      borderRadius: "4px",
      marginBottom: "16px",
      marginTop: "20px",
    },
    filterRow: {
      display: "flex",
      flexWrap: "wrap",
    },
    formControl: {
      minWidth: "120px",
      marginRight: "16px",
      marginBottom: "10px",
      marginLeft: "16px",
    },
    label: {
      fontWeight: "bold",
      marginBottom: "8px",
      display: "block",
    },
    select: {
      padding: "8px",
      paddingRight: "100px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      width: "100%",
    },
    checkboxGroup: {
      display: "flex",
      flexWrap: "wrap",
    },
    resultInfo: {
      marginTop: "10px",
      color: "#6b7280",
      fontSize: "15px",
    },
  };

  return (
    <div style={{ padding: "30px", position: "relative", paddingTop: "23rem" }}>
      <main>
        <div>
          <div
            className="my-4 flex items-center space-x-4"
            style={{
              marginRight: "30px",
              width: "100%",
            }}
          >
            <FormControl
              variant="outlined"
              style={{ marginRight: "30px", width: "20%", fontSize: "16px" }}
            >
              <InputLabel id="location-label">Location</InputLabel>
              <Select
                labelId="location-label"
                value={selectedCity}
                onChange={handleCityChange}
                label="Location"
                style={{
                  fontSize: "16px",
                }}
              >
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                {ethiopianCities.map((city) => (
                  <MenuItem
                    key={city}
                    value={city}
                    style={{
                      fontSize: "16px",
                    }}
                  >
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Start Date"
              type="date"
              variant="outlined"
              value={startDate}
              onChange={handleStartDateChange}
              InputLabelProps={{
                style: { fontSize: "16px" },
                shrink: true,
              }}
              InputProps={{
                style: { fontSize: "16px" },
              }}
              style={{
                marginRight: "30px",
                width: "20%",
              }}
            />
            <TextField
              label="End Date"
              type="date"
              variant="outlined"
              value={endDate}
              onChange={handleEndDateChange}
              InputLabelProps={{
                style: { fontSize: "16px" },
                shrink: true,
              }}
              InputProps={{
                style: { fontSize: "16px" },
              }}
              style={{
                marginRight: "30px",
                width: "20%",
              }}
            />
          </div>
          <div style={styles.filterContainer}>
            <div style={styles.filterRow}>
              <div style={styles.formControl}>
                <label style={styles.label}>Make</label>
                <select
                  style={styles.select}
                  value={make}
                  onChange={handleMakeChange}
                >
                  <option value="any">Any</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Ford">Ford</option>
                </select>
              </div>
              <div style={styles.formControl}>
                <label style={styles.label}>Model</label>
                <select
                  style={styles.select}
                  value={model}
                  onChange={handleModelChange}
                >
                  <option value="any">Any</option>
                  <option value="Camry">Camry</option>
                  <option value="Accord">Accord</option>
                  <option value="Focus">Focus</option>
                </select>
              </div>
              <div style={styles.formControl}>
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
              <div style={styles.formControl}>
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
                    margin: "auto",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  <CircularProgress />
                </div>
              ) : filteredVehicles.length > 0 ? (
                <>
                  <div style={styles.resultInfo}>
                    {filteredVehicles.length} vehicle(s) found.
                  </div>
                  <ResultsGrid vehicles={filteredVehicles} />
                </>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "16px",
                    marginTop: "20px",
                  }}
                >
                  No vehicles found.
                </div>
              )}
            </div>
            <div style={mapContainerStyle}>
              <div style={mapDetailsStyle}>
                Map details will be displayed here.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Search;
