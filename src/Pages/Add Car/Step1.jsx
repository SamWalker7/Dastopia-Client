import React, { useEffect, useState } from "react"; // Explicitly import React
// import Dropdown from "../../components/Search/Dropdown"; // <--- Remove this import
import makesData from "../../api/makes.json";
import modelsData from "../../api/models.json";
// import { Link, useNavigate } from "react-router-dom"; // <--- Remove useNavigate if not used here anymore
import useVehicleFormStore from "../../store/useVehicleFormStore";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

// Destructure the prop `nextStep` correctly
const Step1 = ({ nextStep }) => {
  // --- REMOVE OLD STATE VARIABLES ---
  // const [carMake, setCarMake] = useState("");
  // const [carModel, setCarModel] = useState("");
  // const [millage, setMillage] = useState("");
  // const [seats, setSeats] = useState("");
  // const [manufacturedYear, setManufacturedYear] = useState("");
  // const [fuelType, setFuelType] = useState("");
  // const [carType, setCarType] = useState("");
  // const [transmissionType, setTransmissionType] = useState("");

  // Keep state for dropdown options (derived from data files)
  const [makeDisplayArray, setMakeDisplayArray] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);

  // --- REMOVE UNUSED HOOKS/FUNCTIONS ---
  // const navigate = useNavigate(); // Remove if navigation is handled by nextStep prop
  // const handleNext = async () => { // Remove this function
  //   navigate("/Step2", {
  //     state: {
  //       millage,
  //       seats,
  //       manufacturedYear,
  //       fuelType,
  //       carType,
  //       transmissionType,
  //     },
  //   });
  // };

  // Use the store
  const { vehicleData, updateVehicleData } = useVehicleFormStore();

  // Effect to load car makes on mount
  useEffect(() => {
    const makeOptions = makesData.Makes.map((make) => make.make_display);
    setMakeDisplayArray(makeOptions);
  }, []);

  // Effect to update model options based on selected car make from store
  useEffect(() => {
    const selectedMake = vehicleData.make; // Get the make from the store
    if (selectedMake) {
      // Find the models for the selected make in modelsData
      const selectedMakeModels = modelsData.find(
        (model) => Object.keys(model)[0] === selectedMake
      );
      setModelOptions(
        selectedMakeModels ? selectedMakeModels[selectedMake] : []
      );
    } else {
      setModelOptions([]); // Clear models if no make is selected
    }
  }, [vehicleData.make]); // Depend on the 'make' value in the store

  // Universal handler for updating store data from input/select events
  // This works for most inputs where e.target has name and value
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateVehicleData({ [name]: value });
  };

  // --- Validation Logic ---
  // Check if all required fields in the store are filled
  // Explicitly check number fields as they might start as null/undefined
  const isFormValid =
    vehicleData.fuelType !== "" &&
    vehicleData.seats != null &&
    parseInt(vehicleData.seats) > 0 &&
    !isNaN(parseInt(vehicleData.seats)) &&
    vehicleData.vehicleNumber !== "" &&
    vehicleData.mileage != null &&
    parseInt(vehicleData.mileage) >= 0 &&
    !isNaN(parseInt(vehicleData.mileage)) &&
    vehicleData.year != null &&
    parseInt(vehicleData.year) > 0 &&
    !isNaN(parseInt(vehicleData.year)) &&
    vehicleData.plateRegion !== "" &&
    vehicleData.category !== "" &&
    vehicleData.make !== "" &&
    vehicleData.model !== "" &&
    vehicleData.transmission !== "";

  // Handler for the continue button
  // This should call the `nextStep` prop if the form is valid
  const handleContinueClick = () => {
    if (isFormValid) {
      nextStep();
      // console.log("Form Data Submitted:", vehicleData); // Optional: log data on valid submit
    } else {
      console.log("Form is invalid. Please fill all required fields.");
      // Optional: Add user feedback here (e.g., highlight fields, show a message)
    }
  };

  return (
    <div className="flex gap-10">
      <div className="bg-white rounded-2xl shadow-sm p-10 w-full md:w-2/3">
        {/* Progress Bar */}
        <div className="flex items-center justify-center">
          <div className="w-1/5 border-b-4 border-[#00113D] mr-2"></div>
          <div className="w-4/5 border-b-4 border-blue-200"></div>
        </div>

        {/* Heading */}
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
          <FormControl fullWidth required size="small">
            <InputLabel>Fuel Type</InputLabel>
            <Select
              label="Fuel Type "
              name="fuelType"
              value={vehicleData.fuelType || ""} // Ensure value is never undefined or null
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Petrol">Petrol(Benzene)</MenuItem>
              <MenuItem value="Diesel">Diesel(Nafta)</MenuItem>
              <MenuItem value="Electric">Electric</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Number of Seats "
            variant="outlined"
            name="seats"
            value={vehicleData.seats || ""} // Ensure value is never undefined or null
            onChange={handleChange}
            type="number"
            size="small"
            fullWidth
            required
          />

          <TextField
            label="Plate Number "
            variant="outlined"
            name="vehicleNumber"
            value={vehicleData.vehicleNumber || ""} // Ensure value is never undefined or null
            onChange={handleChange}
            size="small"
            fullWidth
            required
          />

          <TextField
            label="Mileage "
            variant="outlined"
            name="mileage"
            value={vehicleData.mileage || ""} // Ensure value is never undefined or null
            onChange={handleChange}
            type="number"
            size="small"
            fullWidth
            required
          />

          <TextField
            label="Manufactured Year "
            variant="outlined"
            name="year"
            value={vehicleData.year || ""} // Ensure value is never undefined or null
            onChange={handleChange}
            type="number"
            size="small"
            fullWidth
            required
          />

          <TextField
            label="Plate Region "
            variant="outlined"
            name="plateRegion"
            value={vehicleData.plateRegion || ""} // Ensure value is never undefined or null
            onChange={handleChange}
            size="small"
            fullWidth
            required
          />

          <FormControl fullWidth required size="small">
            <InputLabel>Car Type</InputLabel>
            <Select
              label="Car Type "
              name="category"
              value={vehicleData.category || ""} // Ensure value is never undefined or null
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Hatchback">Hatchback</MenuItem>
              <MenuItem value="Sedan">Sedan</MenuItem>
              <MenuItem value="MUV">MUV</MenuItem>
              <MenuItem value="Coupe">Coupe</MenuItem>
              <MenuItem value="SUV">SUV</MenuItem>
              <MenuItem value="Convertible">Convertible</MenuItem>
              <MenuItem value="Pickup Truck">Pickup Truck</MenuItem>
            </Select>
          </FormControl>

          <div className="flex gap-6">
            {/* Car Make Dropdown */}
            <FormControl variant="outlined" fullWidth size="small" required>
              <InputLabel id="car-make-label">Car Make</InputLabel>
              <Select
                labelId="car-make-label"
                name="make"
                value={vehicleData.make || ""} // Ensure value is never undefined or null
                onChange={(event) => {
                  // When make changes, update make and reset model in store
                  updateVehicleData({ make: event.target.value, model: "" });
                  // The useEffect watching vehicleData.make will update modelOptions
                }}
                label="Car Make "
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

            {/* Car Model Dropdown */}
            <FormControl
              variant="outlined"
              fullWidth
              size="small"
              required
              disabled={!vehicleData.make} // Disable if no make is selected
            >
              <InputLabel id="car-model-label">Car Model</InputLabel>
              <Select
                labelId="car-model-label"
                name="model"
                value={vehicleData.model || ""} // Ensure value is never undefined or null
                onChange={handleChange} // Use generic handleChange
                label="Car Model "
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {/* Only show models if a make is selected and models are available */}
                {vehicleData.make &&
                  modelOptions.map((model) => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>

          <FormControl fullWidth required size="small">
            <InputLabel>Transmission Type</InputLabel>
            <Select
              label="Transmission Type "
              name="transmission"
              value={vehicleData.transmission || ""} // Ensure value is never undefined or null
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
