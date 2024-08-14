import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchImages, fetchVehicles } from "../store/slices/vehicleSlice";
import {
  Antenna,
  Armchair,
  Calendar,
  Car,
  CarFront,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleDollarSign,
  CircleUser,
  DoorOpen,
  Fuel,
  List,
  PaintBucket,
  Phone,
} from "lucide-react";
import MapComponent from "../components/GoogleMaps";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { getDownloadUrl, getOneVehicle } from "../api";

export default function Details(props) {
  const { id } = useParams();
  const [selected, setSelected] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageLoading, setImageLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [error, setError] = useState("");

  const vehicles = useSelector((state) => state.vehicle.vehicles);
  const dispatch = useDispatch();

  const handleStartDateChange = (event) => {
    const value = event.target.value;
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const selectedStartDate = new Date(value).setHours(0, 0, 0, 0);
    const selectedEndDate = endDate
      ? new Date(endDate).setHours(0, 0, 0, 0)
      : null;

    if (selectedStartDate > currentDate) {
      setError("Pickup date cannot be before the current date.");
      setStartDate("");
    } else if (selectedEndDate && selectedStartDate > selectedEndDate) {
      setError("Pickup date cannot be after the end date.");
      setStartDate("");
    } else {
      setError("");
      setStartDate(value);
    }
  };

  const handleEndDateChange = (event) => {
    const value = event.target.value;
    if (new Date(value) <= new Date(startDate)) {
      setError("End date must be after the pickup date.");
      setEndDate("");
    } else if (new Date(value).toDateString() === new Date().toDateString()) {
      setError("End date cannot be the current date.");
      setEndDate("");
    } else {
      setError("");
      setEndDate(value);
    }
  };

  console.log(selected, "selected");

  const fetchData = async () => {
    const response = await getOneVehicle(id);
    const data = response.body;
    let urls = [];
    setSelected({
      ...data,
      imageLoading: true,
      images: [],
    });

    for (const image of data.vehicleImageKeys) {
      const path = await getDownloadUrl(image.key);
      urls.push(path.body || "https://via.placeholder.com/300");
    }

    setSelected({
      ...data,
      imageLoading: false,
      images: urls,
    });
    setImageLoading(false)
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getQueryParam = (name) => {
      const params = new URLSearchParams(window.location.search);
      return params.get(name);
    };
    const pickUpTime = getQueryParam("pickUpTime");
    const dropOffTime = getQueryParam("dropOffTime");

    setStartDate(pickUpTime);
    setEndDate(dropOffTime);
  }, []);

  const styles = {
    formControl: {
      minWidth: "20%",
      marginRight: "16px",
      marginBottom: "10px",
      flex: "1 0 20%",
      marginTop: "2rem",
      fontSize: "16px",
    },
    container: {
      paddingTop: "300px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      maxWidth: "2000px",
      alignItems: "center",
      alignContent: "center",
      paddingLeft: windowWidth < 700 ? "10px" : "0px",
    },
  };

  const boxStyle = {
    display: "flex",
    flexDirection: windowWidth < 497 ? "column" : "row",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    alignItems: "flex-start",
    maxWidth: "1000px",
    width: "100%",
    padding: "15px",
  };

  return (
    <>
      {selected ? (
        <div style={styles.container}>
          <div
            style={{
              maxWidth: "1000px",
              width: "100%",
              height: "fit-content",
              boxShadow: "none !important",
            }}
          >
            {imageLoading ? (
              <Skeleton
                variant="rectangular"
                width={windowWidth > 1020 ? "50vw" : "100%"}
                height={windowWidth > 1020 ? "50vh" : "30vh"}
              />
            ) : (
              <Carousel
                sx={{ boxShadow: 0 }}
                interval={10000}
                NextIcon={<ChevronRight />}
                PrevIcon={<ChevronLeft />}
                navButtonsProps={{
                  style: {
                    backgroundColor: "#000000",
                    
                  },
                }}
               
              >
                {selected.images.map((item) => (
                  <Item item={item} imageLoading={imageLoading} />
                ))}
              </Carousel>
            )}
          </div>
          <div style={boxStyle}>
            <div style={{ width: "100%" }}>
              <h1 style={{ fontSize: "45px", fontWeight: "bolder" }}>
                {selected.make} {selected.model}
              </h1>
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>4.63 ⭐</p>
              <div style={{ display: "flex", gap: "6px" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "2px",
                    alignItems: "center",
                  }}
                >
                  <DoorOpen />
                  <p style={{ fontSize: "13px", fontWeight: "bold" }}>
                    {selected.doors} doors
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "2px",
                    alignItems: "center",
                  }}
                >
                  <PaintBucket />
                  <p style={{ fontSize: "13px", fontWeight: "bold" }}>
                    {selected.color} color
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "2px",
                    alignItems: "center",
                  }}
                >
                  <Armchair />
                  <p style={{ fontSize: "13px", fontWeight: "bold" }}>
                    {selected.seats} Seats
                  </p>
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "2px",
                    alignItems: "center",
                  }}
                >
                  <Car />
                  <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                    {selected.make}
                  </p>
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "2px",
                    alignItems: "center",
                  }}
                >
                  <CarFront />
                  <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                    {selected.model}
                  </p>
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "2px",
                    alignItems: "center",
                  }}
                >
                  <Calendar />
                  <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                    {selected.year} Year
                  </p>
                </div>
              </div>
              {error && (
                <div style={{ color: "red", marginBottom: "10px" }}>
                  {error}
                </div>
              )}
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: "190px",
                }}
              >
                <label style={{ fontSize: "15px", fontWeight: "bold" }}>
                  Trip start
                </label>
                <input
                  label="Start Date"
                  type="date"
                  variant="outlined"
                  value={startDate}
                  onChange={handleStartDateChange}
                  InputLabelProps={{ shrink: true }}
                  style={styles.formControl}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: "190px",
                }}
              >
                <label style={{ fontSize: "15px", fontWeight: "bold" }}>
                  Trip End
                </label>
                <input
                  label="End Date"
                  type="date"
                  variant="outlined"
                  value={endDate}
                  onChange={handleEndDateChange}
                  InputLabelProps={{ shrink: true }}
                  style={styles.formControl}
                  min={startDate}
                />
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ marginTop: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "2px",
                    alignItems: "center",
                  }}
                >
                  <CircleDollarSign />
                  <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                    37 / day
                  </p>
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "2px",
                    alignItems: "center",
                  }}
                >
                  <Fuel />
                  <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                    {selected.fuelType}
                  </p>
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "2px",
                    alignItems: "center",
                  }}
                >
                  <List />
                  <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                    {selected.category}
                  </p>
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "2px",
                    alignItems: "center",
                  }}
                >
                  <Phone />
                  <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                    +(251) 946-888444
                  </p>
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "2px",
                    alignItems: "center",
                  }}
                >
                  <Antenna />
                  <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                    {selected.transmission}
                  </p>
                </div>
              </div>
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <label style={{ fontSize: "15px", fontWeight: "bold" }}>
                  Pickup loction
                </label>
                <select
                  style={{
                    padding: "4px 20px 4px 20px",
                    maxWidth: "190px",
                    fontWeight: "bold",
                  }}
                >
                  <option>Dani Plaza</option>
                </select>
              </div>
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <button
                  style={{
                    maxWidth: "190px",
                    background: "",
                    padding: "10px 20px 10px 20px",
                    border: "1px solid blue",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                  className="colored-button"
                  onClick={() =>
                    (window.location.href = `/booking/${selected.id}?pickUpTime=${startDate}&dropOffTime=${endDate}`)
                  }
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex_start",
              width: "100%",
              maxWidth: "1000px",
            }}
          >
            <div
              style={{
                width: "100%",
                paddingLeft: windowWidth < 1000 ? "10px" : "0px",
              }}
            >
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                Description:{" "}
              </p>
              <p style={{ fontSize: "13px", width: "50%" }}>
                The {selected.make} {selected.model} is a versatile and reliable
                vehicle designed to cater to a wide range of driving needs. With
                its sleek exterior and modern design, this car stands out on the
                road, offering a blend of style and functionality. Under the
                hood, it boasts a powerful yet efficient engine, delivering a
                smooth and responsive driving experience
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "10px",
              marginBottom: "10px",
              justifyContent: "flex-start",
              alignItems: "flex_start",
              width: "100%",
              maxWidth: "1000px",
              gap: "14px",
            }}
          >
            <p style={{ fontSize: "18px", color: "black", fontWeight: "bold" }}>
              Reviews
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {selected.row ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      gap: "14px",
                      borderBottom: "1px solid gray",
                      paddingBottom: "18px",
                    }}
                  >
                    <div style={{ maxWidth: "60px", maxHeight: "60px" }}>
                      <CircleUser style={{ width: "60px", height: "60px" }} />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <p style={{ fontSize: "16px" }}> ⭐ ⭐ ⭐ ⭐ ⭐ </p>
                      <div
                        style={{ display: "flex", gap: "2px", color: "gray" }}
                      >
                        <p> User </p>
                        <p>July 3, 2024</p>
                      </div>
                      <p style={{ width: "50%", fontSize: "13px" }}>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                        when an unknown
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "14px" }}>
                    <div style={{ maxWidth: "60px", maxHeight: "60px" }}>
                      <CircleUser style={{ width: "60px", height: "60px" }} />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <p style={{ fontSize: "16px" }}> ⭐ ⭐ ⭐ ⭐ ⭐ </p>
                      <div
                        style={{ display: "flex", gap: "2px", color: "gray" }}
                      >
                        <p> User </p>
                        <p>July 3, 2024</p>
                      </div>
                      <p style={{ width: "50%", fontSize: "13px" }}>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                        when an unknown
                      </p>
                    </div>
                  </div>{" "}
                </>
              ) : (
                <p style={{ fontSize: "16px" }}>No reviews yet</p>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex_start",
              width: "100%",
              maxWidth: "1000px",
              marginTop: "20px",
              flexDirection: "column",
              gap: "14px",
              paddingBottom: "10px",
            }}
          >
            <p style={{ fontSize: "18px", color: "black", fontWeight: "bold" }}>
              Location
            </p>
            <div style={{ width: "100%" }}>
              <MapComponent />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ paddingTop: "200px" }}>
          {" "}
          <p style={{ fontSize: "20px", margin: "0 auto" }}>
            {" "}
            <span className="loader" style={{ marginTop: "20vh" }}></span>{" "}
          </p>
        </div>
      )}
    </>
  );
}

function Item(props) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <Paper style={{ boxShadow: "none" }}>
      <div
        style={{
          height: "30vh",
          width: "auto" ,
          position: "relative",
        }}
      >
        {loading && <span className="loader"></span>}
        {!props.imageLoading && (
          <img
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
            src={props.item}
            onLoad={() => setLoading(false)}
          />
        )}
      </div>
    </Paper>
  );
}
