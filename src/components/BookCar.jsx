import { useState } from "react";
import BackgroundImage from "../images/book-car/book-bg.png"; // Assuming this path is correct
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function BookCar() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const today = new Date();

  // Helper to format Date objects to "YYYY-MM-DD" string for navigation
  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // This function will be called by the "From" (Pick-up) DatePicker
  // when a range is selected or changed.
  const handleRangeChange = (dates) => {
    const [start, end] = dates; // dates is an array [startDate, endDate]
    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      if (start >= end) {
        // This case should ideally be prevented by react-datepicker's range logic
        // but good to have a fallback or ensure error is cleared correctly.
        setError("Pick-up date must be before drop-off date!");
      } else {
        setError(""); // Clear error when a valid range is selected
      }
    } else if (!start && !end) {
      // If range is cleared
      setError("");
    }
    // If only start is selected (mid-selection), do nothing with error yet
  };

  const confirmBooking = () => {
    if (!startDate || !endDate) {
      setError("Pick-up and drop-off dates are required!");
      return;
    }

    const pickUpStr = formatDate(startDate);
    const dropOffStr = formatDate(endDate);

    // The DatePicker's minDate and range selection logic should prevent most invalid date scenarios
    if (new Date(pickUpStr) >= new Date(dropOffStr)) {
      // Double check, though DatePicker should handle this
      setError("Pick-up date must be before drop-off date!");
      return;
    }

    setError("");
    navigate(`/search?pickUpDate=${pickUpStr}&dropOffDate=${dropOffStr}`);
  };
  const googlePlayBadgeUrl =
    "https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png";
  const googlePlayLink =
    "https://play.google.com/store/apps/details?id=YOUR_APP_ID_HERE";

  return (
    <>
      <section>
        <div className="">
          <div
            className="relative h-fit md:justify-start justify-center py-8 md:py-4 w-full md:w-fit px-6 md:items-start items-center rounded-lg bg-[#FAF9FE]"
            style={{
              backgroundImage: `url(${BackgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex flex-col">
              {error && (
                <div
                  className="text-sm text-red-600 mb-3 p-2 bg-red-100 border border-red-400 rounded"
                  role="alert"
                >
                  {error}
                </div>
              )}
              <form className="flex flex-col md:flex-row md:items-end gap-x-4 gap-y-3 w-full">
                {/* From (Pick-up) Date Picker - This one handles the range selection */}
                <div className="flex flex-col w-full md:flex-1">
                  <label
                    htmlFor="pickUpDateRange"
                    className="block text-xs font-semibold text-gray-700 mb-1"
                  >
                    From <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    id="pickUpDateRange"
                    selected={startDate} // Show the start date in this input
                    onChange={handleRangeChange}
                    startDate={startDate}
                    endDate={endDate}
                    minDate={today}
                    selectsRange // IMPORTANT: Enables range selection
                    isClearable={true}
                    placeholderText="Select Pick-up Date" // Or "Select Date Range"
                    dateFormat="dd/MM/yyyy"
                    className="border border-gray-400 w-full p-3 py-2 bg-white text-gray-500 rounded-md hover:bg-gray-100 focus:outline focus:outline-1 focus:outline-blue-400"
                    wrapperClassName="w-full"
                    autoComplete="off"
                  />
                </div>

                {/* Until (Drop-off) Date Picker - Display only */}
                <div className="flex flex-col w-full md:flex-1">
                  <label
                    htmlFor="dropOffDateDisplay"
                    className="block text-xs font-semibold text-gray-700 mb-1"
                  >
                    Until <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    id="dropOffDateDisplay"
                    selected={endDate} // Display the selected end date
                    // No onChange needed as it's disabled for input
                    dateFormat="dd/MM/yyyy"
                    className="border border-gray-400 w-full p-3 py-2 bg-gray-100 text-gray-500 rounded-md cursor-not-allowed" // Style for disabled
                    wrapperClassName="w-full"
                    disabled // IMPORTANT: Disable direct interaction
                    placeholderText="Drop-off Date"
                    // minDate and other selection props are not relevant here
                    // as it's purely for display and driven by the other picker.
                    autoComplete="off"
                  />
                </div>

                <div className="w-full md:w-auto pt-3 md:pt-0">
                  <button
                    className="bg-blue-950 text-xs text-white rounded-md px-8 py-2.5 w-full md:w-auto h-[42px]"
                    type="button"
                    onClick={confirmBooking}
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
          <a
            href={googlePlayLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              src={googlePlayBadgeUrl}
              alt="Get it on Google Play"
              className="h-20 hover:opacity-90 transition-opacity"
            />
          </a>
        </div>
      </section>
    </>
  );
}

export default BookCar;
