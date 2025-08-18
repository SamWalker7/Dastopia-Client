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
  Slider,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SettingsIcon from "@mui/icons-material/Settings";
import CategoryIcon from "@mui/icons-material/Category";

import ResultsGrid from "../components/Search/ResultsGrid";
import makesData from "../api/makes.json";
import modelData from "../api/models.json";
import MapComponent from "../components/GoogleMaps";
import Footer from "../components/Footer";

const PRIMARY_COLOR = "#172554";
const PRIMARY_COLOR_DARKER = "#0d1732";
const MAX_PRICE = 50000;

const filterButtonStyle =
  "bg-white border border-gray-300 hover:border-gray-500 text-gray-700 px-4 py-2 rounded-md text-sm flex items-center justify-center shadow-sm transition-colors duration-150 ease-in-out";
const activeFilterButtonStyle = `bg-gray-50 border-[${PRIMARY_COLOR}] text-[${PRIMARY_COLOR}] hover:bg-gray-100 px-4 py-2 rounded-md text-sm flex items-center justify-center shadow-sm transition-colors duration-150 ease-in-out`;

const ClearFilterButton = ({ onClick }) => (
  <IconButton
    size="small"
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    aria-label="clear filter"
    sx={{
      ml: 1,
      padding: "3px",
      color: PRIMARY_COLOR,
      "&:hover": {
        backgroundColor: `rgba(23, 37, 84, 0.08)`,
        color: PRIMARY_COLOR_DARKER,
      },
    }}
  >
    <CloseIcon fontSize="small" />
  </IconButton>
);

const Search = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryTrigger, setRetryTrigger] = useState(0);

  const ethiopianCities = [
    "Addis Ababa",
    "Dire Dawa",
    "Mekelle",
    "Gondar",
    "Bahir Dar",
    "Jimma",
    "Hawassa",
  ];

  const [make, setMake] = useState("any");
  const [modelList, setModelList] = useState([]);
  const [selectedModel, setSelectedModel] = useState("any");
  const [transmission, setTransmission] = useState("any");
  const [category, setCategory] = useState("any");
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [openDateModal, setOpenDateModal] = useState(false);
  const [openPriceModal, setOpenPriceModal] = useState(false);
  const [openMakeModelModal, setOpenMakeModelModal] = useState(false);
  const [openTransmissionModal, setOpenTransmissionModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openAllFiltersModal, setOpenAllFiltersModal] = useState(false);

  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
  const [tempPriceRange, setTempPriceRange] = useState([0, MAX_PRICE]);
  const [tempMake, setTempMake] = useState("any");
  const [tempModel, setTempModel] = useState("any");
  const [tempTransmission, setTempTransmission] = useState("any");
  const [tempCategory, setTempCategory] = useState("any");

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

  useEffect(() => {
    const getQueryParam = (name) =>
      new URLSearchParams(window.location.search).get(name);
    const pickupLocation = getQueryParam("pickUpLocation");
    const pickupDateQuery = getQueryParam("pickUpDate");
    const dropOffDateQuery = getQueryParam("dropOffDate");

    if (pickupLocation && ethiopianCities.includes(pickupLocation)) {
      setSelectedCity(pickupLocation);
    }
    if (pickupDateQuery) setStartDate(pickupDateQuery);
    if (dropOffDateQuery) setEndDate(dropOffDateQuery);
  }, [ethiopianCities]);

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
    if (tempStartDate && !tempEndDate)
      dateError = "Please select a drop-off date.";
    else if (!tempStartDate && tempEndDate)
      dateError = "Please select a pick-up date.";
    else if (currentTempStartDate && currentTempStartDate < today)
      dateError = "Pickup date cannot be before today.";
    else if (
      currentTempStartDate &&
      currentTempEndDate &&
      currentTempEndDate <= currentTempStartDate
    )
      dateError = "End date must be after pickup date.";

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
    setTempPriceRange(priceRange);
    setOpenPriceModal(true);
  };
  const handleApplyPrice = () => {
    setPriceRange(tempPriceRange);
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

  const handleOpenAllFiltersModal = () => {
    setTempPriceRange(priceRange);
    setTempMake(make);
    setTempModel(selectedModel);
    setTempTransmission(transmission);
    setTempCategory(category);
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
    setOpenAllFiltersModal(true);
  };

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

        // --- MODIFICATION: Sort vehicles by createdAt date in descending order (newest first) ---
        const sortedVehicles = fetchedVehicles.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });

        setVehicles(sortedVehicles);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch error:", error);
          let userMessage = "An unexpected error occurred. Please try again.";
          if (error.message?.includes("status: 5")) {
            userMessage =
              "We're having some trouble on our end. Please try again in a moment.";
          } else if (error.message?.toLowerCase().includes("failed to fetch")) {
            userMessage =
              "Could not connect to the server. Please check your internet connection and try again.";
          }
          setError(userMessage);
          setVehicles([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [
    make,
    selectedModel,
    transmission,
    category,
    startDate,
    endDate,
    retryTrigger,
  ]);

  const getFilteredVehicles = useCallback(() => {
    const [min, max] = priceRange;
    let filtered = vehicles.filter((vehicle) => {
      const priceVal = parseFloat(vehicle.price) || 0;
      return priceVal >= min && priceVal <= max;
    });
    // The main sorting is now by date. This price sort is now secondary if needed, but not required.
    // We'll keep it for price-based filtering, but the primary display is by date from the fetch.
    return filtered;
  }, [vehicles, priceRange]);

  const transmissionType = ["Automatic", "Manual"];
  const CategoryList = [
    "Sedan",
    "SUV",
    "Convertible",
    "Minivan",
    "Truck",
    "Hatchback",
  ];

  const isPriceFilterActive = priceRange[0] > 0 || priceRange[1] < MAX_PRICE;

  const countActiveFilters = () => {
    let count = 0;
    if (startDate && endDate) count++;
    if (isPriceFilterActive) count++;
    if (make !== "any") count++;
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
    setPriceRange([0, MAX_PRICE]);
    setTempMake("any");
    setTempModel("any");
    setTempPriceRange([0, MAX_PRICE]);
    setTempTransmission("any");
    setTempCategory("any");
    setOpenAllFiltersModal(false);
  };

  const filteredVehicles = getFilteredVehicles();

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
                  isPriceFilterActive
                    ? activeFilterButtonStyle
                    : filterButtonStyle
                }
              >
                <AttachMoneyIcon fontSize="small" className="mr-2" />
                {isPriceFilterActive
                  ? `ETB ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}`
                  : "Daily price"}
                {isPriceFilterActive && (
                  <ClearFilterButton
                    onClick={() => setPriceRange([0, MAX_PRICE])}
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
                {category !== "any" ? category : "Car Type"}
                {category !== "any" && (
                  <ClearFilterButton onClick={() => setCategory("any")} />
                )}
              </button>
              <button
                onClick={handleOpenAllFiltersModal}
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
          </div>
          <div className="flex lg:flex-row flex-col items-start w-full container mx-auto px-4">
            <div className="flex flex-col w-full lg:w-3/5 xl:w-2/3 lg:pr-6">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                {isLoading ? (
                  <div className="w-full text-center py-20">
                    <CircularProgress sx={{ color: PRIMARY_COLOR }} />
                  </div>
                ) : error ? (
                  <div className="w-full text-center py-10 text-red-600 bg-red-50 p-4 rounded-md flex flex-col items-center justify-center">
                    <p className="mb-4 font-semibold">{error}</p>
                    <Button
                      onClick={() => setRetryTrigger((prev) => prev + 1)}
                      variant="contained"
                      sx={primaryButtonStyle}
                    >
                      Retry
                    </Button>
                  </div>
                ) : filteredVehicles.length > 0 ? (
                  <>
                    <div className="text-lg sm:text-xl font-semibold mb-4">
                      {filteredVehicles.length} car
                      {filteredVehicles.length === 1 ? "" : "s"} available
                    </div>
                    <ResultsGrid
                      key={`${make}-${selectedModel}-${transmission}-${category}-${priceRange[0]}-${priceRange[1]}-${startDate}-${endDate}`}
                      vehicles={filteredVehicles}
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
                <MapComponent vehicles={filteredVehicles} />
              </div>
            </div>
          </div>
        </div>
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
            <Button
              onClick={handleApplyDates}
              variant="contained"
              sx={primaryButtonStyle}
            >
              Apply Dates
            </Button>
          </DialogActions>
        </Dialog>
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
          <DialogContent dividers sx={{ pt: 3, pb: 2 }}>
            <Box sx={{ width: "90%", mx: "auto" }}>
              <Typography
                gutterBottom
                align="center"
                variant="h6"
                component="div"
                sx={{ color: PRIMARY_COLOR, fontWeight: "bold" }}
              >
                ETB {tempPriceRange[0].toLocaleString()} -{" "}
                {tempPriceRange[1].toLocaleString()}
              </Typography>
              <Slider
                value={tempPriceRange}
                onChange={(event, newValue) => setTempPriceRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={MAX_PRICE}
                step={1000}
                getAriaLabel={() => "Price range"}
                valueLabelFormat={(value) => `${value.toLocaleString()}`}
                sx={{ color: PRIMARY_COLOR }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleApplyPrice}
              variant="contained"
              sx={primaryButtonStyle}
            >
              Apply Price
            </Button>
          </DialogActions>
        </Dialog>
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
            <div className="mb-4 p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Price Range (ETB)</h3>
              <Box sx={{ width: "95%", mx: "auto", mt: 2 }}>
                <Typography
                  gutterBottom
                  align="center"
                  sx={{ fontWeight: "medium" }}
                >
                  ETB {tempPriceRange[0].toLocaleString()} -{" "}
                  {tempPriceRange[1].toLocaleString()}
                </Typography>
                <Slider
                  value={tempPriceRange}
                  onChange={(event, newValue) => setTempPriceRange(newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={MAX_PRICE}
                  step={1000}
                  getAriaLabel={() => "Price range"}
                  valueLabelFormat={(value) => `${value.toLocaleString()}`}
                  sx={{ color: PRIMARY_COLOR }}
                />
              </Box>
            </div>
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
                  setPriceRange(tempPriceRange);
                  setMake(tempMake);
                  setSelectedModel(tempModel);
                  setTransmission(tempTransmission);
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
