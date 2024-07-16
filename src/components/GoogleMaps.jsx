// src/MapComponent.js
import React, { useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const API_KEY = "AIzaSyC3TxwdUzV5gbwZN-61Hb1RyDJr0PRSfW4"

const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

const locations = [
    { lat: -3.745, lng: -38.523 },
    { lat: -3.755, lng: -38.533 },
    { lat: -3.765, lng: -38.543 }
];

const MapComponent = () => {
    const onLoad = useCallback((map) => {
        console.log('Map loaded:', map);
    }, []);

    return (
        <div style={{paddingTop: "200px"}}>
            <LoadScript googleMapsApiKey={API_KEY}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                    onLoad={onLoad}
                >
                    {locations.map((location, index) => (
                        <Marker key={index} position={location} />
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default MapComponent;
