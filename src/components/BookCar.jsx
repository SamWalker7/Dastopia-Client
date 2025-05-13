import { useState } from "react";
import BackgroundImage from "../images/book-car/book-bg.png";
import { useNavigate } from "react-router-dom";
function BookCar() {
  const [pickUpLocation, setPickUpLocation] = useState(""); // You might want to add location selection
  const [dropOffLocation, setDropOffLocation] = useState(""); // You might want to add location selection
  const [pickUp, setPickUp] = useState("");
  const [dropOff, setDropOff] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const confirmBooking = () => {
    const currentDate = new Date().toISOString().split("T")[0];

    if (!pickUp || !dropOff) {
      setError("Pick-up and drop-off dates are required!");
      return;
    }

    if (pickUp < currentDate) {
      setError("Pick-up date cannot be before the current date!");
      return;
    }

    if (pickUp >= dropOff) {
      setError("Pick-up date should be before drop-off date!");
      return;
    }

    if (dropOff <= currentDate) {
      setError("Drop-off date cannot be on or before the current date!");
      return;
    }

    setError(""); // Clear any previous error

    navigate(`/search?pickUp=${pickUp}&dropOff=${dropOff}`);
  };

  const handlePick = (e) => setPickUp(e.target.value);
  const handleDrop = (e) => setDropOff(e.target.value);
  const handleRedirect = () => {
    navigate("/search");
  };
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
            className="  relative h-fit md:justify-start justify-center py-8 md:py-4 w-fit md:w-fit px-6 md:items-start items-center rounded-lg bg-[#FAF9FE] "
            style={{
              backgroundImage: `url(${BackgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex">
              {error && (
                <div
                  className="text-sm"
                  style={{ color: "red", marginBottom: "10px" }}
                >
                  {error}
                </div>
              )}
              <form className="flex flex-col md:flex-row gap-3 justify-center md:items-center w-full">
                <div className=" flex flex-col md:flex-row md:space-x-4 gap-3">
                  <div className="relative inline-block my-3 text-xs w-full md:w-[200px]">
                    <label
                      htmlFor="pickUpDate"
                      className="absolute -top-2 left-3 text-xs bg-white px-1 text-gray-500"
                    >
                      Pick-up Date <b>*</b>
                    </label>
                    <input
                      id="pickUpDate"
                      value={pickUp}
                      onChange={handlePick}
                      type="date"
                      min={currentDate}
                      className="border border-gray-400 w-full p-3 py-2 bg-white text-gray-500 rounded-md hover:bg-gray-100 focus:outline focus:outline-1 focus:outline-blue-400"
                    />
                  </div>
                  <div className="relative inline-block my-3 text-xs w-full md:w-[200px]">
                    <label
                      htmlFor="dropOffDate"
                      className="absolute -top-2 left-3 text-xs bg-white px-1 text-gray-500"
                    >
                      Drop-off Date <b>*</b>
                    </label>
                    <input
                      id="dropOffDate"
                      value={dropOff}
                      onChange={handleDrop}
                      type="date"
                      min={pickUp || currentDate}
                      disabled={!pickUp}
                      className="border border-gray-400 w-full p-3 py-2 bg-white text-gray-500 rounded-md hover:bg-gray-100 focus:outline focus:outline-1 focus:outline-blue-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
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
