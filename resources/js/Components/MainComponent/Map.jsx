import React, { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    GeoJSON,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import the Leaflet CSS
import L from "leaflet"; // Import Leaflet for bounds
import "leaflet-velocity";
import choroplethData from "@/data/choroplethData";
import windData from "@/data/windData";
import LayerMap from "./LayerMap";
import StationInfo from "./Station/StationInfo";
import StationDetails from "./Station/StationDetails";

const Map = ({ stadiamaps_api }) => {
    // Define bounds for Indonesia (approximate)
    const indonesiaBounds = [
        [-11, 94], // Southwest corner (roughly around Aceh)
        [6, 141], // Northeast corner (roughly around Papua)
    ];
    const [station_data, setStation_data] = useState([]);
    const [station_status, setStation_status] = useState([]);
    const [loading, setLoading] = useState(false);
    const [color, setColor] = useState("red");
    const [selectedStation, setSelectedStation] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(0)

    const [activeTab, setActiveTab] = useState(1);

    useEffect(() => {
        axios
            .get("/api/import-detailed-data")
            .then((response) => {
                const data = response.data;
                setStation_data(data);

                // Extract statuses from the stations data
                const extractedStatuses = data.map((station) => station.status);
                setStation_status(extractedStatuses);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    const geoJsonStyle = (feature) => {
        if (activeTab == 1) {
            setColor("green");
        } else if (activeTab == 2) {
            setColor("blue");
        } else {
            setColor("red");
        }
        return {
            fillColor: color, // Example based on data
            weight: 1, // Thinner border (default is 2)
            opacity: 1,
            color: "white", // Border color
            dashArray: "3",
            fillOpacity: 0.7,
        };
    };

    const VelocityLayer = () => {
        const map = useMap();

        useEffect(() => {
            const velocityLayer = L.velocityLayer({
                displayValues: true,
                displayOptions: {
                    velocityType: "Global Wind",
                    position: "bottomleft",
                    emptyString: "No velocity data",
                    angleConvention: "bearingCW",
                    showCardinal: false,
                    speedUnit: "ms",
                    directionString: "Direction",
                    speedString: "Speed",
                },
                data: windData,
                minVelocity: 0,
                maxVelocity: 10,
                velocityScale: 0.025,
                opacity: 1,
            });

            velocityLayer.addTo(map);

            return () => {
                map.removeLayer(velocityLayer);
            };
        }, [map]);

        return null;
    };

    return (
        <>
            {/* <div className="flex flex-row justify-between items-stretch"> */}
                <LayerMap activeTab={activeTab} setActiveTab={setActiveTab} />
                <MapContainer
                    center={[-2.5, 118]} // Center the map on Indonesia
                    zoom={5} // Set an initial zoom level
                    maxZoom={8} // Set a maximum zoom level
                    minZoom={4} // Set a minimum zoom level
                    scrollWheelZoom={true} // Enable scroll wheel zoom
                    style={{ height: "100vh", width: "100%" }} // Full-screen map
                    // maxBounds={indonesiaBounds} // Restrict the map to Indonesia bounds
                    // maxBoundsViscosity={1.0} // Prevent dragging outside the bounds
                    
                >
                    <GeoJSON data={choroplethData} style={geoJsonStyle} />
                    {/* <VelocityLayer /> */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url={`https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${stadiamaps_api}`}
                    />

                    {station_data.map((station, i) => (
                        <StationInfo
                            station={station}
                            color={color}
                            selectedStation={selectedStation}
                            selectedMarker={selectedMarker}
                            setSelectedStation={setSelectedStation}
                            setSelectedMarker={setSelectedMarker}
                            markerId={i}
                            key={i}
                        />
                    ))}
                    {/* You can add markers or other features here */}
                </MapContainer>
                <StationDetails setSelectedStation={setSelectedStation} selectedStation={selectedStation} activeTab={activeTab}/>
            {/* </div> */}
        </>
    );
};

export default Map;
