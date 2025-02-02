// src/MapComponent.js
import React, { useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const API_KEY = "AIzaSyC3TxwdUzV5gbwZN-61Hb1RyDJr0PRSfW4"

const containerStyle = {
    width: '100%',
    height: '400px'
};


const center = {
    lat: 8.99150046103335,
    lng: 38.773171909982715
};


const createCustomIcon = (text) => {
    const svg = `
      <svg width="30" height="30" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="white" stroke="white" stroke-width="2" />
        <text x="50%" y="50%" text-anchor="middle" stroke="black" dy=".3em" font-size="14" font-weight="bold" fill="red">${text}</text>
      </svg>
    `;
    return {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
    };
};

const locations = [

    {
        id: 1, position: {
            lat: 8.99150046103335,
            lng: 38.773171909982715
        }, text: "37$"
    },

];

const MapComponent = () => {
    const onLoad = useCallback((map) => {
        console.log('Map loaded:', map);
    }, []);

    return (
        <div>
            <LoadScript googleMapsApiKey={API_KEY}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={13}
                    onLoad={onLoad}
                >
                    {locations.map((location, index) => (
                        <Marker key={index} position={location.position} />
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default MapComponent;
