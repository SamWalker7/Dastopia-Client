import { useState } from "react";

function BookCar() {
  const [pickUp, setPickUp] = useState("");
  const [dropOff, setDropOff] = useState("");
  const [pickTime, setPickTime] = useState("");
  const [dropTime, setDropTime] = useState("");

  const confirmBooking = () => {
    if (!pickUp || !dropOff || !pickTime || !dropTime) {
      document.querySelector(".error-message").style.display = "block";
      return;
    } else {
      const queryParams = new URLSearchParams({
        pickUp,
        dropOff,
        pickTime,
        dropTime,
      }).toString();

      window.location.href = `/search?${queryParams}`;
    }
  };

  const handlePick = (e) => setPickUp(e.target.value);
  const handleDrop = (e) => setDropOff(e.target.value);
  const handlePickTime = (e) => setPickTime(e.target.value);
  const handleDropTime = (e) => setDropTime(e.target.value);

  return (
    <>
      <section id="booking-section" className="book-section">
        <div className="container">
          <div className="book-content">
            <div className="book-content__box">
              <h2>Book a car</h2>

              <p className="error-message">
                All fields required! <i className="fa-solid fa-xmark"></i>
              </p>

              <form className="box-form">
                <div className="box-form__car-type">
                  <label>
                    <i className="fa-solid fa-location-dot"></i> &nbsp; Pick-up
                    Location <b>*</b>
                  </label>
                  <select value={pickUp} onChange={handlePick}>
                    <option>Select pick up location</option>
                    <option>Addis Ababa</option>
                  </select>
                </div>

                <div className="box-form__car-type">
                  <label>
                    <i className="fa-solid fa-location-dot"></i> &nbsp; Drop-off{" "}
                    <b>*</b>
                  </label>
                  <select value={dropOff} onChange={handleDrop}>
                    <option>Select drop off location</option>
                    <option>Addis Ababa</option>
                  </select>
                </div>

                <div className="box-form__car-time">
                  <label htmlFor="picktime">
                    <i className="fa-regular fa-calendar-days "></i> &nbsp;
                    Pick-up <b>*</b>
                  </label>
                  <input
                    id="picktime"
                    value={pickTime}
                    onChange={handlePickTime}
                    type="date"
                  ></input>
                </div>

                <div className="box-form__car-time">
                  <label htmlFor="droptime">
                    <i className="fa-regular fa-calendar-days "></i> &nbsp;
                    Drop-off <b>*</b>
                  </label>
                  <input
                    id="droptime"
                    value={dropTime}
                    onChange={handleDropTime}
                    type="date"
                  ></input>
                </div>

                <button type="button" onClick={confirmBooking}>
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
