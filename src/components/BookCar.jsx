import { useState } from "react";
import BackgroundImage from "../images/book-car/book-bg.png";
function BookCar() {
  const [pickUp, setPickUp] = useState("");
  const [dropOff, setDropOff] = useState("");
  const [pickTime, setPickTime] = useState("");
  const [dropTime, setDropTime] = useState("");
  const [error, setError] = useState("");

  const confirmBooking = () => {
    const currentDate = new Date().toISOString().split("T")[0];

    if (!pickUp || !dropOff || !pickTime || !dropTime) {
      setError("All fields required!");
      return;
    }

    if (pickTime < currentDate) {
      setError("Pick-up time cannot be before the current date!");
      return;
    }

    if (pickTime >= dropTime) {
      setError("Pick-up time should be before drop-off time!");
      return;
    }

    if (dropTime <= currentDate) {
      setError("Drop-off time cannot be on or before the current date!");
      return;
    }

    setError(""); // Clear any previous error

    const queryParams = new URLSearchParams({
      pickUp,
      dropOff,
      pickTime,
      dropTime,
    }).toString();

    window.location.href = `/search?${queryParams}`;
  };

  const handlePick = (e) => setPickUp(e.target.value);
  const handleDrop = (e) => setDropOff(e.target.value);
  const handlePickTime = (e) => {
    setPickTime(e.target.value);
    if (dropTime && e.target.value >= dropTime) {
      setDropTime("");
    }
  };
  const handleDropTime = (e) => setDropTime(e.target.value);

  const currentDate = new Date().toISOString().split("T")[0];
  const locations = ["Addis Ababa", "Adama", "Hawassa", "Bahir Dar"];
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  return (
    <>
      <section>
        <div className="">
          <div
            className="  relative h-52 justify-center pt-10 w-[800px] px-10 items-center rounded-lg bg-[#FAF9FE] "
            style={{
              backgroundImage: `url(${BackgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex">
              {/* <h2>Book a car</h2> */}
              {error && (
                <div style={{ color: "red", marginBottom: "10px" }}>
                  {error}
                </div>
              )}
              <form className="flex">
                <div className=" flex flex-col md:flex-row space-x-8 space-y-2">
                  <div className="relative inline-block my-3 text-lg w-[200px] ">
                    <label className="absolute -top-2 left-3 text-sm bg-white px-1  text-gray-500">
                      Pick-up Location <b>*</b>
                    </label>
                    <select
                      className="border  border-gray-400 flex justify-between w-full p-3 py-4 bg-white text-gray-500 rounded-md hover:bg-gray-100 focus:outline focus:outline-1 focus:outline-blue-400 "
                      value={pickUp}
                      onChange={handlePick}
                    >
                      <option value="">Select pick up location</option>
                      {locations.map((location, index) => (
                        <option
                          className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md max-h-60 overflow-y-auto z-10"
                          key={index}
                          value={location.toLowerCase().replace(/\s+/g, "-")}
                        >
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* <div className="box-form__car-type">
                  <label>
                    <i className="fa-solid fa-location-dot"></i> &nbsp; Drop-off{" "}
                    <b>*</b>
                  </label>
                  <select value={dropOff} onChange={handleDrop}>
                    <option>Select drop off location</option>
                    <option>Addis Ababa</option>
                  </select>
                </div> */}

                  <div className="relative inline-block my-3 text-lg w-[200px]">
                    <label
                      htmlFor="picktime"
                      className="absolute -top-2 left-3 text-sm bg-white px-1 text-gray-500"
                    >
                      Pick-up <b>*</b>
                    </label>
                    <input
                      id="picktime"
                      value={pickTime}
                      onChange={handlePickTime}
                      type="date"
                      min={currentDate}
                      className="border border-gray-400 w-full p-3 py-4 bg-white text-gray-500 rounded-md hover:bg-gray-100 focus:outline focus:outline-1 focus:outline-blue-400"
                    />
                  </div>
                  <div className="relative inline-block my-3 text-lg w-[200px]">
                    <label
                      htmlFor="droptime"
                      className="absolute -top-2 left-3 text-sm bg-white px-1 text-gray-500"
                    >
                      Drop-off <b>*</b>
                    </label>
                    <input
                      id="droptime"
                      value={dropTime}
                      onChange={handleDropTime}
                      type="date"
                      min={pickTime || currentDate}
                      disabled={!pickTime}
                      className="border border-gray-400 w-full p-3 py-4 bg-white text-gray-500 rounded-md hover:bg-gray-100 focus:outline focus:outline-1 focus:outline-blue-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <button
                  className=" bg-blue-950 text-lg text-white rounded-full px-8 my-4 ml-16 "
                  type="button"
                  onClick={confirmBooking}
                >
                  Search
                </button>
              </form>
            </div>
            <div className="relative inline-block my-3 text-lg w-full">
              <label className="flex items-center space-x-3 text-gray-500">
                <input
                  type="checkbox"
                  id="agree"
                  className="form-checkbox h-5 w-5  border-gray-400 rounded-md focus:outline-blue-400"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <span className="text-sm text-gray-500">
                  Drop off in a different location
                </span>
              </label>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BookCar;
