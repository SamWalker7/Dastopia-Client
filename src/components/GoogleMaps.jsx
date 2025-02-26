/* global google */

// MapComponent.jsx
import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const apiOptions = {
  apiKey: "AIzaSyC3TxwdUzV5gbwZN-61Hb1RyDJr0PRSfW4",
  version: "beta",
  mapIds: "a314de021ad49107", // Optional: Use your map style ID
};

const mapOptions = {
  tilt: 45,
  heading: 0,
  zoom: 17,
  center: { lat: 52.5213998, lng: 13.4182682 }, // Your desired coordinates
  mapId: "a314de021ad49107", // Optional: Use your map style ID
};

const MapComponent = () => {
  const mapRef = useRef(null); // Reference for the map div

  useEffect(() => {
    const initMap = async () => {
      const apiLoader = new Loader(apiOptions);
      await apiLoader.load();

      const map = new google.maps.Map(mapRef.current, mapOptions);
      initWebGLOverlay(map); // Initialize WebGL overlay
    };

    const initWebGLOverlay = (map) => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera();
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });

      // Set the renderer size
      renderer.setSize(window.innerWidth, window.innerHeight);
      mapRef.current.appendChild(renderer.domElement); // Append renderer to map div

      const gltfLoader = new GLTFLoader();
      gltfLoader.load("/path/to/model.gltf", (gltf) => {
        scene.add(gltf.scene); // Add the loaded model to the scene
      });

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();
    };

    initMap();
  }, []);

  return (
    <div
      id="map"
      ref={mapRef}
      className="  rounded-lg lg:h-[720px] md:h-[500px] h-[400px]"
    />
  );
};

export default MapComponent;
