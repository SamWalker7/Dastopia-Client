import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { FiEdit2, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// CalendarModal Component
const CalendarModal = ({
  showCalendar,
  setShowCalendar,
  currentMonth,
  setCurrentMonth,
  renderCalendarDays,
  daysOfWeek,
  months,
}) => {
  if (!showCalendar) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-fit mx-4">
        <div className="flex items-center justify-between mb-6">
          <select
            value={`${
              months[currentMonth.getMonth()]
            } ${currentMonth.getFullYear()}`}
            onChange={(e) => {
              const [month, year] = e.target.value.split(" ");
              setCurrentMonth(new Date(parseInt(year), months.indexOf(month)));
            }}
            className="text-base font-medium focus:outline-none"
          >
            <option>{`${
              months[currentMonth.getMonth()]
            } ${currentMonth.getFullYear()}`}</option>
          </select>
          <div className="flex text-sm gap-4">
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
              <FiChevronLeft className="text-lg" />
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
              <FiChevronRight className="text-lg" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0 mb-4">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="w-8 h-8 flex items-center justify-center text-gray-600 text-sm"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 text-sm gap-0 mb-6">
          {renderCalendarDays()}
        </div>

        <div className="flex justify-end gap-4">
          <button
            className="px-6 py-3 text-gray-600 text-sm font-medium"
            onClick={() => setShowCalendar(false)}
          >
            Cancel
          </button>
          <button
            className="px-6 py-3 text-blue-600 text-sm font-medium"
            onClick={() => setShowCalendar(false)}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

// Step3 Component
const Step3 = ({ nextStep, prevStep }) => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState(["GPS"]);
  const [advanceNotice, setAdvanceNotice] = useState("");
  const [selectedRanges, setSelectedRanges] = useState([]);
  const [tempRange, setTempRange] = useState({ start: null, end: null });
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

  const isDateSelected = (date) => {
    return selectedRanges.some((range) => {
      const start = range.start.getTime();
      const end = range.end.getTime();
      const current = date.getTime();
      return current >= start && current <= end;
    });
  };

  const handleDateSelect = (day) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const dateTime = selectedDate.getTime();

    // Check if date is in existing ranges
    let rangeIndex = -1;
    let targetRange = null;

    selectedRanges.forEach((range, index) => {
      const start = range.start.getTime();
      const end = range.end.getTime();
      if (dateTime >= start && dateTime <= end) {
        rangeIndex = index;
        targetRange = range;
      }
    });

    if (rangeIndex !== -1) {
      // Split existing range
      const newRanges = [];
      const splitDate = selectedDate;

      // Create ranges before and after split date
      if (targetRange.start < splitDate) {
        const beforeDate = new Date(splitDate);
        beforeDate.setDate(beforeDate.getDate() - 1);
        newRanges.push({
          start: new Date(targetRange.start),
          end: beforeDate,
        });
      }

      if (splitDate < targetRange.end) {
        const afterDate = new Date(splitDate);
        afterDate.setDate(afterDate.getDate() + 1);
        newRanges.push({
          start: afterDate,
          end: new Date(targetRange.end),
        });
      }

      const updatedRanges = [...selectedRanges];
      updatedRanges.splice(rangeIndex, 1, ...newRanges);
      setSelectedRanges(updatedRanges);
    } else {
      // Handle range selection
      if (!tempRange.start) {
        setTempRange({ start: selectedDate, end: null });
      } else {
        let startDate = tempRange.start;
        let endDate = selectedDate;

        // Ensure chronological order
        if (startDate > endDate) {
          [startDate, endDate] = [endDate, startDate];
        }

        setSelectedRanges([
          ...selectedRanges,
          { start: startDate, end: endDate },
        ]);
        setTempRange({ start: null, end: null });
      }
    }
  };

  const removeDate = (indexToRemove) => {
    const updatedRanges = [...selectedRanges];
    updatedRanges.splice(indexToRemove, 1);
    setSelectedRanges(updatedRanges);
  };

  // Format selected dates for display
  const formatSelectedDates = () => {
    const sortedRanges = [...selectedRanges].sort(
      (a, b) => a.start.getTime() - b.start.getTime()
    );
    const formattedRanges = [];

    sortedRanges.forEach((range) => {
      if (range.start.getTime() === range.end.getTime()) {
        // Single day
        formattedRanges.push(formatDate(range.start));
      } else {
        // Range of days
        formattedRanges.push(
          `${formatDate(range.start)} - ${formatDate(range.end)}`
        );
      }
    });

    return formattedRanges;
  };

  // Render calendar days
  const renderCalendarDays = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const days = [];
    const today = new Date();

    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-16 h-8" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );

      const isSelected = isDateSelected(currentDate);
      const isToday = currentDate.toDateString() === today.toDateString();
      const isPastDate = currentDate < today;

      days.push(
        <button
          key={day}
          onClick={() => !isPastDate && handleDateSelect(day)}
          className={`
            w-8 h-8 flex items-center justify-center focus:outline focus:outline-1 focus:outline-blue-400 rounded-full text-sm
            transition-all duration-200  
            ${isSelected ? "bg-navy-900 text-white" : "hover:bg-gray-100"}
            ${isToday ? "border-2 border-navy-900" : ""}
            ${isPastDate ? "text-gray-400 cursor-not-allowed" : ""}
          `}
          disabled={isPastDate}
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
    "Extra Luggage",
    "Auto Parking",
  ];

  return (
    <div className="flex gap-10 bg-[#F8F8FF]">
      <div className="mx-auto p-8 md:w-2/3 w-full bg-white rounded-2xl shadow-sm text-base">
        {/* Progress Bar */}
        <div className="flex items-center justify-center">
          <div className="w-3/5 border-b-4 border-[#00113D] mr-2"></div>
          <div className="w-2/5 border-b-4 border-blue-200"></div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col w-1/2 items-start">
            <p className="text-xl text-gray-800 my-4 font-medium text-center mb-4">
              Steps 3 of 5
            </p>
          </div>
        </div>

        {/* Car Features Section */}
        <section className="mb-12">
          <h1 className="text-3xl font-semibold mt-8">Car Features</h1>
          <p className="text-gray-600 text-base mt-2 mb-6">
            Please enter your car's basic information below
          </p>

          {/* Search Features Input */}
          <div className="relative items-center justify-center flex mb-6">
            <input
              type="text"
              className="w-full p-2 border rounded-lg pr-8 text-base"
              placeholder="Search features"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute right-4 top-3 text-gray-400 text-base" />

            {searchTerm && (
              <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg">
                {filteredFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="p-4 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => addFeature(feature)}
                  >
                    {feature}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Features */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {selectedFeatures.map((feature) => (
              <span
                key={feature}
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full flex items-center gap-2 text-sm"
              >
                {feature}
                <FaTimes
                  className="cursor-pointer"
                  size={12}
                  onClick={() => removeFeature(feature)}
                />
              </span>
            ))}
          </div>

          {/* Suggestions */}
          <div className="mt-6">
            <p className="text-gray-600 mb-3 text-lg">Suggestions</p>
            <div className="flex flex-wrap gap-3">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="border rounded-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
                  onClick={() => addFeature(suggestion)}
                >
                  <span>+</span> {suggestion}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Car Availability Section */}
        <section className="my-8">
          <h2 className="text-3xl font-semibold my-8">Car Availability</h2>

          {/* Advance Notice Period */}
          <div className="mb-8 text-xs">
            <h3 className="text-lg font-semibold mb-3">
              Advance Notice Period
            </h3>
            <p className="text-gray-600 text-base mb-3">
              How long in advance do you need to be notified before a trip
              starts
            </p>
            <select
              className="md:w-full w-4/6 p-2 border rounded-lg text-sm"
              value={advanceNotice}
              onChange={(e) => setAdvanceNotice(e.target.value)}
            >
              <option className="w-2/3" value="">
                Set period duration
              </option>
              {noticePeriods.map((period) => (
                <option className="w-2/3" key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>

          {/* Available Dates */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">
              Set Car Availability Dates
            </h3>
            <p className="text-gray-600 text-base mb-3">
              Select multiple dates to set your car's available rent dates
            </p>

            <button
              className="w-full p-2 border rounded-lg text-left text-sm flex justify-between items-center"
              onClick={() => setShowCalendar(true)}
            >
              <span>
                {selectedRanges.length
                  ? `${selectedRanges.length} range(s) selected`
                  : "Select available dates"}
              </span>
              <FiEdit2 className="text-sm" />
            </button>

            {/* Selected Dates Display */}
            {selectedRanges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {formatSelectedDates().map((date, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm flex items-center gap-2"
                  >
                    {date}
                    <FaTimes
                      className="cursor-pointer"
                      onClick={() => removeDate(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Calendar Modal */}
          <CalendarModal
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            renderCalendarDays={renderCalendarDays}
            daysOfWeek={daysOfWeek}
            months={months}
          />

          {/* Instant Booking Toggle */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className={`w-12 h-6 rounded-full p-1 cursor-pointer flex items-center transition-colors duration-300 ${
                instantBooking ? "bg-sky-950" : "bg-gray-300"
              }`}
              onClick={() => setInstantBooking(!instantBooking)}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                  instantBooking ? "transform translate-x-6" : ""
                }`}
              />
            </div>
            <span className="text-base">Instant booking</span>
          </div>

          {/* Pricing Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Pricing</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-800">
                When inputting a price please be aware there will be a price
                deduction on the price you will be inputting
              </p>
            </div>
            <p className="text-gray-600 text-base mb-3">
              Set daily price for your car
            </p>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <span className="px-3 font-semibold text-gray-700 text-sm">
                ETB
              </span>
              <input
                type="number"
                className="w-full p-2 text-sm outline-none"
                placeholder="Set Daily car rent price"
                value={dailyPrice}
                onChange={(e) => setDailyPrice(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Navigation Buttons */}
        <div className="flex md:flex-row mt-4 gap-4 flex-col justify-between">
          <button
            onClick={prevStep}
            className="px-8 py-3 border border-gray-300 rounded-full text-sm"
          >
            Back
          </button>
          <button
            onClick={nextStep}
            className="px-8 py-3 bg-navy-900 text-white rounded-full text-sm"
          >
            Continue
          </button>
        </div>
      </div>
      <div className="p-8 w-1/4 md:flex hidden text-sm bg-blue-100 py-6 h-fit">
        Make sure to upload all documents necessary to validate that you have
        ownership of the rented car
      </div>
    </div>
  );
};

export default Step3;
