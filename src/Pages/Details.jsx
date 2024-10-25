import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchImages, fetchVehicles } from "../store/slices/vehicleSlice";
import MapComponent from "../components/GoogleMaps";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { getDownloadUrl, getOneVehicle } from "../api";
import audia1 from "../images/cars-big/toyota-box.png";
import {
  FaArrowLeft,
  FaBackspace,
  FaCogs,
  FaGasPump,
  FaStar,
  FaUserFriends,
} from "react-icons/fa";

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

    if (selectedStartDate < currentDate) {
      setError("Pickup date cannot be before the current date.");
      setStartDate("");
    } else if (selectedEndDate && selectedStartDate > selectedEndDate) {
      setError("Pickup date cannot be after the end date.");
      setStartDate("");
    } else {
      setError("");

      setStartDate(value);
      localStorage.setItem("pickUpTime", value);
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
      localStorage.setItem("dropOffTime", value);
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

    // for (const image of data.vehicleImageKeys) {
    //   const path = await getDownloadUrl(image.key);
    //   urls.push(path.body || "https://via.placeholder.com/300");
    // }

    setSelected({
      ...data,
      imageLoading: false,
      images: urls,
    });
    setImageLoading(false);
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

  //   return (
  //     <>
  //       {selected ? (
  //         <div style={styles.container}>
  //           <div
  //             style={{
  //               maxWidth: "1000px",
  //               width: "100%",
  //               height: "fit-content",
  //               boxShadow: "none !important",
  //             }}
  //           >
  //             {imageLoading ? (
  //               <Skeleton
  //                 variant="rectangular"
  //                 width={windowWidth > 1020 ? "50vw" : "100%"}
  //                 height={windowWidth > 1020 ? "50vh" : "30vh"}
  //               />
  //             ) : (
  //               <Carousel
  //                 sx={{ boxShadow: 0 }}
  //                 interval={10000}
  //                 NextIcon={<ChevronRight />}
  //                 PrevIcon={<ChevronLeft />}
  //                 navButtonsProps={{
  //                   style: {
  //                     backgroundColor: "#000000",
  //                   },
  //                 }}
  //               >
  //                 {selected.images.map((item) => (
  //                   <Item item={item} imageLoading={imageLoading} />
  //                 ))}
  //               </Carousel>
  //             )}
  //           </div>
  //           <div style={boxStyle}>
  //             <div style={{ width: "100%" }}>
  //               <h1 style={{ fontSize: "45px", fontWeight: "bolder" }}>
  //                 {selected.make} {selected.model}
  //               </h1>
  //               <p style={{ fontSize: "20px", fontWeight: "bold" }}>4.63 ⭐</p>
  //               <div style={{ display: "flex", gap: "6px" }}>
  //                 <div
  //                   style={{
  //                     display: "flex",
  //                     gap: "2px",
  //                     alignItems: "center",
  //                   }}
  //                 >
  //                   <DoorOpen />
  //                   <p style={{ fontSize: "13px", fontWeight: "bold" }}>
  //                     {selected.doors} doors
  //                   </p>
  //                 </div>
  //                 <div
  //                   style={{
  //                     display: "flex",
  //                     gap: "2px",
  //                     alignItems: "center",
  //                   }}
  //                 >
  //                   <PaintBucket />
  //                   <p style={{ fontSize: "13px", fontWeight: "bold" }}>
  //                     {selected.color} color
  //                   </p>
  //                 </div>
  //                 <div
  //                   style={{
  //                     display: "flex",
  //                     gap: "2px",
  //                     alignItems: "center",
  //                   }}
  //                 >
  //                   <Armchair />
  //                   <p style={{ fontSize: "13px", fontWeight: "bold" }}>
  //                     {selected.seats} Seats
  //                   </p>
  //                 </div>
  //               </div>
  //               <div style={{ marginTop: "10px" }}>
  //                 <div
  //                   style={{
  //                     display: "flex",
  //                     gap: "2px",
  //                     alignItems: "center",
  //                   }}
  //                 >
  //                   <Car />
  //                   <p style={{ fontSize: "15px", fontWeight: "bold" }}>
  //                     {selected.make}
  //                   </p>
  //                 </div>
  //               </div>
  //               <div style={{ marginTop: "10px" }}>
  //                 <div
  //                   style={{
  //                     display: "flex",
  //                     gap: "2px",
  //                     alignItems: "center",
  //                   }}
  //                 >
  //                   <CarFront />
  //                   <p style={{ fontSize: "15px", fontWeight: "bold" }}>
  //                     {selected.model}
  //                   </p>
  //                 </div>
  //               </div>
  //               <div style={{ marginTop: "10px" }}>
  //                 <div
  //                   style={{
  //                     display: "flex",
  //                     gap: "2px",
  //                     alignItems: "center",
  //                   }}
  //                 >
  //                   <Calendar />
  //                   <p style={{ fontSize: "15px", fontWeight: "bold" }}>
  //                     {selected.year} Year
  //                   </p>
  //                 </div>
  //               </div>
  //               {error && (
  //                 <div style={{ color: "red", marginBottom: "10px" }}>
  //                   {error}
  //                 </div>
  //               )}
  //               <div
  //                 style={{
  //                   marginTop: "20px",
  //                   display: "flex",
  //                   flexDirection: "column",
  //                   maxWidth: "190px",
  //                 }}
  //               >
  //                 <label style={{ fontSize: "15px", fontWeight: "bold" }}>
  //                   Trip start
  //                 </label>
  //                 <input
  //                   label="Start Date"
  //                   type="date"
  //                   variant="outlined"
  //                   value={startDate}
  //                   onChange={handleStartDateChange}
  //                   InputLabelProps={{ shrink: true }}
  //                   style={styles.formControl}
  //                   min={new Date().toISOString().split("T")[0]}
  //                 />
  //               </div>
  //               <div
  //                 style={{
  //                   marginTop: "20px",
  //                   display: "flex",
  //                   flexDirection: "column",
  //                   maxWidth: "190px",
  //                 }}
  //               >
  //                 <label style={{ fontSize: "15px", fontWeight: "bold" }}>
  //                   Trip End
  //                 </label>
  //                 <input
  //                   label="End Date"
  //                   type="date"
  //                   variant="outlined"
  //                   value={endDate}
  //                   onChange={handleEndDateChange}
  //                   InputLabelProps={{ shrink: true }}
  //                   style={styles.formControl}
  //                   min={startDate}
  //                 />
  //               </div>
  //             </div>
  //             <div
  //               style={{
  //                 width: "100%",
  //                 display: "flex",
  //                 flexDirection: "column",
  //                 gap: "8px",
  //               }}
  //             >
  //               <div style={{ marginTop: "10px" }}>
  //                 <div
  //                   style={{
  //                     display: "flex",
  //                     gap: "2px",
  //                     alignItems: "center",
  //                   }}
  //                 >
  //                   <CircleDollarSign />
  //                   <p style={{ fontSize: "15px", fontWeight: "bold" }}>
  //                     {selected.price || 2500}
  //                   </p>
  //                 </div>
  //               </div>
  //               <div style={{ marginTop: "10px" }}>
  //                 <div
  //                   style={{
  //                     display: "flex",
  //                     gap: "2px",
  //                     alignItems: "center",
  //                   }}
  //                 >
  //                   <Fuel />
  //                   <p style={{ fontSize: "15px", fontWeight: "bold" }}>
  //                     {selected.fuelType}
  //                   </p>
  //                 </div>
  //               </div>
  //               <div style={{ marginTop: "10px" }}>
  //                 <div
  //                   style={{
  //                     display: "flex",
  //                     gap: "2px",
  //                     alignItems: "center",
  //                   }}
  //                 >
  //                   <List />
  //                   <p style={{ fontSize: "15px", fontWeight: "bold" }}>
  //                     {selected.category}
  //                   </p>
  //                 </div>
  //               </div>
  //               <div style={{ marginTop: "10px" }}>
  //                 <div
  //                   style={{
  //                     display: "flex",
  //                     gap: "2px",
  //                     alignItems: "center",
  //                   }}
  //                 >
  //                   <Phone />
  //                   <p style={{ fontSize: "15px", fontWeight: "bold" }}>
  //                     +(251) 946-888444
  //                   </p>
  //                 </div>
  //               </div>
  //               <div style={{ marginTop: "10px" }}>
  //                 <div
  //                   style={{
  //                     display: "flex",
  //                     gap: "2px",
  //                     alignItems: "center",
  //                   }}
  //                 >
  //                   <Antenna />
  //                   <p style={{ fontSize: "15px", fontWeight: "bold" }}>
  //                     {selected.transmission}
  //                   </p>
  //                 </div>
  //               </div>
  //               <div
  //                 style={{
  //                   marginTop: "20px",
  //                   display: "flex",
  //                   flexDirection: "column",
  //                   gap: "2px",
  //                 }}
  //               >
  //                 <label style={{ fontSize: "15px", fontWeight: "bold" }}>
  //                   Pickup loction
  //                 </label>
  //                 <select
  //                   style={{
  //                     padding: "4px 20px 4px 20px",
  //                     maxWidth: "190px",
  //                     fontWeight: "bold",
  //                   }}
  //                 >
  //                   <option>Addis Ababa</option>
  //                 </select>
  //               </div>
  //               <div
  //                 style={{
  //                   marginTop: "20px",
  //                   display: "flex",
  //                   flexDirection: "column",
  //                   gap: "2px",
  //                 }}
  //               >
  //                 <button
  //                   style={{
  //                     maxWidth: "190px",
  //                     background: "",
  //                     padding: "10px 20px 10px 20px",
  //                     border: "1px solid blue",
  //                     borderRadius: "10px",
  //                     cursor: "pointer",
  //                   }}
  //                   className="colored-button"
  //                   onClick={() =>
  //                     (window.location.href = `/booking/${selected.id}?pickUpTime=${startDate}&dropOffTime=${endDate}`)
  //                   }
  //                 >
  //                   Book Now
  //                 </button>
  //               </div>
  //             </div>
  //           </div>
  //           <div
  //             style={{
  //               display: "flex",
  //               justifyContent: "flex-start",
  //               alignItems: "flex_start",
  //               width: "100%",
  //               maxWidth: "1000px",
  //             }}
  //           >
  //             <div
  //               style={{
  //                 width: "100%",
  //                 paddingLeft: windowWidth < 1000 ? "10px" : "0px",
  //               }}
  //             >
  //               <p
  //                 style={{
  //                   fontSize: "18px",
  //                   fontWeight: "bold",
  //                   marginBottom: "10px",
  //                 }}
  //               >
  //                 Description:{" "}
  //               </p>
  //               <p style={{ fontSize: "13px", width: "50%" }}>
  //                 The {selected.make} {selected.model} is a versatile and reliable
  //                 vehicle designed to cater to a wide range of driving needs. With
  //                 its sleek exterior and modern design, this car stands out on the
  //                 road, offering a blend of style and functionality. Under the
  //                 hood, it boasts a powerful yet efficient engine, delivering a
  //                 smooth and responsive driving experience
  //               </p>
  //             </div>
  //           </div>
  //           <div
  //             style={{
  //               display: "flex",
  //               flexDirection: "column",
  //               marginTop: "10px",
  //               marginBottom: "10px",
  //               justifyContent: "flex-start",
  //               alignItems: "flex_start",
  //               width: "100%",
  //               maxWidth: "1000px",
  //               gap: "14px",
  //             }}
  //           >
  //             <p style={{ fontSize: "18px", color: "black", fontWeight: "bold" }}>
  //               Reviews
  //             </p>
  //             <div
  //               style={{
  //                 display: "flex",
  //                 flexDirection: "column",
  //                 gap: "14px",
  //               }}
  //             >
  //               {selected.row ? (
  //                 <>
  //                   <div
  //                     style={{
  //                       display: "flex",
  //                       gap: "14px",
  //                       borderBottom: "1px solid gray",
  //                       paddingBottom: "18px",
  //                     }}
  //                   >
  //                     <div style={{ maxWidth: "60px", maxHeight: "60px" }}>
  //                       <CircleUser style={{ width: "60px", height: "60px" }} />
  //                     </div>

  //                     <div
  //                       style={{
  //                         display: "flex",
  //                         flexDirection: "column",
  //                         gap: "2px",
  //                       }}
  //                     >
  //                       <p style={{ fontSize: "16px" }}> ⭐ ⭐ ⭐ ⭐ ⭐ </p>
  //                       <div
  //                         style={{ display: "flex", gap: "2px", color: "gray" }}
  //                       >
  //                         <p> User </p>
  //                         <p>July 3, 2024</p>
  //                       </div>
  //                       <p style={{ width: "50%", fontSize: "13px" }}>
  //                         Lorem Ipsum is simply dummy text of the printing and
  //                         typesetting industry. Lorem Ipsum has been the
  //                         industry's standard dummy text ever since the 1500s,
  //                         when an unknown
  //                       </p>
  //                     </div>
  //                   </div>
  //                   <div style={{ display: "flex", gap: "14px" }}>
  //                     <div style={{ maxWidth: "60px", maxHeight: "60px" }}>
  //                       <CircleUser style={{ width: "60px", height: "60px" }} />
  //                     </div>

  //                     <div
  //                       style={{
  //                         display: "flex",
  //                         flexDirection: "column",
  //                         gap: "2px",
  //                       }}
  //                     >
  //                       <p style={{ fontSize: "16px" }}> ⭐ ⭐ ⭐ ⭐ ⭐ </p>
  //                       <div
  //                         style={{ display: "flex", gap: "2px", color: "gray" }}
  //                       >
  //                         <p> User </p>
  //                         <p>July 3, 2024</p>
  //                       </div>
  //                       <p style={{ width: "50%", fontSize: "13px" }}>
  //                         Lorem Ipsum is simply dummy text of the printing and
  //                         typesetting industry. Lorem Ipsum has been the
  //                         industry's standard dummy text ever since the 1500s,
  //                         when an unknown
  //                       </p>
  //                     </div>
  //                   </div>{" "}
  //                 </>
  //               ) : (
  //                 <p style={{ fontSize: "16px" }}>No reviews yet</p>
  //               )}
  //             </div>
  //           </div>
  //           <div
  //             style={{
  //               display: "flex",
  //               justifyContent: "flex-start",
  //               alignItems: "flex_start",
  //               width: "100%",
  //               maxWidth: "1000px",
  //               marginTop: "20px",
  //               flexDirection: "column",
  //               gap: "14px",
  //               paddingBottom: "10px",
  //             }}
  //           >
  //             <p style={{ fontSize: "18px", color: "black", fontWeight: "bold" }}>
  //               Location
  //             </p>
  //             <div style={{ width: "100%" }}>
  //               <MapComponent />
  //             </div>
  //           </div>
  //         </div>
  //       ) : (
  //         <div style={{ paddingTop: "200px" }}>
  //           {" "}
  //           <p style={{ fontSize: "20px", margin: "0 auto" }}>
  //             {" "}
  //             <span className="loader" style={{ marginTop: "20vh" }}></span>{" "}
  //           </p>
  //         </div>
  //       )}
  //     </>
  //   );
  // }

  // function Item(props) {
  //   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  //   const [loading, setLoading] = useState(true);
  //   useEffect(() => {
  //     const handleResize = () => setWindowWidth(window.innerWidth);
  //     window.addEventListener("resize", handleResize);
  //     return () => window.removeEventListener("resize", handleResize);
  //   }, []);
  //   return (
  //     <Paper style={{ boxShadow: "none" }}>
  //       <div
  //         style={{
  //           height: "30vh",
  //           width: "auto",
  //           position: "relative",
  //         }}
  //       >
  //         {loading && <span className="loader"></span>}
  //         {!props.imageLoading && (
  //           <img
  //             style={{ objectFit: "contain", width: "100%", height: "100%" }}
  //             src={props.item}
  //             onLoad={() => setLoading(false)}
  //           />
  //         )}
  //       </div>
  //     </Paper>
  //   );
  // }
  // Mock data for car details and reviews
  const carDetails = {
    name: "Tesla Model Y",
    image: audia1,
    thumbnails: [
      "/path-to-thumb1.jpg",
      "/path-to-thumb2.jpg",
      "/path-to-thumb3.jpg",
    ],
    fuelType: "Benzene",
    seating: "5 Seater",
    transmission: "Manual",
    rentPrice: {
      total: "7,843 birr",
      daily: "2,450 birr",
    },
    brand: "Tesla",
    model: "Model Y",
    manufactureDate: "2018",
    features: ["Air Conditioning", "4WD", "Android system"],
    pickupLocations: ["CMC Roundabout", "Bole Airport", "Ayat Zone 8"],
    dropOffLocations: ["CMC Roundabout", "Bole Airport"],
    insurance: "Full Coverage",
    rating: 4,
    reviews: [
      {
        name: "Veronika",
        rating: 4,
        reviewText: "Very comfortable and reliable car!",
        avatar: audia1,
      },
    ],
  };

  const [selectedImage, setSelectedImage] = useState(carDetails.image);
  const [pickUp, setPickUp] = useState("");

  const handlePick = (e) => setPickUp(e.target.value);

  const locations = ["Addis Ababa", "Adama", "Hawassa", "Bahir Dar"];
  return (
    <div className="py-10 bg-[#FAF9FE] px-32 flex flex-col">
      <div className="bg-white md:mt-24 mb-8 w-full px-10 py-4 justify-between text-lg md:text-2xl  rounded-xl shadow-sm shadow-blue-300 border border-blue-300  flex">
        <div className="flex w-2/3 justify-between items-center">
          {" "}
          <div className="flex flex-col ">
            <div>Bole International Airport</div>
            <div>Wed, Aug 28,2024 , 10:00</div>
          </div>
          <div className="mx-4">
            {" "}
            <svg
              className=" text-gray-800 w-8 h-8 transform transition-transform duration-200 
                -rotate-90"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 010-1.06z" />
            </svg>
          </div>
          <div className="flex flex-col ">
            <div>Bole International Airport</div>
            <div>Wed, Aug 28,2024 , 10:00</div>
          </div>
        </div>
        <button className=" border border-blue-950 text-lg text-black hover:bg-blue-200 hover:border-none rounded-full px-12 ml-8 my-2  py-2">
          Edit
        </button>
      </div>

      {/* Car Details Section */}
      <div className="flex gap-10 ">
        {/* Left Side - Car Info */}
        <div className="p-6 bg-white w-1/3 shadow-lg rounded-lg">
          <div className="flex px-2  flex-col">
            {" "}
            <button className="mb-4 flex self-start text-black text-xl font-normal items-center">
              <span className="mr-6">
                {" "}
                <FaArrowLeft className="text-gray-700" size={12} />
              </span>{" "}
              Car Details
            </button>{" "}
          </div>
          <h1 className=" text-3xl font-semibold px-2 mb-8 my-4">
            Tesla Model Y
          </h1>
          {/* Back Button */}
          <img
            src={audia1}
            alt="Tesla Model Y"
            className="w-[300px] h-[250px] rounded-lg mb-4"
          />
          <div className="flex justify-start  space-x-2 items-center mt-6">
            {carDetails.thumbnails.map((thumb, index) => (
              <img
                key={index}
                src={audia1}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setSelectedImage(thumb)}
                className="w-20 h-20 cursor-pointer rounded-lg"
              />
            ))}
          </div>
          <div className="flex   mt-4">
            <div className="flex justify-between w-full items-center px-6 py-4 my-2 text-gray-700 text-base">
              <div className="flex items-center space-x-2">
                <FaGasPump size={12} /> <span>Benzene</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCogs size={12} />
                <span>Automatic</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaUserFriends size={13} />
                <span>4 People</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center px-6 py-4 ">
            <div className="flex items-center mr-8 ">
              <FaStar className="text-yellow-400" />
              <span className="text-xl  font-medium">4.5</span>
            </div>
            <button className="bg-blue-950 w-full text-white rounded-full px-4 py-3 text-base font-normal">
              Rent Now
            </button>
          </div>
        </div>

        {/* Right Side - Specifications and Reviews */}
        <div className="p-10 bg-white w-full  shadow-lg rounded-lg">
          <div className="flex justify-between  items-center">
            <h3 className="text-xl font-semibold">Total Rent Price (3 Days)</h3>
            <span className="text-3xl font-bold">
              {carDetails.rentPrice.total}
            </span>
          </div>
          <div className="bg-blue-100 text-blue-700 py-2 px-4 rounded-lg text-center mt-4">
            Daily Rent Price: {carDetails.rentPrice.daily}
          </div>

          {/* Car Specification */}
          <h4 className="mt-8 text-lg font-semibold">Car Specification</h4>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <span className="text-gray-500">Car Brand</span>
              <p className="font-medium">{carDetails.brand}</p>
            </div>
            <div>
              <span className="text-gray-500">Car Model</span>
              <p className="font-medium">{carDetails.model}</p>
            </div>
            <div>
              <span className="text-gray-500">Catagory</span>
              <p className="font-medium">Sedan</p>
            </div>

            <div>
              <span className="text-gray-500">Manufacture Date</span>
              <p className="font-medium">{carDetails.manufactureDate}</p>
            </div>
            <div>
              <span className="text-gray-500">Color</span>
              <p className="font-medium">{carDetails.model}</p>
            </div>
            <div>
              <span className="text-gray-500">Doors</span>
              <p className="font-medium">{carDetails.model}</p>
            </div>
          </div>

          {/* Pickup and Drop-off */}
          <div className="relative inline-block my-8 text-lg w-[200px] ">
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
        </div>
      </div>
    </div>
  );
}
