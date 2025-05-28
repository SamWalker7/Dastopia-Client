import { useState } from "react";
import BackgroundImage from "../images/book-car/book-bg.png"; // Assuming this path is correct
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import default styles

// Optional: If you want to customize the calendar icon or input appearance
// import { CalendarDaysIcon } from "@heroicons/react/24/outline"; // Example using heroicons

function BookCar() {
  // const [pickUpLocation, setPickUpLocation] = useState(""); // Keep for location selection
  // const [dropOffLocation, setDropOffLocation] = useState(""); // Keep for location selection

  // State for the date range
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Helper to format Date objects to "YYYY-MM-DD" string
  const formatDate = (date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const confirmBooking = () => {
    const currentDateStr = new Date().toISOString().split("T")[0];
    const pickUpStr = formatDate(startDate);
    const dropOffStr = formatDate(endDate);

    if (!startDate || !endDate) {
      setError("Pick-up and drop-off dates are required!");
      return;
    }

    // No need to check if pickUpStr < currentDateStr as minDate on DatePicker handles this
    // No need to check if dropOffStr <= currentDateStr (implicitly handled by range logic and minDate)

    if (pickUpStr >= dropOffStr) {
      // This check is still valid, though DatePicker usually prevents selecting end before start
      setError("Pick-up date should be before drop-off date!");
      return;
    }

    setError(""); // Clear any previous error

    navigate(`/search?pickUp=${pickUpStr}&dropOff=${dropOffStr}`);
  };

  // const handleRedirect = () => { // This function doesn't seem to be used directly in the form
  //   navigate("/search");
  // };

  // const locations = ["Addis Ababa", "Adama", "Hawassa", "Bahir Dar"]; // Keep if you implement location dropdowns
  // const [isChecked, setIsChecked] = useState(false); // Keep if used elsewhere

  // const handleCheckboxChange = (e) => { // Keep if used elsewhere
  //   setIsChecked(e.target.checked);
  // };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      setError(""); // Clear error when both dates are selected
    }
  };

  const today = new Date();

  return (
    <>
      <section>
        <div className="">
          <div
            className="relative h-fit md:justify-start justify-center py-8 md:py-4 w-full md:w-fit px-6 md:items-start items-center rounded-lg bg-[#FAF9FE] "
            style={{
              backgroundImage: `url(${BackgroundImage})`, // Make sure this image path is correct
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex flex-col">
              {" "}
              {/* Changed to flex-col for error message layout */}
              {error && (
                <div
                  className="text-sm text-red-600 mb-3 p-2 bg-red-100 border border-red-400 rounded"
                  role="alert"
                >
                  {error}
                </div>
              )}
              <form className="flex flex-col md:flex-row gap-3 justify-center md:items-center w-full">
                <div className="flex flex-col md:flex-row md:space-x-4 gap-3">
                  <div className="relative inline-block my-3 text-xs w-full md:w-[250px]">
                    {" "}
                    {/* Increased width for range picker */}
                    <label
                      htmlFor="dateRange"
                      className="absolute -top-2 left-3 text-xs bg-[#FAF9FE] px-1 text-gray-500 z-10"
                    >
                      Pick-up & Drop-off Date <b>*</b>
                    </label>
                    <DatePicker
                      id="dateRange"
                      selected={startDate}
                      onChange={handleDateChange}
                      startDate={startDate}
                      endDate={endDate}
                      minDate={today}
                      selectsRange
                      isClearable={true}
                      placeholderText="Select date range"
                      dateFormat="yyyy-MM-dd"
                      className="border border-gray-400 w-full p-3 py-2 bg-white text-gray-500 rounded-md hover:bg-gray-100 focus:outline focus:outline-1 focus:outline-blue-400"
                      wrapperClassName="w-full" // Ensure DatePicker takes full width of its container
                    />
                  </div>
                </div>
                <button
                  className=" bg-blue-950 text-xs text-white rounded-full px-8 my-3 py-2 lg:ml-10 "
                  type="button"
                  onClick={confirmBooking}
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BookCar;
