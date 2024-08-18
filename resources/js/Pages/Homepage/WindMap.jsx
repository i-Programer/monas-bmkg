import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-velocity/dist/leaflet-velocity.min.js';

const WindMap = () => {
  useEffect(() => {
    // Initialize the Leaflet map
    const map = L.map('map').setView([-6.2, 106.8], 8); // Centered on Jakarta

    // Add a tile layer (OpenStreetMap basemap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Example data array from your dataset
    const windData = [
      {
        lat: -6.2,     // Latitude of the location
        lon: 106.8,    // Longitude of the location
        u: -2.1,       // u-component of wind (e.g., calculated from wspeed and wdir)
        v: 1.5,        // v-component of wind (e.g., calculated from wspeed and wdir)
        timestamp: "2023-10-17 15:00:00" // Optional: used for time-based animations
      },
      {
        lat: -6.3,
        lon: 106.9,
        u: -3.2,
        v: 2.4,
        timestamp: "2023-10-17 18:00:00"
      },
      // Add more data points as needed
    ];

    // Convert wind data to GeoJSON format for use in Leaflet
    const windGeoJSON = windData.map((point) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [point.lon, point.lat]
      },
      properties: {
        u: point.u,
        v: point.v,
        timestamp: point.timestamp
      }
    }));

    // Wind data in a format required by Leaflet-Velocity
    const velocityLayer = L.velocityLayer({
      displayValues: true,
      displayOptions: {
        velocityType: 'Global Wind',
        position: 'bottomleft',
        emptyString: 'No wind data',
        showCardinal: true
      },
      data: windGeoJSON,
      maxVelocity: 10,  // Max wind speed for scaling
      velocityScale: 0.01  // Scale for wind vectors
    });

    // Add wind layer to the map
    velocityLayer.addTo(map);

    // Clean up on unmount
    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ width: '100%', height: '600px' }} />;
};

export default WindMap;
