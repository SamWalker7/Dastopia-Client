import React, { useState, useEffect, useCallback } from "react";
import {
  CircularProgress,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SettingsIcon from "@mui/icons-material/Settings"; // For Transmission
import CategoryIcon from "@mui/icons-material/Category";

import ResultsGrid from "../components/Search/ResultsGrid";
import makesData from "../api/makes.json";
import modelData from "../api/models.json";
import MapComponent from "../components/GoogleMaps";
import { getDownloadUrl } from "../api";
import Footer from "../components/Footer";

// Primary color defined
const PRIMARY_COLOR = "#172554";
const PRIMARY_COLOR_DARKER = "#0d1732"; // For hover states

// Helper to create filter button style
const filterButtonStyle =
  "bg-white border border-gray-300 hover:border-gray-500 text-gray-700 px-4 py-2 rounded-md text-sm flex items-center justify-center shadow-sm transition-colors duration-150 ease-in-out";
// Active filter buttons will use the primary color for border and text
const activeFilterButtonStyle = `bg-gray-50 border-[${PRIMARY_COLOR}] text-[${PRIMARY_COLOR}] hover:bg-gray-100 px-4 py-2 rounded-md text-sm flex items-center justify-center shadow-sm transition-colors duration-150 ease-in-out`;

// Helper component for the clear icon button
const ClearFilterButton = ({ onClick }) => (
  <IconButton
    size="small"
    onClick={(e) => {
      e.stopPropagation(); // Prevent modal from opening if the parent is a button
      onClick();
    }}
    aria-label="clear filter"
    sx={{
      ml: 1, // margin-left
      padding: "3px", // Adjust padding to be compact
      color: PRIMARY_COLOR, // Icon color matches active filter text
      "&:hover": {
        backgroundColor: `rgba(23, 37, 84, 0.08)`, // Subtle hover background, primary color based
        color: PRIMARY_COLOR_DARKER, // Darken icon on hover
      },
    }}
  >
    <CloseIcon fontSize="small" />
  </IconButton>
);

const Search = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const ethiopianCities = [
    "Addis Ababa",
    "Dire Dawa",
    "Mekelle",
    "Gondar",
    "Bahir Dar",
    "Jimma",
    "Hawassa",
  ];

  // Filter States
  const [make, setMake] = useState("any");
  const [modelList, setModelList] = useState([]);
  const [selectedModel, setSelectedModel] = useState("any");
  const [transmission, setTransmission] = useState("any");
  const [category, setCategory] = useState("any");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [error, setError] = useState("");

  // Modal States
  const [openDateModal, setOpenDateModal] = useState(false);
  const [openPriceModal, setOpenPriceModal] = useState(false);
  const [openMakeModelModal, setOpenMakeModelModal] = useState(false);
  const [openTransmissionModal, setOpenTransmissionModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openAllFiltersModal, setOpenAllFiltersModal] = useState(false);

  // Temporary states for modal inputs
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
  const [tempMinPrice, setTempMinPrice] = useState("");
  const [tempMaxPrice, setTempMaxPrice] = useState("");
  const [tempMake, setTempMake] = useState("any");
  const [tempModel, setTempModel] = useState("any");
  const [tempTransmission, setTempTransmission] = useState("any");
  const [tempCategory, setTempCategory] = useState("any");

  useEffect(() => {
    const getQueryParam = (name) =>
      new URLSearchParams(window.location.search).get(name);
    const pickupLocation = getQueryParam("pickUpLocation");
    const pickupDateQuery = getQueryParam("pickUpDate"); // Dates from URL
    const dropOffDateQuery = getQueryParam("dropOffDate"); // Dates from URL

    if (pickupLocation && ethiopianCities.includes(pickupLocation)) {
      setSelectedCity(pickupLocation);
    }
    if (pickupDateQuery) {
      setStartDate(pickupDateQuery);
    }
    if (dropOffDateQuery) {
      setEndDate(dropOffDateQuery);
    }
  }, []);

  const handleOpenDateModal = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setOpenDateModal(true);
  };

  const handleApplyDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentTempStartDate = tempStartDate ? new Date(tempStartDate) : null;
    if (currentTempStartDate) currentTempStartDate.setHours(0, 0, 0, 0);
    const currentTempEndDate = tempEndDate ? new Date(tempEndDate) : null;
    if (currentTempEndDate) currentTempEndDate.setHours(0, 0, 0, 0);

    let dateError = "";
    if (tempStartDate && !tempEndDate) {
      dateError = "Please select a drop-off date.";
    } else if (!tempStartDate && tempEndDate) {
      dateError = "Please select a pick-up date.";
    } else if (currentTempStartDate && currentTempStartDate < today) {
      dateError = "Pickup date cannot be before today.";
    } else if (
      currentTempStartDate &&
      currentTempEndDate &&
      currentTempEndDate <= currentTempStartDate
    ) {
      dateError = "End date must be after pickup date.";
    }

    if (dateError) {
      alert(dateError);
      return;
    }

    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setOpenDateModal(false);
    setError("");
  };

  const handleOpenPriceModal = () => {
    setTempMinPrice(minPrice);
    setTempMaxPrice(maxPrice);
    setOpenPriceModal(true);
  };
  const handleApplyPrice = () => {
    const tempMin = parseFloat(tempMinPrice) || 0;
    const tempMax = parseFloat(tempMaxPrice) || Infinity;
    if (tempMin < 0) {
      alert("Minimum price cannot be negative.");
      return;
    }
    if (tempMaxPrice !== "" && tempMax < tempMin) {
      alert("Maximum price must be greater than minimum price.");
      return;
    }
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    setOpenPriceModal(false);
  };

  const handleOpenMakeModelModal = () => {
    setTempMake(make);
    setTempModel(selectedModel);
    if (make !== "any") {
      const makeModelsData = modelData.find(
        (m) => Object.keys(m)[0].toLowerCase() === make.toLowerCase()
      );
      setModelList(
        makeModelsData ? makeModelsData[Object.keys(makeModelsData)[0]] : []
      );
    } else {
      setModelList([]);
    }
    setOpenMakeModelModal(true);
  };
  const handleTempMakeChange = (eventValue) => {
    setTempMake(eventValue);
    setTempModel("any");
    if (eventValue !== "any") {
      const makeModelsData = modelData.find(
        (m) => Object.keys(m)[0].toLowerCase() === eventValue.toLowerCase()
      );
      setModelList(
        makeModelsData ? makeModelsData[Object.keys(makeModelsData)[0]] : []
      );
    } else {
      setModelList([]);
    }
  };
  const handleApplyMakeModel = () => {
    setMake(tempMake);
    setSelectedModel(tempModel);
    setOpenMakeModelModal(false);
  };

  useEffect(() => {
    if (make !== "any") {
      const makeModelsData = modelData.find(
        (m) => Object.keys(m)[0].toLowerCase() === make.toLowerCase()
      );
      setModelList(
        makeModelsData ? makeModelsData[Object.keys(makeModelsData)[0]] : []
      );
    } else {
      setModelList([]);
    }
  }, [make]);

  const handleOpenTransmissionModal = () => {
    setTempTransmission(transmission);
    setOpenTransmissionModal(true);
  };
  const handleApplyTransmission = () => {
    setTransmission(tempTransmission);
    setOpenTransmissionModal(false);
  };
  const handleOpenCategoryModal = () => {
    setTempCategory(category);
    setOpenCategoryModal(true);
  };
  const handleApplyCategory = () => {
    setCategory(tempCategory);
    setOpenCategoryModal(false);
  };

  const getFilteredVehicles = useCallback(() => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;
    let filtered = vehicles.filter((vehicle) => {
      const priceVal = parseFloat(vehicle.price) || 0;
      return priceVal >= min && priceVal <= max;
    });
    return filtered.sort(
      (a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0)
    );
  }, [vehicles, minPrice, maxPrice]);

  const transmissionType = ["Automatic", "Manual"];
  const CategoryList = [
    "Sedan",
    "SUV",
    "Convertible",
    "Minivan",
    "Truck",
    "Hatchback",
  ];

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const url = new URL(
          "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/search"
        );
        const params = {
          make: make !== "any" ? make : undefined,
          model: selectedModel !== "any" ? selectedModel : undefined,
          transmission: transmission !== "any" ? transmission : undefined,
          category: category !== "any" ? category : undefined,
          pickUp: startDate || undefined,
          dropOff: endDate || undefined,
          isActive: "active",
          isApproved: "approved",
        };
        Object.entries(params).forEach(([key, value]) => {
          if (value) url.searchParams.append(key, value);
        });
        const response = await fetch(url.toString(), { signal });
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Network response was not ok" }));
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }
        const data = await response.json();
        const fetchedVehicles =
          data.body && Array.isArray(data.body) ? data.body : [];
        const vehiclesWithImages = await Promise.all(
          fetchedVehicles.map(async (vehicle) => {
            const images = await Promise.all(
              (vehicle.vehicleImageKeys || []).map(async (imageKeyObj) => {
                try {
                  if (imageKeyObj && imageKeyObj.key) {
                    const pathResult = await getDownloadUrl(imageKeyObj.key);
                    return (
                      pathResult?.body || "https://via.placeholder.com/300"
                    );
                  }
                  return "https://via.placeholder.com/300";
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
          setError(error.message || "Failed to fetch vehicles.");
          setVehicles([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [make, selectedModel, transmission, category, startDate, endDate]);

  const countActiveFilters = () => {
    let count = 0;
    if (startDate && endDate) count++; // Date filter is active if both dates are set
    if (minPrice || maxPrice) count++;
    if (make !== "any") count++;
    // Count model only if make is also selected, to avoid double counting just "any model"
    // if (selectedModel !== "any" && make !== "any") count++; // This logic might be too complex for simple count, usually make implies model filter is engaged.
    if (transmission !== "any") count++;
    if (category !== "any") count++;
    return count;
  };
  const activeFilterCount = countActiveFilters();

  const clearAllFilters = () => {
    setMake("any");
    setSelectedModel("any");
    setModelList([]);
    setTransmission("any");
    setCategory("any");
    setMinPrice("");
    setMaxPrice("");
    // setStartDate(""); // Keep dates as per original logic unless specified to clear
    // setEndDate("");
    setTempMake("any");
    setTempModel("any");
    setTempMinPrice("");
    setTempMaxPrice("");
    setTempTransmission("any");
    setTempCategory("any");
    // setTempStartDate(""); // If dates are cleared, temp dates should also be cleared
    // setTempEndDate("");
    setOpenAllFiltersModal(false);
  };

  const primaryButtonStyle = {
    backgroundColor: PRIMARY_COLOR,
    "&:hover": { backgroundColor: PRIMARY_COLOR_DARKER },
  };
  const primaryOutlinedButtonStyle = {
    borderColor: PRIMARY_COLOR,
    color: PRIMARY_COLOR,
    "&:hover": {
      borderColor: PRIMARY_COLOR_DARKER,
      color: PRIMARY_COLOR_DARKER,
      backgroundColor: "rgba(23, 37, 84, 0.04)",
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className=" bg-[#FAF9FE] pt-24 sm:pt-32 pb-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center gap-2 mb-6 overflow-x-auto pb-2">
              <button
                onClick={handleOpenDateModal}
                className={
                  startDate && endDate
                    ? activeFilterButtonStyle
                    : filterButtonStyle
                }
              >
                <CalendarTodayIcon fontSize="small" className="mr-2" />
                {startDate && endDate
                  ? `${new Date(startDate).toLocaleDateString()} - ${new Date(
                      endDate
                    ).toLocaleDateString()}`
                  : "Select Dates"}
                {startDate && endDate && (
                  <ClearFilterButton
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                    }}
                  />
                )}
              </button>

              <button
                onClick={handleOpenPriceModal}
                className={
                  minPrice || maxPrice
                    ? activeFilterButtonStyle
                    : filterButtonStyle
                }
              >
                <AttachMoneyIcon fontSize="small" className="mr-2" />
                {minPrice || maxPrice
                  ? `Price: ${minPrice || "Any"} - ${maxPrice || "Any"}`
                  : "Daily price"}
                {(minPrice || maxPrice) && (
                  <ClearFilterButton
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice("");
                    }}
                  />
                )}
              </button>

              <button
                onClick={handleOpenMakeModelModal}
                className={
                  make !== "any" ? activeFilterButtonStyle : filterButtonStyle
                }
              >
                <DirectionsCarIcon fontSize="small" className="mr-2" />
                {make !== "any"
                  ? `${make}${
                      selectedModel !== "any" ? " " + selectedModel : ""
                    }`
                  : "Make & model"}
                {make !== "any" && (
                  <ClearFilterButton
                    onClick={() => {
                      setMake("any");
                      setSelectedModel("any");
                      setModelList([]);
                    }}
                  />
                )}
              </button>

              <button
                onClick={handleOpenTransmissionModal}
                className={
                  transmission !== "any"
                    ? activeFilterButtonStyle
                    : filterButtonStyle
                }
              >
                <SettingsIcon fontSize="small" className="mr-2" />{" "}
                {transmission !== "any" ? transmission : "Transmission"}
                {transmission !== "any" && (
                  <ClearFilterButton onClick={() => setTransmission("any")} />
                )}
              </button>

              <button
                onClick={handleOpenCategoryModal}
                className={
                  category !== "any"
                    ? activeFilterButtonStyle
                    : filterButtonStyle
                }
              >
                <CategoryIcon fontSize="small" className="mr-2" />{" "}
                {category !== "any" ? category : "Category"}
                {category !== "any" && (
                  <ClearFilterButton onClick={() => setCategory("any")} />
                )}
              </button>

              <button
                onClick={() => setOpenAllFiltersModal(true)}
                className={
                  activeFilterCount > 0
                    ? activeFilterButtonStyle
                    : filterButtonStyle
                }
              >
                <FilterListIcon fontSize="small" className="mr-2" /> All filters{" "}
                {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
              </button>
            </div>

            {/* The separate date display div is removed as its functionality is merged into the date filter button */}
          </div>

          <div className="flex lg:flex-row flex-col items-start w-full container mx-auto px-4">
            <div className="flex flex-col w-full lg:w-3/5 xl:w-2/3 lg:pr-6">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                {isLoading ? (
                  <div className="w-full text-center py-20">
                    {" "}
                    <CircularProgress sx={{ color: PRIMARY_COLOR }} />{" "}
                  </div>
                ) : error ? (
                  <div className="w-full text-center py-10 text-red-600 bg-red-50 p-4 rounded-md">
                    {error}
                  </div>
                ) : getFilteredVehicles().length > 0 ? ( // Check if there are vehicles after filtering
                  <>
                    <div className="text-lg sm:text-xl font-semibold mb-4">
                      {getFilteredVehicles().length} car
                      {getFilteredVehicles().length === 1 ? "" : "s"} available
                    </div>
                    <ResultsGrid
                      key={`${make}-${selectedModel}-${transmission}-${category}-${minPrice}-${maxPrice}-${startDate}-${endDate}`}
                      vehicles={getFilteredVehicles()}
                      pickUpTime={startDate}
                      DropOffTime={endDate}
                    />
                  </>
                ) : (
                  <div className="w-full text-center py-20 text-gray-600">
                    No vehicles found for your selection. Adjust your search
                    criteria.
                  </div>
                )}
              </div>
            </div>
            <div className="sticky top-28 flex flex-col lg:w-2/5 xl:w-1/3 h-full w-full mt-8 lg:mt-0">
              <div className="bg-white w-full p-1 rounded-xl shadow-lg ">
                <MapComponent vehicles={vehicles} />
              </div>
            </div>
          </div>
        </div>

        {/* Date Modal */}
        <Dialog
          open={openDateModal}
          onClose={() => setOpenDateModal(false)}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>
            Select Dates{" "}
            <IconButton
              aria-label="close"
              onClick={() => setOpenDateModal(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              label="Pick-up Date"
              type="date"
              value={tempStartDate}
              onChange={(e) => setTempStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Drop-off Date"
              type="date"
              value={tempEndDate}
              onChange={(e) => setTempEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            {" "}
            <Button
              onClick={handleApplyDates}
              variant="contained"
              sx={primaryButtonStyle}
            >
              Apply Dates
            </Button>{" "}
          </DialogActions>
        </Dialog>

        {/* Price Modal */}
        <Dialog
          open={openPriceModal}
          onClose={() => setOpenPriceModal(false)}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>
            Set Price Range{" "}
            <IconButton
              aria-label="close"
              onClick={() => setOpenPriceModal(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              label="Min Price (ETB)"
              type="number"
              value={tempMinPrice}
              onChange={(e) => setTempMinPrice(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Max Price (ETB)"
              type="number"
              value={tempMaxPrice}
              onChange={(e) => setTempMaxPrice(e.target.value)}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            {" "}
            <Button
              onClick={handleApplyPrice}
              variant="contained"
              sx={primaryButtonStyle}
            >
              Apply Price
            </Button>{" "}
          </DialogActions>
        </Dialog>

        {/* Make/Model Modal */}
        <Dialog
          open={openMakeModelModal}
          onClose={() => setOpenMakeModelModal(false)}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>
            Select Make & Model{" "}
            <IconButton
              aria-label="close"
              onClick={() => setOpenMakeModelModal(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              select
              label="Make"
              value={tempMake}
              onChange={(e) => handleTempMakeChange(e.target.value)}
              fullWidth
              margin="normal"
              SelectProps={{ native: true }}
            >
              <option value="any">Any Make</option>{" "}
              {makesData.Makes.map((m) => (
                <option key={m.make_id} value={m.make_display}>
                  {m.make_display}
                </option>
              ))}
            </TextField>
            <TextField
              select
              label="Model"
              value={tempModel}
              onChange={(e) => setTempModel(e.target.value)}
              fullWidth
              margin="normal"
              disabled={tempMake === "any" || modelList.length === 0}
              SelectProps={{ native: true }}
            >
              <option value="any">Any Model</option>{" "}
              {modelList.map((m_val) => (
                <option key={m_val} value={m_val}>
                  {m_val}
                </option>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleApplyMakeModel}
              variant="contained"
              sx={primaryButtonStyle}
            >
              Apply Make & Model
            </Button>
          </DialogActions>
        </Dialog>

        {/* Transmission Modal */}
        <Dialog
          open={openTransmissionModal}
          onClose={() => setOpenTransmissionModal(false)}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>
            Select Transmission{" "}
            <IconButton
              aria-label="close"
              onClick={() => setOpenTransmissionModal(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              select
              label="Transmission"
              value={tempTransmission}
              onChange={(e) => setTempTransmission(e.target.value)}
              fullWidth
              margin="normal"
              SelectProps={{ native: true }}
            >
              <option value="any">Any</option>{" "}
              {transmissionType.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleApplyTransmission}
              variant="contained"
              sx={primaryButtonStyle}
            >
              Apply Transmission
            </Button>
          </DialogActions>
        </Dialog>

        {/* Category Modal */}
        <Dialog
          open={openCategoryModal}
          onClose={() => setOpenCategoryModal(false)}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>
            Select Category{" "}
            <IconButton
              aria-label="close"
              onClick={() => setOpenCategoryModal(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              select
              label="Category"
              value={tempCategory}
              onChange={(e) => setTempCategory(e.target.value)}
              fullWidth
              margin="normal"
              SelectProps={{ native: true }}
            >
              <option value="any">Any</option>{" "}
              {CategoryList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleApplyCategory}
              variant="contained"
              sx={primaryButtonStyle}
            >
              Apply Category
            </Button>
          </DialogActions>
        </Dialog>

        {/* All Filters Modal */}
        <Dialog
          open={openAllFiltersModal}
          onClose={() => setOpenAllFiltersModal(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            All Filters{" "}
            <IconButton
              aria-label="close"
              onClick={() => setOpenAllFiltersModal(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <p className="mb-4 text-sm text-gray-600">
              Apply or modify all available filters here.
            </p>
            {/* Price Range in All Filters */}
            <div className="mb-4 p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Price Range (ETB)</h3>
              <div className="flex gap-4">
                <TextField
                  label="Min Price"
                  type="number"
                  value={tempMinPrice}
                  onChange={(e) => setTempMinPrice(e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Max Price"
                  type="number"
                  value={tempMaxPrice}
                  onChange={(e) => setTempMaxPrice(e.target.value)}
                  fullWidth
                  size="small"
                />
              </div>
            </div>
            {/* Vehicle Make/Model in All Filters */}
            <div className="mb-4 p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Vehicle</h3>
              <TextField
                select
                label="Make"
                value={tempMake}
                onChange={(e) => handleTempMakeChange(e.target.value)}
                fullWidth
                margin="dense"
                size="small"
                SelectProps={{ native: true }}
              >
                <option value="any">Any Make</option>{" "}
                {makesData.Makes.map((m) => (
                  <option key={m.make_id} value={m.make_display}>
                    {m.make_display}
                  </option>
                ))}
              </TextField>
              <TextField
                select
                label="Model"
                value={tempModel}
                onChange={(e) => setTempModel(e.target.value)}
                fullWidth
                margin="dense"
                size="small"
                disabled={tempMake === "any" || modelList.length === 0}
                SelectProps={{ native: true }}
              >
                <option value="any">Any Model</option>{" "}
                {modelList.map((m_val) => (
                  <option key={m_val} value={m_val}>
                    {m_val}
                  </option>
                ))}
              </TextField>
            </div>
            {/* Transmission in All Filters */}
            <div className="mb-4 p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Transmission</h3>
              <TextField
                select
                label="Transmission"
                value={tempTransmission}
                onChange={(e) => setTempTransmission(e.target.value)}
                fullWidth
                margin="dense"
                size="small"
                SelectProps={{ native: true }}
              >
                <option value="any">Any</option>{" "}
                {transmissionType.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </TextField>
            </div>
            {/* Category in All Filters */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Category</h3>
              <TextField
                select
                label="Category"
                value={tempCategory}
                onChange={(e) => setTempCategory(e.target.value)}
                fullWidth
                margin="dense"
                size="small"
                SelectProps={{ native: true }}
              >
                <option value="any">Any</option>{" "}
                {CategoryList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </TextField>
            </div>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: "space-between",
              paddingX: 2,
              paddingBottom: 2,
            }}
          >
            <Button
              onClick={clearAllFilters}
              variant="outlined"
              size="small"
              sx={primaryOutlinedButtonStyle}
            >
              Clear All Filters
            </Button>
            <div>
              <Button
                onClick={() => setOpenAllFiltersModal(false)}
                sx={{ mr: 1 }}
                size="small"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Apply from All Filters modal
                  // Price
                  const tempMin = parseFloat(tempMinPrice) || 0;
                  const tempMax = parseFloat(tempMaxPrice) || Infinity;
                  if (tempMin < 0) {
                    alert("Minimum price cannot be negative.");
                    return;
                  }
                  if (tempMaxPrice !== "" && tempMax < tempMin) {
                    alert("Maximum price must be greater than minimum price.");
                    return;
                  }
                  setMinPrice(tempMinPrice);
                  setMaxPrice(tempMaxPrice);
                  // Make & Model
                  setMake(tempMake);
                  setSelectedModel(tempModel);
                  // Transmission
                  setTransmission(tempTransmission);
                  // Category
                  setCategory(tempCategory);
                  setOpenAllFiltersModal(false);
                }}
                variant="contained"
                size="small"
                sx={primaryButtonStyle}
              >
                Apply Filters
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default Search;
