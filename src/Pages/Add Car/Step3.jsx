import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { FiEdit2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useVehicleFormStore from "../../store/useVehicleFormStore";

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

  // Create a list of month-year options for the select dropdown
  const monthYearOptions = [];
  const D = new Date();
  D.setDate(1); // Start from the first day of the current month
  for (let i = 0; i < 24; i++) {
    // Generate options for the next 24 months
    monthYearOptions.push(new Date(D.getFullYear(), D.getMonth() + i));
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-fit mx-4">
        <div className="flex items-center justify-between mb-6">
          <select
            value={`${
              months[currentMonth.getMonth()]
            } ${currentMonth.getFullYear()}`}
            onChange={(e) => {
              const [monthStr, yearStr] = e.target.value.split(" ");
              setCurrentMonth(
                new Date(parseInt(yearStr), months.indexOf(monthStr))
              );
            }}
            className="text-base font-medium focus:outline-none bg-transparent border border-gray-300 rounded-md px-2 py-1"
          >
            {monthYearOptions.map((dateOption) => {
              const monthName = months[dateOption.getMonth()];
              const year = dateOption.getFullYear();
              const optionValue = `${monthName} ${year}`;
              return (
                <option key={optionValue} value={optionValue}>
                  {optionValue}
                </option>
              );
            })}
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
              className="w-8 h-8 flex items-center justify-center text-gray-600 text-sm font-semibold"
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
            className="px-6 py-3 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-md"
            onClick={() => setShowCalendar(false)}
          >
            Cancel
          </button>
          <button
            className="px-6 py-3 text-blue-600 text-sm font-medium hover:bg-blue-50 rounded-md"
            onClick={() => {
              // Potentially finalize any temp selection if needed, though current logic updates selectedRanges directly
              setShowCalendar(false);
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const Step3 = ({ nextStep, prevStep }) => {
  const { vehicleData, updateVehicleData } = useVehicleFormStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [tempRange, setTempRange] = useState({ start: null, end: null });
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [selectedRanges, setSelectedRanges] = useState(() => {
    try {
      return vehicleData.calendar
        ? JSON.parse(vehicleData.calendar).map((range) => ({
            start: new Date(range.start),
            end: new Date(range.end),
          }))
        : [];
    } catch (e) {
      console.error("Error parsing calendar:", e);
      return [];
    }
  });

  useEffect(() => {
    const validRanges = selectedRanges.filter(
      (range) =>
        range.start instanceof Date &&
        range.end instanceof Date &&
        !isNaN(range.start) &&
        !isNaN(range.end)
    );

    const calendarString = JSON.stringify(
      validRanges.map((range) => ({
        start: range.start.toISOString(),
        end: range.end.toISOString(),
      }))
    );

    updateVehicleData({ calendar: calendarString });
  }, [selectedRanges, updateVehicleData]);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
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

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDay: firstDay.getDay() };
  };

  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      return "Invalid Date";
    }
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
    // Prevent selection of past dates (already handled by disabled, but good for direct calls)
    if (selectedDate < new Date(new Date().setHours(0, 0, 0, 0))) return;

    let rangeIndex = -1;
    let targetRange = null;

    selectedRanges.forEach((range, index) => {
      const start = range.start.getTime();
      const end = range.end.getTime();
      if (selectedDate.getTime() >= start && selectedDate.getTime() <= end) {
        rangeIndex = index;
        targetRange = range;
      }
    });

    if (rangeIndex !== -1 && targetRange) {
      // Check targetRange is not null
      const newRanges = [];
      const splitDateStart = new Date(selectedDate); // For first new range end
      const splitDateEnd = new Date(selectedDate); // For second new range start

      if (targetRange.start.getTime() < selectedDate.getTime()) {
        newRanges.push({
          start: new Date(targetRange.start),
          end: new Date(splitDateStart.setDate(splitDateStart.getDate() - 1)),
        });
      }

      if (selectedDate.getTime() < targetRange.end.getTime()) {
        newRanges.push({
          start: new Date(splitDateEnd.setDate(splitDateEnd.getDate() + 1)),
          end: new Date(targetRange.end),
        });
      }

      const updatedRanges = [...selectedRanges];
      updatedRanges.splice(
        rangeIndex,
        1,
        ...newRanges.filter((r) => r.start <= r.end)
      ); // ensure valid ranges
      setSelectedRanges(updatedRanges);
    } else {
      if (!tempRange.start) {
        setTempRange({ start: selectedDate, end: null });
      } else {
        let [startDate, endDate] = [tempRange.start, selectedDate];
        if (startDate > endDate) [startDate, endDate] = [endDate, startDate];

        setSelectedRanges([
          ...selectedRanges,
          { start: new Date(startDate), end: new Date(endDate) },
        ]);
        setTempRange({ start: null, end: null });
      }
    }
  };

  const removeDateRange = (indexToRemove) => {
    setSelectedRanges((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const formatSelectedDates = () => {
    return selectedRanges.map((range) =>
      range.start.toDateString() === range.end.toDateString()
        ? formatDate(range.start)
        : `${formatDate(range.start)} - ${formatDate(range.end)}`
    );
  };

  const renderCalendarDays = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to the start of the day

    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />); // Adjusted width to match buttons
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      currentDate.setHours(0, 0, 0, 0); // Normalize current date

      const isPastDate = currentDate < today;
      const isCurrentlySelected = isDateSelected(currentDate);
      const isTempStart =
        tempRange.start && currentDate.getTime() === tempRange.start.getTime();

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`
            w-8 h-8 flex items-center justify-center focus:outline focus:outline-1 
            focus:outline-blue-400 rounded-full text-sm transition-all duration-200
            ${isCurrentlySelected ? "bg-navy-900 text-white" : ""}
            ${isTempStart ? "bg-blue-300 text-black ring-2 ring-blue-500" : ""}
            ${
              !isCurrentlySelected && !isTempStart && !isPastDate
                ? "hover:bg-gray-100"
                : ""
            }
            ${
              currentDate.toDateString() === today.toDateString() &&
              !isCurrentlySelected &&
              !isTempStart
                ? "border-2 border-navy-900"
                : ""
            }
            ${isPastDate ? "text-gray-400 cursor-not-allowed" : "text-gray-700"}
          `}
          disabled={isPastDate}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  const addFeature = (feature) => {
    if (!vehicleData.carFeatures?.includes(feature)) {
      updateVehicleData({
        carFeatures: [...(vehicleData.carFeatures || []), feature],
      });
    }
    setSearchTerm("");
  };

  const removeFeature = (feature) => {
    updateVehicleData({
      carFeatures: vehicleData.carFeatures?.filter((f) => f !== feature) || [],
    });
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

  // --- Validation Logic ---
  const isAdvanceNoticePeriodFilled =
    vehicleData.advanceNoticePeriod &&
    vehicleData.advanceNoticePeriod.trim() !== "";

  const isAvailabilityDatesFilled = selectedRanges.length > 0;

  const isInstantBookingFilled =
    typeof vehicleData.instantBooking === "boolean";

  const isPriceFilled =
    vehicleData.price !== undefined &&
    vehicleData.price !== null &&
    vehicleData.price.toString().trim() !== "" &&
    !isNaN(parseFloat(vehicleData.price)) &&
    parseFloat(vehicleData.price) >= 0; // Price can be 0, but must be a number

  const allRequiredFieldsFilled =
    isAdvanceNoticePeriodFilled &&
    isAvailabilityDatesFilled &&
    isInstantBookingFilled &&
    isPriceFilled;
  // --- End Validation Logic ---

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
              Step 3 of 5
            </p>
          </div>
        </div>

        {/* Car Features Section */}
        <section className="mb-12">
          <h1 className="text-3xl font-semibold mt-8">Car Features</h1>
          <p className="text-gray-600 text-base mt-2 mb-6">
            Please enter your car's basic information below
          </p>
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
              <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg top-full">
                {filteredFeatures.length > 0 ? (
                  filteredFeatures.map((feature) => (
                    <div
                      key={feature}
                      className="p-4 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => addFeature(feature)}
                    >
                      {feature}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-sm text-gray-500">
                    No features found
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {vehicleData.carFeatures?.map((feature) => (
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
          <div className="mt-6">
            <p className="text-gray-600 mb-3 text-lg">Suggestions</p>
            <div className="flex flex-wrap gap-3">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  className="border rounded-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
                  onClick={() => addFeature(suggestion)}
                  disabled={vehicleData.carFeatures?.includes(suggestion)}
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
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">
              Advance Notice Period
            </h3>
            <p className="text-gray-600 text-base mb-3">
              How long in advance do you need to be notified before a trip
              starts
            </p>
            <select
              className="md:w-full w-4/6 p-2 border rounded-lg text-sm"
              value={vehicleData.advanceNoticePeriod || ""}
              onChange={(e) =>
                updateVehicleData({ advanceNoticePeriod: e.target.value })
              }
            >
              <option value="">Set period duration</option>
              {noticePeriods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
            {!isAdvanceNoticePeriodFilled && (
              <p className="text-red-500 text-xs mt-1">
                This field is required.
              </p>
            )}
          </div>

          {/* Set Car Availability Dates */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">
              Set Car Availability Dates
            </h3>
            <p className="text-gray-600 text-base mb-3">
              Select multiple dates or date ranges for your car's availability.
            </p>
            <button
              className="w-full p-2 border rounded-lg text-left text-sm flex justify-between items-center"
              onClick={() => setShowCalendar(true)}
            >
              <span>
                {selectedRanges.length > 0
                  ? `${selectedRanges.length} range(s) selected`
                  : "Select available dates"}
              </span>
              <FiEdit2 className="text-sm" />
            </button>
            {selectedRanges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {formatSelectedDates().map((dateString, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm flex items-center gap-2"
                  >
                    {dateString}
                    <FaTimes
                      className="cursor-pointer"
                      onClick={() => removeDateRange(index)}
                    />
                  </div>
                ))}
              </div>
            )}
            {!isAvailabilityDatesFilled && (
              <p className="text-red-500 text-xs mt-1">
                Please select at least one date or range.
              </p>
            )}
          </div>

          <CalendarModal
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            renderCalendarDays={renderCalendarDays}
            daysOfWeek={daysOfWeek}
            months={months}
          />

          {/* Instant Booking */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className={`w-12 h-6 rounded-full p-1 cursor-pointer flex items-center transition-colors duration-300 ${
                vehicleData.instantBooking ? "bg-sky-950" : "bg-gray-300"
              }`}
              onClick={() =>
                updateVehicleData({
                  instantBooking: !vehicleData.instantBooking,
                })
              }
              role="switch"
              aria-checked={!!vehicleData.instantBooking}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  updateVehicleData({
                    instantBooking: !vehicleData.instantBooking,
                  });
              }}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                  vehicleData.instantBooking ? "transform translate-x-6" : ""
                }`}
              />
            </div>
            <span
              className="text-base"
              onClick={() =>
                updateVehicleData({
                  instantBooking: !vehicleData.instantBooking,
                })
              }
              style={{ cursor: "pointer" }}
            >
              Instant booking
            </span>
          </div>
          {/* This field might not need an error message if a default is assumed, 
               but if undefined is the initial and not allowed:
            {!isInstantBookingFilled && (
                 <p className="text-red-500 text-xs mt-1 -translate-y-6">Please specify instant booking preference.</p>
            )} */}

          {/* Pricing */}
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
              <span className="px-3 font-semibold text-gray-700 text-sm bg-gray-50 py-2.5">
                ETB
              </span>
              <input
                type="number"
                min="0"
                className="w-full p-2 text-sm outline-none"
                placeholder="Set Daily car rent price"
                value={
                  vehicleData.price === null || vehicleData.price === undefined
                    ? ""
                    : vehicleData.price
                }
                onChange={(e) => {
                  const val = e.target.value;
                  updateVehicleData({
                    price: val === "" ? "" : parseFloat(val),
                  });
                }}
              />
            </div>
            {!isPriceFilled && (
              <p className="text-red-500 text-xs mt-1">
                Please enter a valid price.
              </p>
            )}
          </div>
        </section>

        {/* Navigation Buttons */}
        <div className="flex md:flex-row mt-4 gap-4 flex-col justify-between">
          <button
            onClick={prevStep}
            className="px-8 py-3 border border-gray-300 rounded-full text-sm hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={nextStep}
            className={`px-8 py-3 rounded-full text-sm text-white ${
              allRequiredFieldsFilled
                ? "bg-navy-900 hover:bg-navy-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!allRequiredFieldsFilled}
          >
            Continue
          </button>
        </div>
      </div>

      {/* Side Panel */}
      <div className="p-8 w-1/4 md:flex hidden text-sm bg-blue-100 py-6 h-fit rounded-lg shadow-sm">
        Make sure to upload all documents necessary to validate that you have
        ownership of the rented car. Ensure all availability and pricing details
        are accurate.
      </div>
    </div>
  );
};

export default Step3;
