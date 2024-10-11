import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  height: "100vh",
  width: "100%",
};

const center = {
  lat: 24.7136,
  lng: 46.6753,
};

const options = {
  tilt: 45,
  heading: 45,
  mapTypeId: "hybrid",
  zoom: 18,
};

// Initial map styles (can be empty or default)
const initialStyles = [
  {
    featureType: "building",
    elementType: "geometry",
    stylers: [
      { visibility: "on" }, // Ensure buildings are visible
      { lightness: -10 }, // Darken the buildings slightly for depth
    ],
  },
  {
    featureType: "landmark",
    elementType: "geometry.fill",
    stylers: [{ color: "#FFD700" }], // Style landmarks
  },
];

const MapComponent = () => {
  const [selectedFilter, setSelectedFilter] = useState(""); // To track the selected filter
  const [mapStyles, setMapStyles] = useState(initialStyles); // Manage map styles

  // Update the map styles based on the selected filter
  const handleFilterChange = (e) => {
    const filter = e.target.value;
    setSelectedFilter(filter);

    let newStyles = [...initialStyles]; // Start with default styles

    // Update styles based on the filter
    if (filter === "hospitals") {
      newStyles.push({
        featureType: "poi.hospital",
        elementType: "geometry.fill",
        stylers: [{ color: "#00ff00" }, { weight: 1 }], // Style for hospitals
      });
    } else if (filter === "buildings") {
      newStyles.push({
        featureType: "building",
        elementType: "geometry.stroke",
        stylers: [{ color: "#ff0000" }, { weight: 2 }], // Style for buildings
      });
    } else if (filter === "landmarks") {
      newStyles.push({
        featureType: "landmark",
        elementType: "geometry.fill",
        stylers: [{ color: "#FFD700" }], // Style for landmarks
      });
    }

    setMapStyles(newStyles); // Apply the updated styles
  };

  return (
    <div>
      {/* Filter dropdown */}
      <div>
        <label htmlFor="filter">Filter Map Features: </label>
        <select
          id="filter"
          value={selectedFilter}
          onChange={handleFilterChange}
        >
          <option value="">Select a filter</option>
          <option value="hospitals">Hospitals</option>
          <option value="buildings">Buildings</option>
          <option value="landmarks">Landmarks</option>
        </select>
      </div>

      {/* Google Map */}
      <LoadScript googleMapsApiKey="AIzaSyC3TxwdUzV5gbwZN-61Hb1RyDJr0PRSfW4">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          options={{
            ...options,
            styles: mapStyles, // Apply dynamic styles
          }}
          zoom={18}
        >
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;
