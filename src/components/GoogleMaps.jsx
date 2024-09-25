// src/MapComponent.js
import React, { useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

export const API_KEY = "AIzaSyC3TxwdUzV5gbwZN-61Hb1RyDJr0PRSfW4"

const containerStyle = {
    width: '100%',
    height: '400px'
};


const center = {
    lat: 8.99150046103335,
    lng: 38.773171909982715
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
