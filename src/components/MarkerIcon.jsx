// CustomMarker.jsx
import React, { useEffect, useRef } from 'react';

const API_KEY = "AIzaSyC3TxwdUzV5gbwZN-61Hb1RyDJr0PRSfW4"

const CustomMarker = ({ map, position, text }) => {
  const markerRef = useRef();

  useEffect(() => {
    const markerDiv = document.createElement('div');
    markerDiv.style.background = 'white';
    markerDiv.style.border = '1px solid black';
    markerDiv.style.borderRadius = '100%';
    markerDiv.style.padding = '5px 10px';
    markerDiv.style.textAlign = 'center';
    markerDiv.style.fontSize = '14px';
    markerDiv.style.fontWeight = 'bold';
    markerDiv.style.color = 'red';
    markerDiv.innerHTML = text;

    const customMarker = new window.google.maps.OverlayView();
    customMarker.onAdd = () => {
      const panes = customMarker.getPanes();
      panes.overlayMouseTarget.appendChild(markerDiv);
    };
    customMarker.draw = () => {
      const overlayProjection = customMarker.getProjection();
      const positionLatLng = new window.google.maps.LatLng(position.lat, position.lng);
      const point = overlayProjection.fromLatLngToDivPixel(positionLatLng);
      markerDiv.style.left = point.x + 'px';
      markerDiv.style.top = point.y + 'px';
    };
    customMarker.onRemove = () => {
      markerDiv.parentNode.removeChild(markerDiv);
      markerRef.current = null;
    };

    customMarker.setMap(map);
    markerRef.current = customMarker;

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [map, position, text]);

  return null;
};

export default CustomMarker;
