// Imported Packages
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

// Imported Components
import Footer from "../components/Footer";
import HeroPages from "../components/HeroPages";
import VehicleCard from "../components/shared/VehicleCard";

// Imported Images
import CarImg1 from "../images/cars-big/audi-box.png";
import CarImg2 from "../images/cars-big/golf6-box.png";
import CarImg3 from "../images/cars-big/toyota-box.png";
import CarImg4 from "../images/cars-big/bmw-box.png";
import CarImg5 from "../images/cars-big/benz-box.png";
import CarImg6 from "../images/cars-big/passat-box.png";

// Imported Functions
import { getAllVehicles, getDownloadUrl } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { fetchImages, fetchVehicles } from "../store/slices/vehicleSlice";

function Models() {
  const dispatch = useDispatch();

  const vehicles = useSelector((state) => state.vehicle.vehicles);
  const isLoading = useSelector((state) => state.vehicle.loading);
  console.log(vehicles);

  useEffect(() => {
    const loadData = async () => {
      const response = await dispatch(fetchVehicles());
      if (fetchVehicles.fulfilled.match(response)) {
        const vehicles = response.payload;
        vehicles.map(async (vehicle) => {
          await dispatch(fetchImages(vehicle));
        });
      }
    };

    if (vehicles.length < 1) {
      loadData();
    }
    // loadData();
  }, []);

  return (
    <>
      <section
        className="models-section"
        style={{ paddingTop: "100px", textAlign: "center" }}
      >
        {isLoading ? (
          <div
            style={{
              paddingTop: "5rem",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <div className="container">
            <div className="models-div">
              {vehicles.map((vehicle, index) => (
                <VehicleCard vehicle={vehicle} key={vehicle.id} index={index} />
                // <div className="models-div__box">
                //   <div className="models-div__box__img">
                //     <img src={CarImg1} alt="car_img" />
                //     <div className="models-div__box__descr">
                //       <div className="models-div__box__descr__name-price">
                //         <div className="models-div__box__descr__name-price__name">
                //           <p>
                //             {" "}
                //             {vehicle.make} {vehicle.model}{" "}
                //           </p>
                //           <span>
                //             <i className="fa-solid fa-star"></i>
                //             <i className="fa-solid fa-star"></i>
                //             <i className="fa-solid fa-star"></i>
                //             <i className="fa-solid fa-star"></i>
                //             <i className="fa-solid fa-star"></i>
                //           </span>
                //         </div>
                //         <div className="models-div__box__descr__name-price__price">
                //           <h4>ETB 2,500</h4>
                //           <p>per day</p>
                //         </div>
                //       </div>
                //       <div className="models-div__box__descr__name-price__details">
                //         <span>
                //           <i className="fa-solid fa-car-side"></i> &nbsp;{" "}
                //           {vehicle.transmission}
                //         </span>
                //         <span style={{ textAlign: "right" }}>
                //           {vehicle.fuelType} &nbsp;{" "}
                //           <i className="fa-solid fa-car-side"></i>
                //         </span>
                //         <span>
                //           <i className="fa-solid fa-car-side"></i> &nbsp;{" "}
                //           {vehicle.color}
                //         </span>
                //         <span style={{ textAlign: "right" }}>
                //           {vehicle.doors} Doors &nbsp;{" "}
                //           <i className="fa-solid fa-car-side"></i>
                //         </span>
                //       </div>
                //       <div className="models-div__box__descr__name-price__btn">
                //         <Link onClick={() => window.scrollTo(0, 0)} to="/">
                //           Book Car
                //         </Link>
                //       </div>
                //     </div>
                //   </div>
                // </div>
              ))}{" "}
              {/* <div className="models-div__box">
                //{" "}
                <div className="models-div__box__img">
                  // <img src={CarImg2} alt="car_img" />
                  //{" "}
                  <div className="models-div__box__descr">
                    //{" "}
                    <div className="models-div__box__descr__name-price">
                      //{" "}
                      <div className="models-div__box__descr__name-price__name">
                        // <p>Golf 6</p>
                        //{" "}
                        <span>
                          // <i className="fa-solid fa-star"></i>
                          // <i className="fa-solid fa-star"></i>
                          // <i className="fa-solid fa-star"></i>
                          // <i className="fa-solid fa-star"></i>
                          // <i className="fa-solid fa-star"></i>
                          //{" "}
                        </span>
                        //{" "}
                      </div>
                      //{" "}
                      <div className="models-div__box__descr__name-price__price">
                        // <h4>$37</h4>
                        // <p>per day</p>
                        //{" "}
                      </div>
                      //{" "}
                    </div>
                    //{" "}
                    <div className="models-div__box__descr__name-price__details">
                      //{" "}
                      <span>
                        // <i className="fa-solid fa-car-side"></i> &nbsp; VW //{" "}
                      </span>
                      //{" "}
                      <span style={{ textAlign: "right" }}>
                        // 4/5 &nbsp; <i className="fa-solid fa-car-side"></i>
                        //{" "}
                      </span>
                      //{" "}
                      <span>
                        // <i className="fa-solid fa-car-side"></i> &nbsp;
                        Manual //{" "}
                      </span>
                      //{" "}
                      <span style={{ textAlign: "right" }}>
                        // Diesel &nbsp;{" "}
                        <i className="fa-solid fa-car-side"></i>
                        //{" "}
                      </span>
                      //{" "}
                    </div>
                    //{" "}
                    <div className="models-div__box__descr__name-price__btn">
                      //{" "}
                      <Link onClick={() => window.scrollTo(0, 0)} to="/">
                        // Book Ride //{" "}
                      </Link>
                      //{" "}
                    </div>
                    //{" "}
                  </div>
                  //{" "}
                </div>
                //{" "}
              </div> */}
              {/* //{" "} */}
              {/* <div className="models-div__box">
                //{" "}
                <div className="models-div__box__img">
                  // <img src={CarImg3} alt="car_img" />
                  //{" "}
                  <div className="models-div__box__descr">
                    //{" "}
                    <div className="models-div__box__descr__name-price">
                      //{" "}
                      <div className="models-div__box__descr__name-price__name">
                        // <p>Toyota</p>
                        //{" "}
                        <span>
                          // <i className="fa-solid fa-star"></i>
                          // <i className="fa-solid fa-star"></i>
                          // <i className="fa-solid fa-star"></i>
                          // <i className="fa-solid fa-star"></i>
                          // <i className="fa-solid fa-star"></i>
                          //{" "}
                        </span>
                        //{" "}
                      </div>
                      //{" "}
                      <div className="models-div__box__descr__name-price__price">
                        // <h4>$30</h4>
                        // <p>per day</p>
                        //{" "}
                      </div>
                      //{" "}
                    </div>
                    //{" "}
                    <div className="models-div__box__descr__name-price__details">
                      //{" "}
                      <span>
                        // <i className="fa-solid fa-car-side"></i> &nbsp; Camry
                        //{" "}
                      </span>
                      //{" "}
                      <span style={{ textAlign: "right" }}>
                        // 4/5 &nbsp; <i className="fa-solid fa-car-side"></i>
                        //{" "}
                      </span>
                      //{" "}
                      <span>
                        // <i className="fa-solid fa-car-side"></i> &nbsp;
                        Manual //{" "}
                      </span>
                      //{" "}
                      <span style={{ textAlign: "right" }}>
                        // Diesel &nbsp;{" "}
                        <i className="fa-solid fa-car-side"></i>
                        //{" "}
                      </span>
                      //{" "}
                    </div>
                    //{" "}
                    <div className="models-div__box__descr__name-price__btn">
                      //{" "}
                      <Link onClick={() => window.scrollTo(0, 0)} to="/">
                        // Book Ride //{" "}
                      </Link>
                      //{" "}
                    </div>
                    //{" "}
                  </div>
                  //{" "}
                </div>
                //{" "}
              </div> */}
              {/* //{" "} */}
              {/* <div className="models-div__box">
                //{" "}
                <div className="models-div__box__img">
                  // <img src={CarImg4} alt="car_img" />
                  //{" "}
                  <div className="models-div__box__descr">
                    //{" "}
                    <div className="models-div__box__descr__name-price">
                      //{" "}
                      <div className="models-div__box__descr__name-price__name">
                        // <p>BMW 320</p>
                        //{" "}
                        <span>
                          // <i className="fa-solid fa-star"></i>
                          // <i className="fa-solid fa-star"></i>
                          // <i className="fa-solid fa-star"></i>
                          // <i className="fa-solid fa-star"></i>
                          // <i className="fa-solid fa-star"></i>
                          //{" "}
                        </span>
                        //{" "}
                      </div>
                      //{" "}
                      <div className="models-div__box__descr__name-price__price">
                        // <h4>$35</h4>
                        // <p>per day</p>
                        //{" "}
                      </div>
                      //{" "}
                    </div>
                    //{" "}
                    <div className="models-div__box__descr__name-price__details">
                      //{" "}
                      <span>
                        // <i className="fa-solid fa-car-side"></i> &nbsp;
                        ModernLine //{" "}
                      </span>
                      //{" "}
                      <span style={{ textAlign: "right" }}>
                        // 4/5 &nbsp; <i className="fa-solid fa-car-side"></i>
                        //{" "}
                      </span>
                      //{" "}
                      <span>
                        // <i className="fa-solid fa-car-side"></i> &nbsp;
                        Manual //{" "}
                      </span>
                      //{" "}
                      <span style={{ textAlign: "right" }}>
                        // Diesel &nbsp;{" "}
                        <i className="fa-solid fa-car-side"></i>
                        //{" "}
                      </span>
                      //{" "}
                    </div>
                    //{" "}
                    <div className="models-div__box__descr__name-price__btn">
                      //{" "}
                      <Link onClick={() => window.scrollTo(0, 0)} to="/">
                        // Book Ride //{" "}
                      </Link>
                      //{" "}
                    </div>
                    //{" "}
                  </div>
                  //{" "}
                </div>
                //{" "}
              </div> */}
              {/* //{" "} */}
              {/* <div className="models-div__box">
                //{" "}
                <div className="models-div__box__img">
                  // <img src={CarImg5} alt="car_img" />
                  //{" "}
                  <div className="models-div__box__descr">
                    //{" "}
                    <div className="models-div__box__descr__name-price">
                      //{" "}
                      <div className="models-div__box__descr__name-price__name">
                        // <p>Mercedes</p>
                        //{" "}
                        <span>
                          // <i className="fa-solid fa-star"></i>
                          // <i className="fa-solid fa-star"></i>
                          // <i className="fa-solid fa-star"></i>
                          // <i className="fa-solid fa-star"></i>
                          // <i className="fa-solid fa-star"></i>
                          //{" "}
                        </span>
                        //{" "}
                      </div>
                      //{" "}
                      <div className="models-div__box__descr__name-price__price">
                        // <h4>$50</h4>
                        // <p>per day</p>
                        //{" "}
                      </div>
                      //{" "}
                    </div>
                    //{" "}
                    <div className="models-div__box__descr__name-price__details">
                      //{" "}
                      <span>
                        // <i className="fa-solid fa-car-side"></i> &nbsp; Benz
                        GLK //{" "}
                      </span>
                      //{" "}
                      <span style={{ textAlign: "right" }}>
                        // 4/5 &nbsp; <i className="fa-solid fa-car-side"></i>
                        //{" "}
                      </span>
                      //{" "}
                      <span>
                        // <i className="fa-solid fa-car-side"></i> &nbsp;
                        Manual //{" "}
                      </span>
                      //{" "}
                      <span style={{ textAlign: "right" }}>
                        // Diesel &nbsp;{" "}
                        <i className="fa-solid fa-car-side"></i>
                        //{" "}
                      </span>
                      //{" "}
                    </div>
                    //{" "}
                    <div className="models-div__box__descr__name-price__btn">
                      //{" "}
                      <Link onClick={() => window.scrollTo(0, 0)} to="/">
                        // Book Ride //{" "}
                      </Link>
                      //{" "}
                    </div>
                    //{" "}
                  </div>
                  //{" "}
                </div>
                //{" "}
              </div> */}
              {/* //{" "} */}
              {/* <div className="models-div__box">
                //{" "}
                <div className="models-div__box__img">
                  // <img src={CarImg6} alt="car_img" />
                  //{" "}
                  <div className="models-div__box__descr">
                    //{" "}
                    <div className="models-div__box__descr__name-price">
                      //{" "}
                      <div className="models-div__box__descr__name-price__name">
                        // <p>VW Passat</p>
                        //{" "}
                        <span>
                          // <i className="fa-solid fa-star"></i>
                          // <i className="fa-solid fa-star"></i>
                          // <i className="fa-solid fa-star"></i>
                          // <i className="fa-solid fa-star"></i>
                          // <i className="fa-solid fa-star"></i>
                          //{" "}
                        </span>
                        //{" "}
                      </div>
                      //{" "}
                      <div className="models-div__box__descr__name-price__price">
                        // <h4>$25</h4>
                        // <p>per day</p>
                        //{" "}
                      </div>
                      //{" "}
                    </div>
                    //{" "}
                    <div className="models-div__box__descr__name-price__details">
                      //{" "}
                      <span>
                        // <i className="fa-solid fa-car-side"></i> &nbsp; CC //{" "}
                      </span>
                      //{" "}
                      <span style={{ textAlign: "right" }}>
                        // 4/5 &nbsp; <i className="fa-solid fa-car-side"></i>
                        //{" "}
                      </span>
                      //{" "}
                      <span>
                        // <i className="fa-solid fa-car-side"></i> &nbsp;
                        Manual //{" "}
                      </span>
                      //{" "}
                      <span style={{ textAlign: "right" }}>
                        // Diesel &nbsp;{" "}
                        <i className="fa-solid fa-car-side"></i>
                        //{" "}
                      </span>
                      //{" "}
                    </div>
                    //{" "}
                    <div className="models-div__box__descr__name-price__btn">
                      //{" "}
                      <Link onClick={() => window.scrollTo(0, 0)} to="/">
                        // Book Ride //{" "}
                      </Link>
                      //{" "}
                    </div>
                    //{" "}
                  </div>
                  //{" "}
                </div>
                //{" "}
              </div> */}
            </div>
          </div>
        )}
        {/* <div className="book-banner">
          <div className="book-banner__overlay"></div>
          <div className="container">
            <div className="text-content">
              <h2>Book a car by getting in touch with us</h2>
              <span>
                <i className="fa-solid fa-phone"></i>
                <h3>+251946888444</h3>
              </span>
            </div>
          </div>
        </div> */}
        <Footer />
      </section>
    </>
  );
}

export default Models;
