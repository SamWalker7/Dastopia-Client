/* global google */
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const apiOptions = {
  apiKey: "AIzaSyC3TxwdUzV5gbwZN-61Hb1RyDJr0PRSfW4", // Replace with your valid Google Maps API key
  version: "beta",
  mapIds: ["a314de021ad49107"], // Ensure this map ID is valid, e.g., a314de021ad49107
};

const MapComponent = ({ vehicles = [] }) => {
  const mapRef = useRef(null);
  const parentRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const markersRef = useRef([]);
  const infoWindowsRef = useRef([]);

  const getVehicleColor = (make) => {
    const safeMake = (make || "unknown").toLowerCase();
    const colorMap = {
      toyota: "#FF1744",
      honda: "#00E676",
      ford: "#2979FF",
      bmw: "#FF9100",
      mercedes: "#D500F9",
      hyundai: "#FFEA00",
      default: "#607D8B",
    };
    return colorMap[safeMake] || colorMap.default;
  };

  const createPickupIcon = (color) => ({
    path: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z",
    fillColor: color,
    fillOpacity: 0.9,
    strokeColor: "#333",
    strokeWeight: 1,
    scale: 1.5,
    anchor: new google.maps.Point(12, 24),
  });

  // Distinct icon for dropoff locations (e.g., a flag or different colored standard pin)
  const createDropoffIcon = (color) => ({
    // Using a standard Google Maps pin but with a different color or a simple flag
    // path: google.maps.SymbolPath.CIRCLE, // Simple circle
    path: "M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z", // Flag icon
    fillColor: color, // Can use a different color scheme for dropoff if desired
    fillOpacity: 0.9,
    strokeColor: "#FFFFFF", // White stroke for better contrast
    strokeWeight: 1,
    scale: 1.5,
    anchor: new google.maps.Point(12, 24), // Adjust anchor as needed for the flag
  });

  useEffect(() => {
    const initMap = async () => {
      if (
        apiOptions.apiKey === "YOUR_GOOGLE_MAPS_API_KEY" ||
        !apiOptions.mapIds[0] ||
        apiOptions.mapIds[0] === "YOUR_MAP_ID"
      ) {
        console.error(
          "Please replace 'YOUR_GOOGLE_MAPS_API_KEY' and 'YOUR_MAP_ID' with your actual Google Maps API key and Map ID in MapComponent.js"
        );
        // Optionally display an error message on the map itself
        if (mapRef.current)
          mapRef.current.innerHTML =
            '<div style="padding: 20px; text-align: center; color: red;">Map configuration error. Please check API Key and Map ID.</div>';
        return;
      }
      try {
        const apiLoader = new Loader(apiOptions);
        await apiLoader.load();
        const mapInstance = new google.maps.Map(mapRef.current, {
          zoom: 12,
          center: { lat: 9.0054, lng: 38.7636 },
          mapId: apiOptions.mapIds[0],
          disableDefaultUI: true,
        });
        setMap(mapInstance);
      } catch (error) {
        console.error("Error loading Google Maps:", error);
        if (mapRef.current)
          mapRef.current.innerHTML = `<div style="padding: 20px; text-align: center; color: red;">Error loading map: ${error.message}</div>`;
      }
    };
    initMap();
  }, []);

  useEffect(() => {
    if (!map || !vehicles || vehicles.length === 0) {
      // Clear existing markers if vehicles array becomes empty or map is not ready
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      infoWindowsRef.current.forEach((infoWindow) => infoWindow.close());
      infoWindowsRef.current = [];
      return;
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    infoWindowsRef.current.forEach((infoWindow) => infoWindow.close());
    infoWindowsRef.current = [];

    const bounds = new google.maps.LatLngBounds();
    let hasValidLocations = false;

    vehicles.forEach((vehicle) => {
      const color = getVehicleColor(vehicle?.make);
      const make = vehicle?.make || "Unknown Make";
      const model = vehicle?.model || "Unknown Model";
      const price = vehicle?.price
        ? `${vehicle.price} ETB/day`
        : "Call for price";

      // Process pickup locations
      (vehicle?.pickUp || []).forEach((loc) => {
        // Handle both [lat,lng] and {lat,lng} or {position:{lat,lng}}
        let lat, lng;
        if (Array.isArray(loc) && loc.length === 2) {
          [lat, lng] = loc;
        } else if (loc && loc.lat && loc.lng) {
          ({ lat, lng } = loc);
        } else if (
          loc &&
          loc.position &&
          loc.position.lat &&
          loc.position.lng
        ) {
          ({ lat, lng } = loc.position);
        } else {
          console.warn("Invalid pickup location data:", loc);
          return;
        }

        if (
          typeof lat !== "number" ||
          typeof lng !== "number" ||
          isNaN(lat) ||
          isNaN(lng)
        ) {
          console.warn("Skipping invalid pickup coordinate:", lat, lng);
          return;
        }

        const position = { lat, lng };
        const marker = new google.maps.Marker({
          position,
          map,
          icon: createPickupIcon(color),
          title: `${make} ${model} - Pickup`,
        });
        bounds.extend(position);
        hasValidLocations = true;

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2 min-w-[200px]">
              <div class="flex items-center mb-2">
                <div class="w-4 h-4 rounded-full mr-2" style="background: ${color}"></div>
                <h3 class="font-bold text-lg">${make} ${model}</h3>
              </div>
              <div class="flex justify-between text-sm"><span>Daily Rate:</span><span class="font-semibold">${price}</span></div>
              <div class="mt-2 text-sm flex items-center"><span class="mr-2 text-green-600 font-semibold">▲ Pickup Location</span></div>
            </div>`,
        });
        marker.addListener("click", () => {
          map.setZoom(16);
          map.panTo(marker.getPosition());
          infoWindowsRef.current.forEach((iw) => iw.close());
          infoWindow.open(map, marker);
        });
        markersRef.current.push(marker);
        infoWindowsRef.current.push(infoWindow);
      });

      // Process dropoff locations
      (vehicle?.dropOff || []).forEach((loc) => {
        let lat, lng;
        if (Array.isArray(loc) && loc.length === 2) {
          [lat, lng] = loc;
        } else if (loc && loc.lat && loc.lng) {
          ({ lat, lng } = loc);
        } else if (
          loc &&
          loc.position &&
          loc.position.lat &&
          loc.position.lng
        ) {
          ({ lat, lng } = loc.position);
        } else {
          console.warn("Invalid dropoff location data:", loc);
          return;
        }

        if (
          typeof lat !== "number" ||
          typeof lng !== "number" ||
          isNaN(lat) ||
          isNaN(lng)
        ) {
          console.warn("Skipping invalid dropoff coordinate:", lat, lng);
          return;
        }

        const position = { lat, lng };
        // Using a different color for dropoff icon for differentiation, or use createDropoffIcon
        const dropoffColor = "#AD1457"; // Example: A shade of purple/pink for dropoff
        const marker = new google.maps.Marker({
          position,
          map,
          icon: createDropoffIcon(dropoffColor),
          title: `${make} ${model} - Drop-off`,
        });
        bounds.extend(position);
        hasValidLocations = true;

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2 min-w-[200px]">
              <div class="flex items-center mb-2">
                <div class="w-4 h-4 rounded-full mr-2" style="background: ${dropoffColor}"></div>
                <h3 class="font-bold text-lg">${make} ${model}</h3>
              </div>
              <div class="flex justify-between text-sm"><span>Daily Rate:</span><span class="font-semibold">${price}</span></div>
              <div class="mt-2 text-sm flex items-center"><span class="mr-2 text-pink-700 font-semibold">▼ Drop-off Location</span></div>
            </div>`,
        });
        marker.addListener("click", () => {
          map.setZoom(16);
          map.panTo(marker.getPosition());
          infoWindowsRef.current.forEach((iw) => iw.close());
          infoWindow.open(map, marker);
        });
        markersRef.current.push(marker);
        infoWindowsRef.current.push(infoWindow);
      });
    });

    if (hasValidLocations && !bounds.isEmpty() && vehicles.length > 0) {
      // Only fit bounds if there's one vehicle and multiple locations, or multiple vehicles.
      // If only one vehicle with one pickup and one dropoff that are the same, fitBounds might zoom too far.
      if (
        vehicles.length > 1 ||
        (markersRef.current.length > 1 &&
          !bounds.getCenter().equals(bounds.getSouthWest()))
      ) {
        map.fitBounds(bounds);
      } else if (markersRef.current.length === 1) {
        map.setCenter(bounds.getCenter());
        map.setZoom(15); // Default zoom for single marker
      }
    } else if (!hasValidLocations && map) {
      map.setCenter({ lat: 9.0054, lng: 38.7636 }); // Reset to default if no locations
      map.setZoom(12);
    }
  }, [vehicles, map]); // Removed getVehicleColor, createPickupIcon, createDropoffIcon from deps as they are stable

  useEffect(() => {
    const parentElement = parentRef.current;
    if (!parentElement) return;
    const handleFullscreenChange = () => {
      const currentlyFullscreen = document.fullscreenElement === parentElement;
      setIsFullscreen(currentlyFullscreen);
      if (map) {
        setTimeout(() => {
          google.maps.event.trigger(map, "resize");
          const currentCenter = map.getCenter();
          if (currentCenter) map.setCenter(currentCenter);
          else map.setCenter({ lat: 9.0054, lng: 38.7636 });
        }, 100);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [map]);

  const handleFullscreenToggle = () => {
    const parentElement = parentRef.current;
    if (!parentElement) return;
    if (!document.fullscreenElement) {
      if (parentElement.requestFullscreen) parentElement.requestFullscreen();
      else if (parentElement.mozRequestFullScreen)
        parentElement.mozRequestFullScreen();
      else if (parentElement.webkitRequestFullscreen)
        parentElement.webkitRequestFullscreen();
      else if (parentElement.msRequestFullscreen)
        parentElement.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  };

  return (
    <div
      ref={parentRef}
      className={`relative rounded-lg overflow-hidden ${
        isFullscreen ? "w-screen h-screen fixed top-0 left-0 z-[200]" : ""
      }`} // Ensure fullscreen is on top
      style={{ height: isFullscreen ? "100vh" : "400px", width: "100%" }} // Default height for non-fullscreen
    >
      <div id="map" ref={mapRef} style={{ height: "100%", width: "100%" }} />
      <button
        onClick={handleFullscreenToggle}
        className="absolute top-2 right-2 bg-white p-2 rounded-md shadow-lg z-10 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        title={isFullscreen ? "Exit Fullscreen (Esc)" : "View Fullscreen"}
      >
        {isFullscreen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />{" "}
            {/* Simpler exit icon */}
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default MapComponent;
