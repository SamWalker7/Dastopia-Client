import React, { useEffect, useState } from "react";
import CardMedia from "@mui/material/CardMedia";
import VehicleImageSlider from "./VehcileImageSlider";
import { useInView } from 'react-intersection-observer';
import { Link } from "react-router-dom";

const VehicleCard = ({ vehicle, index, handleClick, handleClose, toggleListing, anchorEl, selectedIndex, setAnchorEl }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);

    //   console.log(vehicle, "vehicle")

    return (
        <div className="models-div__box" ref={ref} data-id={vehicle?.id}>
            <div className="models-div__box__img">
                {inView && (
                    vehicle.imageLoading ? (
                        <CardMedia
                            component="img"
                            height="140"
                            image="https://via.placeholder.com/300"
                            alt="Loading..."
                            loading="lazy"
                            sx={
                               {
                                border: 0,
                               
                               }
                            }
                        />
                    ) : (
                        Array.isArray(vehicle?.images) && vehicle?.images?.length > 0 ? (
                            <VehicleImageSlider images={vehicle.images} />
                        ) : (
                            <CardMedia
                                component="img"
                                height="140"
                                image="https://via.placeholder.com/300"
                                alt={vehicle.name}
                                loading="lazy"
                                sx={
                                    {
                                     border: 0,
                                    
                                    }
                                 }
                            />
                        )
                    )
                )}
                <div className="models-div__box__descr">
                    <div className="models-div__box__descr__name-price">
                        <div className="models-div__box__descr__name-price__name">
                            <p>
                                {vehicle.make}
                            </p>
                            <p>
                                {vehicle.model}
                            </p>
                            {((index+1) % 4 === 0) || ((index+1) % 7) === 0 ?
                                <span>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i class="fa-regular fa-star"></i>
                                   {/* <span style={{fontSize: '1.6rem', fontWeight: '600'}}> ({(Math.random()*100).toFixed(0)}) </span> */}
                                </span> :
                                <span>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    {/* <span style={{fontSize: '1.6rem', fontWeight: '600'}}> ({(Math.random()*100).toFixed(0)}) </span> */}
                                </span>
                            }
                            <span style={{fontSize: '1.6rem', fontWeight: '600'}}> {(Math.random()*100).toFixed(0)} Reviews </span>

                        </div>
                        <div className="models-div__box__descr__name-price__price">
                        <h4>ETB {vehicle.price || 2500}</h4>
                            <p>per day</p>
                        </div>
                    </div>
                    <div className="models-div__box__descr__name-price__details">
                        <span>
                            {vehicle.transmission}
                        </span>
                        <span style={{ textAlign: "right" }}>
                            {vehicle.fuelType} &nbsp;{" "}
                        </span>
                        <span>
                            {vehicle.color}
                        </span>
                        <span style={{ textAlign: "right" }}>
                            {vehicle.doors} Doors &nbsp;{" "}
                        </span>
                    </div>
                    <div className="models-div__box__descr__name-price__btn">
                        <Link to={`/Details/${vehicle.id}`}>
                            Book Car
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VehicleCard;