import React, { useEffect, useState } from "react";
import makesData from "../../api/makes.json";
import modelsData from "../../api/models.json";
import useVehicleFormStore from "../../store/useVehicleFormStore";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

// Options for the new Select components
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 70 }, (_, i) => {
  // Years for the last 70 years
  const year = currentYear - i;
  return { value: year.toString(), label: year.toString() };
});

const plateRegionOptions = [
  { value: "AA", label: "Addis Ababa" },
  { value: "OR", label: "Oromia" },
  { value: "AM", label: "Amhara" },
  { value: "TG", label: "Tigray" },
  { value: "SN", label: "SNNPR" },
  { value: "SD", label: "Sidama" },
  { value: "SM", label: "Somali" },
  { value: "BG", label: "Benishangul-Gumuz" },
  { value: "AF", label: "Afar" },
  { value: "GM", label: "Gambela" },
  { value: "HR", label: "Harari" },
  { value: "DR", label: "Dire Dawa" },
  { value: "Other", label: "Other/Not Specified" },
];

const seatOptions = [
  { value: "2", label: "2 Seats" },
  { value: "4", label: "4 Seats" },
  { value: "5", label: "5 Seats" },
  { value: "6", label: "6 Seats" },
  { value: "7", label: "7 Seats" },
  { value: "8+", label: "8+ Seats" },
];

const mileageRangeOptions = [
  { value: "0-20000", label: "0 - 20,000 km" },
  { value: "20001-50000", label: "20,001 - 50,000 km" },
  { value: "50001-100000", label: "50,001 - 100,000 km" },
  { value: "100001-150000", label: "100,001 - 150,000 km" },
  { value: "150001-200000", label: "150,001 - 200,000 km" },
  { value: "200001-250000", label: "200,001 - 250,000 km" },
  { value: "250000+", label: "Over 250,000 km" },
];

const Step1 = ({ nextStep }) => {
  const [makeDisplayArray, setMakeDisplayArray] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);

  const { vehicleData, updateVehicleData } = useVehicleFormStore();

  useEffect(() => {
    const makeOptions = makesData.Makes.map((make) => make.make_display);
    makeOptions.push("Other"); // Add "Other" to the list
    setMakeDisplayArray(makeOptions);
  }, []);

  useEffect(() => {
    const selectedMake = vehicleData.make;
    if (selectedMake && selectedMake !== "Other") {
      const selectedMakeModels = modelsData.find(
        (model) => Object.keys(model)[0] === selectedMake
      );
      setModelOptions(
        selectedMakeModels ? selectedMakeModels[selectedMake] : []
      );
    } else {
      setModelOptions([]);
    }
  }, [vehicleData.make]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateVehicleData({ [name]: value });
  };

  // --- MODIFIED: Updated validation logic ---
  const isMakeModelValid =
    vehicleData.make === "Other"
      ? !!vehicleData.otherMake && !!vehicleData.model
      : !!vehicleData.make && !!vehicleData.model;

  const isFormValid =
    !!vehicleData.fuelType &&
    !!vehicleData.seats &&
    !!vehicleData.vehicleNumber &&
    !!vehicleData.mileage &&
    !!vehicleData.year &&
    !!vehicleData.plateRegion &&
    !!vehicleData.category &&
    !!vehicleData.transmission &&
    isMakeModelValid; // Use the new combined validation

  const handleContinueClick = () => {
    if (isFormValid) {
      nextStep();
    } else {
      console.log("Form is invalid. Please fill all required fields.");
    }
  };

  return (
    <div className="flex gap-10">
      <div className="bg-white rounded-2xl shadow-sm p-10 w-full md:w-2/3">
        {/* Progress Bar and Heading (unchanged) */}
        <div className="flex items-center justify-center">
          <div className="w-1/5 border-b-4 border-[#00113D] mr-2"></div>
          <div className="w-4/5 border-b-4 border-blue-200"></div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col w-1/2 items-start">
            <p className="text-xl text-gray-800 my-4 font-medium text-center mb-4">
              Steps 1 of 5
            </p>
          </div>
        </div>
        <h1 className="text-3xl font-semibold my-8">Car Details</h1>

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* All other form controls remain the same */}
          <FormControl fullWidth required size="small">
            <InputLabel>Fuel Type</InputLabel>
            <Select
              label="Fuel Type"
              name="fuelType"
              value={vehicleData.fuelType || ""}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Petrol">Petrol (Benzene)</MenuItem>
              <MenuItem value="Diesel">Diesel (Nafta)</MenuItem>
              <MenuItem value="Electric">Electric</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth required size="small">
            <InputLabel>Number of Seats</InputLabel>
            <Select
              label="Number of Seats"
              name="seats"
              value={vehicleData.seats || ""}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {seatOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Plate Number"
            variant="outlined"
            name="vehicleNumber"
            value={vehicleData.vehicleNumber || ""}
            onChange={handleChange}
            size="small"
            fullWidth
            required
          />

          <FormControl fullWidth required size="small">
            <InputLabel>Mileage</InputLabel>
            <Select
              label="Mileage"
              name="mileage"
              value={vehicleData.mileage || ""}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {mileageRangeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required size="small">
            <InputLabel>Manufactured Year</InputLabel>
            <Select
              label="Manufactured Year"
              name="year"
              value={vehicleData.year || ""}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {yearOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required size="small">
            <InputLabel>Plate Region</InputLabel>
            <Select
              label="Plate Region"
              name="plateRegion"
              value={vehicleData.plateRegion || ""}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {plateRegionOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required size="small">
            <InputLabel>Car Type</InputLabel>
            <Select
              label="Car Type"
              name="category"
              value={vehicleData.category || ""}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Hatchback">Hatchback</MenuItem>
              <MenuItem value="Sedan">Sedan</MenuItem>
              <MenuItem value="MUV">MUV/SUV</MenuItem>
              <MenuItem value="SUV">SUV</MenuItem>
              <MenuItem value="Coupe">Coupe</MenuItem>
              <MenuItem value="Convertible">Convertible</MenuItem>
              <MenuItem value="Pickup Truck">Pickup Truck</MenuItem>
              <MenuItem value="Minivan">Minivan</MenuItem>
              <MenuItem value="Van">Van</MenuItem>
            </Select>
          </FormControl>

          {/* --- MODIFIED: Make/Model Section --- */}
          {/* This container spans two columns to hold the make/model logic */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormControl variant="outlined" fullWidth size="small" required>
              <InputLabel>Car Make</InputLabel>
              <Select
                label="Car Make"
                name="make"
                value={vehicleData.make || ""}
                onChange={(event) => {
                  // When make changes, clear model and otherMake
                  updateVehicleData({
                    make: event.target.value,
                    model: "",
                    otherMake: "",
                  });
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {makeDisplayArray.map((make) => (
                  <MenuItem key={make} value={make}>
                    {make}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {vehicleData.make === "Other" ? (
              // If "Other" is selected, show two text fields
              <>
                <TextField
                  label="Specify Make"
                  variant="outlined"
                  name="otherMake"
                  value={vehicleData.otherMake || ""}
                  onChange={handleChange}
                  size="small"
                  fullWidth
                  required
                />
                <TextField
                  label="Specify Model"
                  variant="outlined"
                  name="model" // Re-using the 'model' field for the custom model
                  value={vehicleData.model || ""}
                  onChange={handleChange}
                  size="small"
                  fullWidth
                  required
                />
              </>
            ) : (
              // Otherwise, show the standard model dropdown
              <FormControl
                variant="outlined"
                fullWidth
                size="small"
                required
                disabled={!vehicleData.make || modelOptions.length === 0}
              >
                <InputLabel>Car Model</InputLabel>
                <Select
                  label="Car Model"
                  name="model"
                  value={vehicleData.model || ""}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {vehicleData.make &&
                    modelOptions.map((model) => (
                      <MenuItem key={model} value={model}>
                        {model}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          </div>

          <FormControl fullWidth required size="small">
            <InputLabel>Transmission Type</InputLabel>
            <Select
              label="Transmission Type"
              name="transmission"
              value={vehicleData.transmission || ""}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Manual">Manual</MenuItem>
              <MenuItem value="Automatic">Automatic</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Submit Button */}
        <div className="w-full justify-end items-end flex">
          <button
            onClick={handleContinueClick}
            className={`
              md:w-fit w-full items-center justify-center flex text-white text-xs rounded-full px-8 py-3 mt-8
              transition
              ${
                isFormValid
                  ? "bg-[#00113D] hover:bg-blue-900 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed opacity-70"
              }
            `}
            disabled={!isFormValid}
          >
            Continue
          </button>
        </div>
      </div>

      <div className="p-4 w-1/4 bg-blue-200 py-6 md:flex hidden font-light h-fit">
        Provide details about your car to get started.
      </div>
    </div>
  );
};

export default Step1;
