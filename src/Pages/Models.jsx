// Imported Packages
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

// Imported Components
import Footer from "../components/Footer";
import HeroPages from "../components/HeroPages";
import VehicleCard from "../components/shared/VehicleCard";

// Imported Functions
import { getAllVehicles, getDownloadUrl } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { fetchImages, fetchVehicles } from "../store/slices/vehicleSlice";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { LoadScript } from "@react-google-maps/api";
import { API_KEY } from "../components/GoogleMaps";
import { Search, X } from "lucide-react";

function Models() {
  const dispatch = useDispatch();

  const vehicles = useSelector((state) => state.vehicle.vehicles);
  const isLoading = useSelector((state) => state.vehicle.loading);
  

  

  

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
            <div className="testimonials-content__title">
              <h4>Our car lists</h4>
              <h2>Book a car with us</h2>
              <p>
                Enjoy a hassle-free car rental experience with our wide
                selection of vehicles. Whether it's a compact car, SUV, or
                luxury model, we offer competitive rates and easy booking
                options. Book with us today and drive with confidence!
              </p>
            </div>
            <div className="models-div">
              {vehicles.map((vehicle, index) => (
                <VehicleCard
                  vehicle={vehicle}
                  key={vehicle.id}
                  index={index}
                 
                />
              ))}
            </div>
          </div>
        )}

        <Footer />
      </section>
    </>
  );
}

export default Models;
