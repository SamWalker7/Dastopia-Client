import Dropdown from "../../components/Search/Dropdown";
import makesData from "../../api/makes.json";
import modelsData from "../../api/models.json";
import { useEffect, useState } from "react";
import { Link ,useNavigate} from "react-router-dom";

const Step1 = () => {
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [makeDisplayArray, setMakeDisplayArray] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const makeOptions = makesData.Makes.map((make) => make.make_display);
    setMakeDisplayArray(makeOptions);
  }, []);

  // Update model options based on selected car make
  useEffect(() => {
    if (carMake) {
      // Find the models for the selected make in modelsData
      const selectedMakeModels = modelsData.find(
        (model) => Object.keys(model)[0] === carMake
      );
      setModelOptions(selectedMakeModels ? selectedMakeModels[carMake] : []);
    } else {
      setModelOptions([]); // Clear models if no make is selected
    }
  }, [carMake]);

  const [millage, setMillage] = useState("");
  const [seats, setSeats] = useState("");
  const [manufacturedYear, setManufacturedYear] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [carType, setCarType] = useState("");
  const [transmissionType, setTransmissionType] = useState("");
  const handleNext= async ()=>{
    navigate("/Step2",{state:{millage,seats,manufacturedYear,fuelType,carType,transmissionType}});
   
  }

  return (
    <div className="flex gap-10">
      <div className="bg-white rounded-2xl shadow-sm p-16 w-full">
        {/* Progress Bar */}
        <div className="flex items-center justify-center">
          <div className="w-1/5 border-b-4 border-[#00113D] mr-2"></div>
          <div className="w-4/5 border-b-4 border-blue-200"></div>
        </div>

        {/* Heading */}
        <div className="flex justify-between w-full">
          <div className="flex flex-col w-1/2 items-start">
            <p className="text-2xl text-gray-800 my-4 font-medium text-center mb-4">
              Steps 1 of 5
            </p>
          </div>
        </div>
        <h1 className="text-5xl font-semibold my-8">Car Details</h1>

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="relative inline-block my-3 text-xl w-full">
            <label className="absolute -top-2 left-3 text-lg bg-white px-1 text-gray-500">
              Total Mileage
            </label>
            <div className="border border-gray-400 items-center rounded-md flex bg-white">
              <input
                type="text"
                placeholder="Enter total distance in kilometers"
                value={millage}
                onChange={(e) => setMillage(e.target.value)}
                className="flex justify-between w-full p-3 py-6 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
              />
            </div>
          </div>

          <Dropdown
            label="Fuel Type"
            options={["Diesel", "Petrol"]}
            selectedOption={fuelType}
            onSelect={(option) => setFuelType(option)}
          />

          <div className="relative inline-block my-3 text-xl w-full">
            <label className="absolute -top-2 left-3 text-lg bg-white px-1 text-gray-500">
              Number of Seats
            </label>
            <div className="border border-gray-400 items-center rounded-md flex bg-white">
              <input
                type="text"
                placeholder="Enter number of seats"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className="flex justify-between w-full p-3 py-6 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
              />
            </div>
          </div>

          <Dropdown
            label="Car Type"
            options={[
              "Hatchback",
              "Sedan",
              "SUV",
              "MUV",
              "Coupe",
              "Convertible",
              "Pickup Truck",
            ]}
            selectedOption={carType}
            onSelect={(option) => setCarType(option)}
          />

          <div className="flex gap-8">
            <Dropdown
              label="Transmission Type"
              options={["Manual", "Automatic"]}
              selectedOption={transmissionType}
              onSelect={(option) => setTransmissionType(option)}
            />
            <div className="relative inline-block my-3 text-xl w-full">
              <label className="absolute -top-2 left-3 text-lg bg-white px-1 text-gray-500">
                Manufactured Year
              </label>
              <div className="border border-gray-400 items-center rounded-md flex bg-white">
                <input
                  type="text"
                  placeholder="YYYY"
                  value={manufacturedYear}
                  onChange={(e) => setManufacturedYear(e.target.value)}
                  className="flex justify-between w-full p-3 py-6 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Car Make Dropdown */}
            <Dropdown
              label="Car Make"
              options={makeDisplayArray}
              selectedOption={carMake}
              onSelect={(option) => {
                setCarMake(option);
                setCarModel(""); // Reset car model when make changes
              }}
            />

            {/* Car Model Dropdown */}
            <Dropdown
              label="Car Model"
              options={modelOptions}
              selectedOption={carModel}
              onSelect={(option) => setCarModel(option)}
              disabled={!carMake} // Disable if no make is selected
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full justify-end items-end flex">
          <div
            onClick={handleNext}                                         
            className="min-w-2xl text-white text-xl rounded-full px-32 py-4 my-16 font-normal transition bg-[#00113D] hover:bg-blue-900"
          >
            Upload Picture
          </div>
        </div>
      </div>

      <div className="p-8 w-1/4 bg-blue-200 py-10 h-fit">
        Provide details about your car to get started.
      </div>
    </div>
  );
};

export default Step1;
