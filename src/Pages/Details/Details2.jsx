import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchImages, fetchVehicles } from "../../store/slices/vehicleSlice";
import MapComponent from "../../components/GoogleMaps";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { getDownloadUrl, getOneVehicle } from "../../api";
import audia1 from "../../images/cars-big/toyota-box.png";
import { IoLocationOutline } from "react-icons/io5";
import {
  FaArrowLeft,
  FaBackspace,
  FaCogs,
  FaGasPump,
  FaLocationArrow,
  FaRegCircle,
  FaStar,
  FaUserFriends,
} from "react-icons/fa";
import RentalModal from "./RentalModal";
import PriceBreakdown from "./PriceBreakdown";

export default function Details2(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { id } = useParams();
  const [selected, setSelected] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageLoading, setImageLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [error, setError] = useState("");

  //const vehicles = useSelector((state) => state.vehicle.vehicles);
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
    <div className="py-32 bg-[#FAF9FE] px-32 gap-10 flex ">
      <div className="flex flex-col w-3/4">
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
          <div className="p-6 bg-white w-1/2 h-fit shadow-lg rounded-lg">
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
              <div className="flex justify-between w-full items-center px-2 py-4 my-2 text-gray-700 text-xl">
                <div className="flex items-center space-x-2">
                  <FaGasPump size={16} /> <span>Benzene</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCogs size={16} />
                  <span>Automatic</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaUserFriends size={16} />
                  <span>4 People</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Specifications and Reviews */}
          <div className="p-10 bg-white w-full  shadow-lg rounded-lg">
            <div className="flex justify-between  items-center">
              <h3 className="text-xl font-semibold">
                Total Rent Price (3 Days)
              </h3>
              <span className="text-3xl font-bold">
                {carDetails.rentPrice.total}
              </span>
            </div>
            <div className="bg-blue-100 text-blue-700 py-2 px-4 rounded-lg text-center mt-4">
              Daily Rent Price: {carDetails.rentPrice.daily}
            </div>

            {/* Car Specification */}
            <h4 className="mt-8 text-2xl font-semibold">Car Specification</h4>
            <div className="grid grid-cols-3 text-xl gap-4 mt-4">
              <div>
                <span className="font-medium ">Car Brand</span>
                <p className="text-gray-500">{carDetails.brand}</p>
              </div>
              <div>
                <span className="font-medium">Car Model</span>
                <p className="text-gray-500">{carDetails.model}</p>
              </div>

              <div>
                <span className="font-medium">Manufacture Date</span>
                <p className="text-gray-500">{carDetails.manufactureDate}</p>
              </div>
            </div>

            <div className="my-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Features
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "Air Conditioning",
                  "4WD",
                  "Android system",
                  "Android system",
                  "Android system",
                  "Android system",
                  "Android system",
                  "Android system",
                ].map((feature, index) => (
                  <span
                    key={index}
                    className=" text-gray-700 px-4 py-2 rounded-xl text-xl border border-gray-300"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Pickup and Drop-off Locations */}
            <div className="flex justify-between md:pr-52 mb-6">
              <div className="my-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Pick up Locations
                </h3>
                <ul className=" text-xl space-y-6 text-gray-700">
                  <li className="flex items-center gap-4">
                    <IoLocationOutline size={16} /> CMC roundabout
                  </li>
                  <li className="flex items-center gap-4">
                    <IoLocationOutline size={16} /> Ayat Zone 8
                  </li>
                  <li className="flex items-center gap-4">
                    <IoLocationOutline size={16} /> Bole Airport
                  </li>
                </ul>
              </div>
              <div className="my-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Drop off Locations
                </h3>
                <ul className=" text-xl space-y-6 text-gray-700">
                  <li className="flex items-center gap-4">
                    <IoLocationOutline size={16} /> CMC roundabout
                  </li>
                  <li className="flex items-center gap-4">
                    <IoLocationOutline size={16} /> Ayat Zone 8
                  </li>
                  <li className="flex items-center gap-4">
                    <IoLocationOutline size={16} /> Bole Airport
                  </li>
                </ul>
              </div>
            </div>

            {/* Insurance */}
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">
                Insurance
              </h3>
              <p className="text-xl text-gray-700 mt-2">Full Coverage</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-1/4">
        <section className=" bg-white p-6 md:mt-24 mb-8  rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-[#00113D] mb-8">
            Pick Up and Drop Off
          </h2>
          <div className="flex flex-col  text-lg text-[#5A5A5A]">
            <div className="flex items-start gap-2">
              <div>
                <p className="flex items-center ">
                  <FaRegCircle className="text-gray-400" />{" "}
                  <span className="px-4">Sunday, Jun 30 - 10:00 AM</span>
                </p>
                <div className="ml-2 px-6 border-l pb-12 border-gray-300">
                  <p className="font-semibold">Bole International Airport</p>
                  <a href="#" className="text-blue-800 underline">
                    View Pick-up detail instructions
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div>
                <p className="flex items-center">
                  <FaRegCircle className="text-gray-400" />{" "}
                  <span className="px-4">Sunday, Jun 30 - 10:00 AM</span>
                </p>
                <div className="ml-2 px-6  pb-8 ">
                  <p className="font-semibold">Bole International Airport</p>
                  <a href="#" className="text-blue-800 underline">
                    View Pick-up detail instructions
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-lg">
            <span className="font-medium text-black"> Driver request</span>
            <p className="text-gray-500">Yes</p>
          </div>
          <div className="p-8  bg-blue-200 py-10 h-fit">
            Having no driver selected means that you are liable for any issues
            that is related to an accident to the rented vechile
          </div>
        </section>
        <PriceBreakdown />
      </div>
    </div>
  );
}
