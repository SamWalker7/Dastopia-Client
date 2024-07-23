import { useState } from "react";

function CarBox({ data, carID }) {


  const [carLoad, setCarLoad] = useState(data.imageLoading);
  return (
    <>

      <div className="box-cars">
        {/* car */}
        <div className="pick-car">
          {carLoad && <span className="loader"></span>}
          <img
            style={{ display: carLoad ? "none" : "block" }}
            src={data.images[0]}
            alt="car_img"
            onLoad={() => setCarLoad(false)}
          />
        </div>
        {/* description */}
        <div className="pick-description">
          <div className="pick-description__price">
            <span>ETB {data.price}</span>/ Day
          </div>
          <div className="pick-description__table">
            <div className="pick-description__table__col">
              <span>Model</span>
              <span>{data.model}</span>
            </div>

            <div className="pick-description__table__col">
              <span>Make</span>
              <span>{data.make}</span>
            </div>

            <div className="pick-description__table__col">
              <span>Year</span>
              <span>{data.year}</span>
            </div>

            <div className="pick-description__table__col">
              <span>Doors</span>
              <span>{data.doors}</span>
            </div>

            <div className="pick-description__table__col">
              <span>Color</span>
              <span>{data.color}</span>
            </div>

            <div className="pick-description__table__col">
              <span>Transmission</span>
              <span>{data.transmission}</span>
            </div>

            <div className="pick-description__table__col">
              <span>Fuel</span>
              <span>{data.fuelType}</span>
            </div>
          </div>
          {/* btn cta */}
          <a className="cta-btn" href="#booking-section">
            Reserve Now
          </a>
        </div>
      </div>

    </>
  );
}

export default CarBox;
