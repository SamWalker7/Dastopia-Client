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
    border: "2px solid #6b7280",
    borderRadius: "5px",
    padding: "10px",
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

  const isMobile = () => {
    return window.innerWidth < 768;
  };

  if (isMobile()) {
    gridContainerStyle.width = "100%";
    colSpanStyle.width = "100%";
    mapContainerStyle.width = "100%";
    mapContainerStyle.marginLeft = "0";
  }

  const mapDetailsStyle = {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    fontSize: "20px",
  };

  return (
    <div style={{ padding: "30px", position: "relative", paddingTop: "15%" }}>
      <main>
        <div>
          <SearchBar />
          <Filters />
          <div style={gridContainerStyle}>
            <div style={colSpanStyle}>
              {isLoading ? (
                <div
                  style={{
                    margin: "auto",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  <CircularProgress />
                </div>
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
