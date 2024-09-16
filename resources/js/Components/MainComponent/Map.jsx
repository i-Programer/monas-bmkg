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
import { LayerMap, SearchBar } from "..";
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
    const [selectedMarker, setSelectedMarker] = useState(null);

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

    useEffect(() => {
        if (activeTab === 1) {
            setColor("green");
        } else if (activeTab === 2) {
            setColor("blue");
        } else {
            setColor("red");
        }
    }, [activeTab]);

    const geoJsonStyle = (feature) => {
        return {
            fillColor: color, // Example based on data
            weight: 1, // Thinner border (default is 2)
            // opacity: 1,
            fillOpacity: 0.5,
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
                velocityScale: 0.015,
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
            {/* <SearchBar /> */}
            <LayerMap
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedStation={selectedStation}
            />
            <MapContainer
                center={[-2.5, 118]} // Center the map on Indonesia
                zoom={5} // Set an initial zoom level
                maxZoom={8} // Set a maximum zoom level
                minZoom={4} // Set a minimum zoom level
                scrollWheelZoom={true} // Enable scroll wheel zoom
                style={{ height: "100vh", width: "100%" }} // Full-screen map
                // maxBounds={indonesiaBounds} // Restrict the map to Indonesia bounds
                // maxBoundsViscosity={1.0} // Prevent dragging outside the bounds
                zoomControl={false}
            >
                <GeoJSON data={choroplethData} style={geoJsonStyle} />
                <VelocityLayer />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={`https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${stadiamaps_api}`}
                />

                {station_data.map((station, i) => {
                    // Step 3: Interpolate color based on mean temperature (or any other value)
                    const interpolateColor = (value, min, max) => {
                        // Normalize the value between 0 and 1
                        const normalizedValue = (value - min) / (max - min);

                        // Interpolating between yellow (low temp) and red (high temp)
                        const r = 255; // Red remains constant at 255
                        const g = Math.floor(255 * (1 - normalizedValue)); // Green decreases as value increases
                        const b = 0; // Blue remains constant at 0

                        return `rgb(${r},${g},${b})`;
                    };

                    const interpolateColorRH = (value, min, max) => {
                        // Normalize the value between 0 and 1
                        const normalizedValue = (value - min) / (max - min);

                        // Interpolating between white (dry) and blue (humid)
                        const r = Math.floor(255 * (1 - normalizedValue)); // Red decreases as humidity increases
                        const g = Math.floor(255 * (1 - normalizedValue)); // Green decreases as humidity increases
                        const b = 255; // Blue is always full (indicating humid conditions)

                        return `rgb(${r},${g},${b})`;
                    };

                    const interpolateColorPrecip = (value, min, max) => {
                        // Normalize the value between 0 and 1
                        const normalizedValue = (value - min) / (max - min);

                        // Interpolating between light blue (low precip) and dark blue (high precip)
                        const r = 0; // Red is 0 for precipitation
                        const g = Math.floor(255 * (1 - normalizedValue)); // Green decreases with increasing precipitation
                        const b = Math.floor(255 * normalizedValue); // Blue increases with increasing precipitation

                        return `rgb(${r},${g},${b})`;
                    };

                    // Step 1: Extract and combine t_nwp and t_mos values
                    const tValues = station.status
                        .map((s) => [s.t_nwp, s.t_mos])
                        .flat();
                    const rhValues = station.status
                        .map((s) => [s.rh_nwp, s.rh_mos])
                        .flat();
                    const precValues = station.status
                        .map((s) => [s.prec_nwp, s.prec_mos])
                        .flat();

                    // Step 2: Calculate min, max, and mean for t, rh, and prec
                    const minT = Math.min(...tValues);
                    const maxT = Math.max(...tValues);
                    const meanT =
                        tValues.reduce((sum, value) => sum + value, 0) /
                        tValues.length;

                    const minRH = Math.min(...rhValues);
                    const maxRH = Math.max(...rhValues);
                    const meanRH =
                        rhValues.reduce((sum, value) => sum + value, 0) /
                        rhValues.length;

                    const minPrec = Math.min(...precValues);
                    const maxPrec = Math.max(...precValues);
                    const meanPrec =
                        precValues.reduce((sum, value) => sum + value, 0) /
                        precValues.length;

                    // Step 3: Interpolate colors for temperature, humidity, and precipitation
                    const interpolatedColorT = interpolateColor(
                        meanT,
                        minT,
                        maxT
                    );
                    const interpolatedColorRH = interpolateColorRH(
                        meanRH,
                        minRH,
                        maxRH
                    );
                    const interpolatedColorPrecip = interpolateColorPrecip(
                        meanPrec,
                        minPrec,
                        maxPrec
                    );

                    let selectedInterpolatedColor;

                    if (activeTab == 1) {
                        selectedInterpolatedColor = interpolatedColorPrecip;
                    } else if (activeTab == 2) {
                        selectedInterpolatedColor = interpolatedColorRH;
                    } else {
                        selectedInterpolatedColor = interpolatedColorT;
                    }

                    return (
                        <StationInfo
                            station={station}
                            color={selectedInterpolatedColor} // Pass the interpolated color as a prop
                            selectedStation={selectedStation}
                            selectedMarker={selectedMarker}
                            setSelectedStation={setSelectedStation}
                            setSelectedMarker={setSelectedMarker}
                            markerId={i}
                            key={i}
                        />
                    );
                })}

                {/* You can add markers or other features here */}
            </MapContainer>
            <StationDetails
                setSelectedStation={setSelectedStation}
                selectedStation={selectedStation}
                activeTab={activeTab}
            />
            {/* </div> */}
        </>
    );
};

export default Map;
