import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import SearchBar from "../components/Search/SearchBar";
import Filters from "../components/Search/Filters";
import ResultsGrid from "../components/Search/ResultsGrid";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles, fetchImages } from "../store/slices/vehicleSlice";

const Search = () => {
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
  }, [dispatch, vehicles.length]);

  const gridContainerStyle = {
    display: "flex",
    marginTop: "20px",
    width: "100%",
  };

  const colSpanStyle = {
    width: "50%",
  };

  const mapContainerStyle = {
    backgroundColor: "white",
    padding: "16px",
    width: "50%",
    marginLeft: "50px",
  };

  const mapDetailsStyle = {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    fontSize: "20px",
  };

  return (
    <div style={{ padding: "30px" }}>
      <main>
        <div>
          <SearchBar />
          <Filters />
          <div style={gridContainerStyle}>
            <div style={colSpanStyle}>
              {isLoading ? (
                <CircularProgress />
              ) : (
                <ResultsGrid vehicles={vehicles} />
              )}
            </div>
            <div style={mapContainerStyle}>
              <div style={mapDetailsStyle}>
                Map details will be displayed here.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Search;
