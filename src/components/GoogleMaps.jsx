/* global google */
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const apiOptions = {
  apiKey: "AIzaSyC3TxwdUzV5gbwZN-61Hb1RyDJr0PRSfW4", // Replace with your valid Google Maps API key
  version: "beta",
  mapIds: ["a314de021ad49107"], // Ensure this map ID is valid
};

const MapComponent = ({ vehicles = [] }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const markersRef = useRef([]);
  const infoWindowsRef = useRef([]);

  // Enhanced color generator with better differentiation
  const getVehicleColor = (make) => {
    const safeMake = (make || "unknown").toLowerCase();
    const colorMap = {
      toyota: "#FF1744", // Red
      honda: "#00E676", // Green
      ford: "#2979FF", // Blue
      bmw: "#FF9100", // Orange
      mercedes: "#D500F9", // Purple
      hyundai: "#FFEA00", // Yellow
      default: "#607D8B", // Gray for unknown
    };

    return colorMap[safeMake] || colorMap.default;
  };

  // Car icon for pickup locations
  const createPickupIcon = (color) => ({
    path: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z",
    fillColor: color,
    fillOpacity: 0.9,
    strokeColor: "#333",
    strokeWeight: 1,
    scale: 1.5,
    anchor: new google.maps.Point(12, 24),
  });

  // Flag icon for dropoff locations
  const createDropoffIcon = (color) => ({
    path: "M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z",
    fillColor: color,
    fillOpacity: 0.9,
    strokeColor: "#333",
    strokeWeight: 1,
    scale: 1.5,
    anchor: new google.maps.Point(12, 24),
  });

  // Initialize the map
  useEffect(() => {
    const initMap = async () => {
      try {
        const apiLoader = new Loader(apiOptions);
        await apiLoader.load();

        const mapInstance = new google.maps.Map(mapRef.current, {
          zoom: 12,
          center: { lat: 9.0054, lng: 38.7636 }, // Default to Addis Ababa
          mapId: "a314de021ad49107", // Ensure this map ID is valid
          disableDefaultUI: true, // Cleaner UI
        });

        setMap(mapInstance);
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    initMap();
  }, []);

  // Add markers and info windows
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    infoWindowsRef.current.forEach((infoWindow) => infoWindow.close());
    infoWindowsRef.current = [];

    vehicles.forEach((vehicle) => {
      const color = getVehicleColor(vehicle?.make);
      const make = vehicle?.make || "Unknown Make";
      const model = vehicle?.model || "Unknown Model";
      const price = vehicle?.price
        ? `${vehicle.price} ETB/day`
        : "Call for price";

      // Process pickup locations
      (vehicle?.pickUp || []).forEach(([lat, lng]) => {
        if (!lat || !lng) return;

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map,
          icon: createPickupIcon(color),
          title: `${make} ${model} - Pickup`,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2 min-w-[200px]">
              <div class="flex items-center mb-2">
                <div class="w-4 h-4 rounded-full mr-2" style="background: ${color}"></div>
                <h3 class="font-bold text-lg">${make} ${model}</h3>
              </div>
              <div class="flex justify-between">
                <span class="text-sm">Daily Rate:</span>
                <span class="font-semibold">${price}</span>
              </div>
              <div class="mt-2 text-sm flex items-center">
                <span class="mr-2">📍 Pickup Location</span>
              </div>
              <div class="mt-1 text-xs text-gray-600">Click for details</div>
            </div>
          `,
        });

        marker.addListener("click", () => {
          // Zoom and center on marker
          map.setZoom(16);
          map.panTo(marker.getPosition());

          infoWindowsRef.current.forEach((iw) => iw.close());
          infoWindow.open(map, marker);
        });

        markersRef.current.push(marker);
        infoWindowsRef.current.push(infoWindow);
      });

      // Process dropoff locations
      (vehicle?.dropOff || []).forEach(([lat, lng]) => {
        if (!lat || !lng) return;

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map,
          icon: createDropoffIcon(color),
          title: `${make} ${model} - Dropoff`,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2 min-w-[200px]">
              <div class="flex items-center mb-2">
                <div class="w-4 h-4 rounded-full mr-2" style="background: ${color}"></div>
                <h3 class="font-bold text-lg">${make} ${model}</h3>
              </div>
              <div class="flex justify-between">
                <span class="text-sm">Daily Rate:</span>
                <span class="font-semibold">${price}</span>
              </div>
              <div class="mt-2 text-sm flex items-center">
                <span class="mr-2">🏁 Dropoff Location</span>
              </div>
              <div class="mt-1 text-xs text-gray-600">Click for details</div>
            </div>
          `,
        });

        marker.addListener("click", () => {
          // Zoom and center on marker
          map.setZoom(18);
          map.panTo(marker.getPosition());

          infoWindowsRef.current.forEach((iw) => iw.close());
          infoWindow.open(map, marker);
        });

        markersRef.current.push(marker);
        infoWindowsRef.current.push(infoWindow);
      });
    });
  }, [vehicles, map]);

  return (
    <div
      id="map"
      ref={mapRef}
      style={{ height: "720px", width: "100%" }} // Ensure the map container has a defined size
      className="rounded-lg"
    />
  );
};

export default MapComponent;
