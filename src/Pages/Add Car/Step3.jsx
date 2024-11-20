import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { FiEdit2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";

const Step3 = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState(["GPS"]);
  const [advanceNotice, setAdvanceNotice] = useState("");
  const [selectedRanges, setSelectedRanges] = useState([]);
  const [tempRange, setTempRange] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [instantBooking, setInstantBooking] = useState(false);
  const [dailyPrice, setDailyPrice] = useState("");

  // Prevent body scroll when calendar is open
  useEffect(() => {
    if (showCalendar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showCalendar]);

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const carFeatures = [
    "GPS",
    "AWD",
    "Air Conditioning",
    "Auto Parking",
    "Extra Luggage",
    "Bluetooth",
    "Leather Seats",
    "Sunroof",
    "Backup Camera",
    "Heated Seats",
  ];

  const noticePeriods = [
    "2 hours",
    "6 hours",
    "12 hours",
    "1 day",
    "2 days",
    "3 days",
  ];

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const isDateInRange = (date) => {
    return selectedRanges.some((range) =>
      range.some(
        (selectedDate) => selectedDate.toDateString() === date.toDateString()
      )
    );
  };

  const handleDateSelect = (day) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (tempRange.length === 1) {
      const start = tempRange[0];
      const end = selectedDate;

      const range = [];
      let current = new Date(start);

      while (current <= end) {
        range.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }

      setSelectedRanges([...selectedRanges, range]);
      setTempRange([]);
    } else {
      setTempRange([selectedDate]);
    }
  };

  const removeRange = (index) => {
    setSelectedRanges(selectedRanges.filter((_, i) => i !== index));
  };

  const renderCalendarDays = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const days = [];
    const today = new Date();

    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-16 h-16 " />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );

      const isInRange = isDateInRange(currentDate);
      const isToday = currentDate.toDateString() === today.toDateString();

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`
            w-16 h-16 flex items-center justify-center focus:outline focus:outline-1 focus:outline-blue-400 rounded-full text-xl
            transition-all duration-200  
            ${isInRange ? "bg-navy-900 text-white" : "hover:bg-gray-100"}
            ${isToday ? "border-2 border-navy-900" : ""}
            ${day < currentDate.toDateString() ? " cursor-not-allowed" : ""}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  // Feature handling
  const addFeature = (feature) => {
    if (!selectedFeatures.includes(feature)) {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
    setSearchTerm("");
  };

  const removeFeature = (feature) => {
    setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
  };

  const filteredFeatures = carFeatures.filter((feature) =>
    feature.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const suggestions = [
    "AWD",
    "Air Conditioning",
    "Label",
    "Label",
    "Label",
    "Extra Luggage",
    "Auto Parking",
    "Label",
  ];

  return (
    <div className="flex gap-10 bg-[#F8F8FF] md:p-40">
      <div className=" mx-auto   p-16 w-full  bg-white rounded-2xl shadow-sm text-xl">
        {/* Progress Bar */}
        <div className="flex items-center justify-center">
          <div className="w-3/5 border-b-4 border-[#00113D] mr-2"></div>
          <div className="w-2/5 border-b-4 border-blue-200"></div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col w-1/2 items-start">
            <p className="text-2xl text-gray-800 my-4 font-medium text-center mb-4">
              Steps 3 of 5
            </p>
          </div>
        </div>

        {/* Car Features Section */}
        <section className="mb-12">
          <h1 className="text-5xl font-semibold my-8">Car Features</h1>
          <p className="text-gray-600 mb-6">
            Please enter your car's basic information below
          </p>

          {/* Search Features Input */}
          <div className="relative mb-6">
            <input
              type="text"
              className="w-full p-4 border rounded-lg pr-12 text-xl"
              placeholder="Search features"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute right-4 top-5 text-gray-400 text-xl" />

            {searchTerm && (
              <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg">
                {filteredFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="p-4 hover:bg-gray-100 cursor-pointer text-xl"
                    onClick={() => addFeature(feature)}
                  >
                    {feature}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Features */}
          <div className="flex flex-wrap gap-3 mb-6">
            {selectedFeatures.map((feature) => (
              <span
                key={feature}
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full flex items-center gap-2 text-xl"
              >
                {feature}
                <FaTimes
                  className="cursor-pointer"
                  onClick={() => removeFeature(feature)}
                />
              </span>
            ))}
          </div>

          {/* Suggestions */}
          <div className="mt-6">
            <p className="text-gray-600 mb-3 text-xl">Suggestions</p>
            <div className="flex flex-wrap gap-3">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="border rounded-full px-4 py-2 text-xl flex items-center gap-2 hover:bg-gray-50"
                  onClick={() => addFeature(suggestion)}
                >
                  <span>+</span> {suggestion}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Car Availability Section */}
        <section className="my-28">
          <h2 className="text-5xl font-semibold my-8">Car Availability</h2>

          {/* Advance Notice Period */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-3">
              Advance Notice Period
            </h3>
            <p className="text-gray-600 text-xl mb-3">
              How long in advance do you need to be notified before a trip
              starts
            </p>
            <select
              className="w-full p-4 border rounded-lg text-xl"
              value={advanceNotice}
              onChange={(e) => setAdvanceNotice(e.target.value)}
            >
              <option value="">Set period duration</option>
              {noticePeriods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>

          {/* Available Dates */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-3">
              Set Car Availability Dates
            </h3>
            <p className="text-gray-600 text-xl mb-3">
              Select a range of dates to set your car's available rent dates
            </p>

            <button
              className="w-full p-4 border rounded-lg text-left text-xl flex justify-between items-center"
              onClick={() => setShowCalendar(true)}
            >
              <span>
                {selectedRanges.length
                  ? `${selectedRanges.length} range(s) selected`
                  : "Select available dates"}
              </span>
              <FiEdit2 className="text-xl" />
            </button>

            {/* Selected Ranges Display */}
            {selectedRanges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedRanges.map((range, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-xl flex items-center gap-2"
                  >
                    {`${formatDate(range[0])} - ${formatDate(
                      range[range.length - 1]
                    )}`}
                    <FaTimes
                      className="cursor-pointer"
                      onClick={() => removeRange(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Calendar Modal */}
          {showCalendar && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
                <div className="flex items-center justify-between mb-6">
                  <select
                    value={`${
                      months[currentMonth.getMonth()]
                    } ${currentMonth.getFullYear()}`}
                    onChange={(e) => {
                      const [month, year] = e.target.value.split(" ");
                      setCurrentMonth(
                        new Date(parseInt(year), months.indexOf(month))
                      );
                    }}
                    className="text-2xl font-medium focus:outline-none"
                  >
                    <option>{`${
                      months[currentMonth.getMonth()]
                    } ${currentMonth.getFullYear()}`}</option>
                  </select>
                  <div className="flex gap-4">
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() - 1
                          )
                        )
                      }
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <FiChevronLeft className="text-2xl" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() + 1
                          )
                        )
                      }
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <FiChevronRight className="text-2xl" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-0 mb-4">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="w-16 h-16 flex items-center justify-center text-gray-600 text-xl"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-0 mb-6">
                  {renderCalendarDays()}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    className="px-6 py-3 text-gray-600 text-xl font-medium"
                    onClick={() => {
                      setShowCalendar(false);
                      setTempRange([]);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-3 text-blue-600 text-xl font-medium"
                    onClick={() => {
                      setShowCalendar(false);
                      setTempRange([]);
                    }}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Instant Booking Toggle */}
          <div className="flex items-center gap-3 mb-16">
            <div
              className={`w-16 h-8 rounded-full p-1 cursor-pointer flex items-center transition-colors duration-300 ${
                instantBooking ? "bg-sky-950" : "bg-gray-300"
              }`}
              onClick={() => setInstantBooking(!instantBooking)}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform duration-300 ${
                  instantBooking ? "transform translate-x-8" : ""
                }`}
              />
            </div>
            <span className="text-xl">Instant booking</span>
          </div>

          {/* Pricing Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Pricing</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-xl text-blue-800">
                When inputting a price please be aware there will be a price
                deduction on the price you will be inputting
              </p>
            </div>
            <p className="text-gray-600 text-xl mb-3">
              Set daily price for your car
            </p>
            <input
              type="number"
              className="w-full p-4 border rounded-lg text-xl"
              placeholder="Set Daily car rent price"
              value={dailyPrice}
              onChange={(e) => setDailyPrice(e.target.value)}
            />
          </div>
        </section>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Link
            to="/step2"
            className="px-12 py-4 border border-gray-300 rounded-full text-xl"
          >
            Back
          </Link>
          <Link
            to="/step4"
            className="px-12 py-4 bg-navy-900 text-white rounded-full text-xl"
          >
            Continue
          </Link>
        </div>
      </div>{" "}
      <div className="p-8 w-1/4 bg-blue-200 py-10 h-fit">
        Make sure to upload all documents necessary to validate that you have
        ownership of the rented car
      </div>
    </div>
  );
};

export default Step3;
