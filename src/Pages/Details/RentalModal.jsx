// Modal.jsx
import React, { useState } from "react";
import Dropdown from "../../components/Search/Dropdown";
import { useNavigate } from "react-router-dom";

const locations = [
  "Addis Ababa",
  "Bole",
  "Merkato",
  "Piassa",
  "CMC",
  "Summit",
  // Add more locations as needed
];

const insurancePlans = [
  {
    name: "Basic Insurance Plan",
    price: 1000,
    description: "Basic coverage for your rental",
  },
  {
    name: "Premium Plan",
    price: 1500,
    description: "Enhanced coverage with additional benefits",
  },
  {
    name: "Premium Plus Plan",
    price: 2000,
    description: "Comprehensive coverage with maximum protection",
  },
];

const RentalModal = ({ isOpen, onClose }) => {
  const [approved, setApproved] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/details2");
  };
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const [activeTab, setActiveTab] = useState("availability");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [needDriver, setNeedDriver] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Basic Insurance Plan");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6">
        {/* Tabs */}
        <div className="flex w-full bg-[#FAF9FE] border-b mb-6">
          <button
            className={`text-xl w-1/2 px-6 py-3 ${
              activeTab === "availability"
                ? "border-b-2 border-blue-900 text-blue-900"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("availability")}
          >
            Availiablity
          </button>
          <button
            className={`text-xl w-1/2 px-6 py-3 ${
              activeTab === "payment"
                ? "border-b-2 border-sky-950 text-sky-950"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("payment")}
          >
            Payment
          </button>
        </div>

        {/* Content */}
        {activeTab === "availability" ? (
          <div className="space-y-6">
            <Dropdown
              label="Select Pick up location"
              options={locations}
              selectedOption={pickupLocation}
              onSelect={setPickupLocation}
            />

            <Dropdown
              label="Select Drop off location"
              options={locations}
              selectedOption={dropoffLocation}
              onSelect={setDropoffLocation}
            />

            <div className="flex items-center space-x-4 mt-6">
              <div
                className={`w-14 h-7 rounded-full p-1 cursor-pointer ${
                  needDriver ? "bg-sky-950" : "bg-gray-300"
                }`}
                onClick={() => setNeedDriver(!needDriver)}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${
                    needDriver ? "translate-x-7" : ""
                  }`}
                />
              </div>
              <span className="text-xl">
                Would you like a driver provided to you?
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-3xl font-semibold my-4"> Insurance Payment</h1>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-xl">
                You will need pay in advance that will be an issurance for the
                car
              </p>
            </div>

            {insurancePlans.map((plan) => (
              <div
                key={plan.name}
                className="flex items-center space-x-4 p-4 border rounded-lg"
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === plan.name
                      ? "border-sky-950"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedPlan(plan.name)}
                >
                  {selectedPlan === plan.name && (
                    <div className="w-3 h-3 rounded-full bg-sky-950" />
                  )}
                </div>
                <span className="text-xl">{plan.name}</span>
              </div>
            ))}

            <div className="space-y-4 mt-6 text-gray-500">
              <div className="flex justify-between text-xl">
                <span>Daily Fee</span>
                <span>2,450 birr</span>
              </div>
              <div className="flex justify-between text-xl">
                <span>Rental days</span>
                <span>3 days</span>
              </div>
              <div className="flex justify-between text-xl text-black font-semibold pt-4 border-t">
                <span>Total Cost</span>
                <span>5,395 Birr</span>
              </div>
              <div className="flex justify-between text-xl">
                <span>Basic Insurance Plan</span>
                <span>1,000 birr</span>
              </div>
              <div className="flex justify-between text-xl">
                <span>Legal contract Fee</span>
                <span>1,000 birr</span>
              </div>
              <div className="flex justify-between text-xl">
                <span>Registration Fee</span>
                <span>1,200 birr</span>
              </div>
              <div className="flex justify-between text-xl text-black font-bold pt-4 border-t-2">
                <span>Total cost</span>
                <span>7,700 birr</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8">
          <button
            onClick={() => {
              if (activeTab === "availability") {
                setActiveTab("payment");
              } else {
                setApproved(true);

                // onClose();
              }
            }}
            className="w-full bg-sky-950 text-white text-xl py-4 rounded-full hover:bg-blue-800"
          >
            {activeTab === "availability" ? "Next" : "View Rental Agreement"}
          </button>
        </div>
        {approved && (
          <div>
            {/* Overlay background */}
            <div className="fixed inset-0 bg-black opacity-50 z-20"></div>
            {/* Modal content */}
            <div className=" fixed inset-0 flex self-center  justify-center z-30 flex-col items-start p-6 gap-4 w-1/3 h-fit  mx-auto bg-white rounded-lg shadow-md">
              {/* Header */}
              <div className="flex items-center w-full mb-4">
                <button
                  onClick={() => setApproved(false)}
                  className="text-lg font-semibold text-black mr-2"
                >
                  {"←"}
                </button>
                <h2 className="text-lg font-semibold text-black">
                  Booking Details
                </h2>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-black">
                Terms and Conditions
              </h1>
              <h2 className="text-xl font-semibold text-black">
                Renting a Car
              </h2>
              <p className="text-base text-gray-600">
                Please read and accept the terms and conditions before
                confirming your booking.
              </p>

              {/* Terms Content */}
              <div className="text-base text-black leading-relaxed">
                <h3 className="font-semibold text-black mb-2">General Terms</h3>
                <ol className="list-decimal pl-6 text-gray-700">
                  <li>
                    Eligibility: You must be at least 21 years old and hold a
                    valid driver's license.
                  </li>
                  <li>
                    Rental Period: The rental period is defined in the booking
                    confirmation. Early returns will not be refunded.
                  </li>
                  <li>
                    Usage: The vehicle is to be used for personal use only and
                    not for commercial purposes.
                  </li>
                  <li>
                    Responsibility: You are responsible for the vehicle and any
                    damage that occurs during the rental period. Report any
                    issues immediately.
                  </li>
                </ol>

                <h3 className="font-semibold text-black mt-4 mb-2">
                  Payment Terms
                </h3>
                <ol className="list-decimal pl-6 text-gray-700">
                  <li>
                    Charges: The rental fee includes the daily rate, any
                    additional mileage charges, and applicable taxes.
                  </li>
                  <li>
                    Security Deposit: A security deposit will be held on your
                    credit card and refunded upon safe return of the vehicle.
                  </li>
                  <li>
                    Payment Method: Payments are processed via our integrated
                    payment gateway. No cash payments are accepted.
                  </li>
                </ol>

                <h3 className="font-semibold text-black mt-4 mb-2">
                  Insurance and Liability
                </h3>
                <ol className="list-decimal pl-6 text-gray-700">
                  <li>
                    Insurance: Basic insurance coverage is included in your
                    rental fee. Additional insurance options are available.
                  </li>
                  <li>
                    Accidents: In the event of an accident, contact local
                    authorities and inform the car owner immediately.
                  </li>
                  <li>
                    Damages: Any damages not covered by insurance will be
                    deducted from the security deposit. Excessive damage may
                    incur additional charges.
                  </li>
                </ol>
              </div>

              {/* Checkbox */}
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="acceptTerms"
                  className="text-base font-medium text-black"
                >
                  I accept the terms and conditions
                </label>
              </div>

              {/* Approve Button */}
              <button
                onClick={() => {
                  setApproved(false);
                  handleRedirect();
                }}
                className={`w-full py-3 mt-4 text-white  text-lg rounded-full ${
                  isChecked
                    ? "bg-blue-950 hover:bg-blue-900"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!isChecked}
              >
                Approve Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalModal;
