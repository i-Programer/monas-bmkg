import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import TabComponent from './TabComponent';
import { FaFlask, FaSpinner } from 'react-icons/fa';
import ReactDOMServer from 'react-dom/server';
import { DisplacementMap } from '..';

// Create a custom icon using an HTML element and CSS classes
const createCustomIcon = (size, color) => {
    return L.divIcon({
        html: ReactDOMServer.renderToString(<FaFlask style={{ color, fontSize: `${size}px` }} />),
        className: '',
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
    });
};

// Function to calculate max, mean, and min values from combined data
const calculateCombinedStats = (data, key1, key2) => {
    if (!data || data.length === 0) return { max: 0, mean: 0, min: 0 };
    
    const values = data.flatMap(item => [item[key1], item[key2]]).filter(value => value !== '');
    const sum = values.reduce((a, b) => a + parseFloat(b), 0);
    const mean = (sum / values.length).toFixed(2);
    const max = Math.max(...values).toFixed(2);
    const min = Math.min(...values).toFixed(2);
    
    return { max, mean, min };
};

const useZoomLevel = () => {
    const map = useMap();
    const [zoomLevel, setZoomLevel] = useState(map.getZoom());

    useEffect(() => {
        const onZoom = () => {
            setZoomLevel(map.getZoom());
        };

        map.on('zoom', onZoom);
        return () => {
            map.off('zoom', onZoom);
        };
    }, [map]);

    return zoomLevel;
};

const getColorForValue = (value, min, max) => {
    const red = 255;
    const green = Math.round((value - min) / (max - min) * 255);
    const blue = 0;
    return `rgb(${red}, ${green}, ${blue})`;
};

const MapIndonesia = () => {
    const [stations, setStations] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null);
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        axios.get('/api/import-merged-data')
            .then(response => {
                const data = response.data;
                setStations(data);

                // Extract statuses from the stations data
                const extractedStatuses = data.map(station => station.status);
                setStatuses(extractedStatuses);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    const handleMarkerClick = (station) => {
        setSelectedStation(station);
    };

    const renderPopupContent = (station) => {
        const stats = station.status;
        const precipStats = calculateCombinedStats(stats, 'prec_nwp', 'prec_mos');
        const rhStats = calculateCombinedStats(stats, 'rh_nwp', 'rh_mos');
        const tempStats = calculateCombinedStats(stats, 't_nwp', 't_mos');

        return (
            <div>
                <strong>{station.namaUPT}</strong><br />
                Provinsi: {station.provinsi}<br />
                Kabupaten/Kota: {station.kabKota}<br />
                Elevasi: {station.elevasi} m<br />
                Catatan: {station.catatan}<br />
                <hr className="my-2 border-gray-300" />
                <table className="w-full text-left border-collapse border border-gray-200">
                    <thead>
                        <tr className="border-b border-gray-300">
                            <th className="px-2 py-1 font-semibold">Metric</th>
                            <th className="px-2 py-1 font-semibold">Max</th>
                            <th className="px-2 py-1 font-semibold">Mean</th>
                            <th className="px-2 py-1 font-semibold">Min</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-300">
                            <td className="font-bold px-2 py-1">Precipitation</td>
                            <td className="px-2 py-1">{precipStats.max}</td>
                            <td className="px-2 py-1">{precipStats.mean}</td>
                            <td className="px-2 py-1">{precipStats.min}</td>
                        </tr>
                        <tr className="border-b border-gray-300">
                            <td className="font-bold px-2 py-1">Humidity</td>
                            <td className="px-2 py-1">{rhStats.max}</td>
                            <td className="px-2 py-1">{rhStats.mean}</td>
                            <td className="px-2 py-1">{rhStats.min}</td>
                        </tr>
                        <tr className="border-b border-gray-300">
                            <td className="font-bold px-2 py-1">Temperature</td>
                            <td className="px-2 py-1">{tempStats.max}</td>
                            <td className="px-2 py-1">{tempStats.mean}</td>
                            <td className="px-2 py-1">{tempStats.min}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen w-full">
            <div className="lg:w-1/2 p-4 bg-gray-100 overflow-y-auto">
                <TabComponent 
                    selectedStation={selectedStation} 
                    statuses={statuses} 
                    displacementMap={selectedStation && <DisplacementMap activeProvince={selectedStation.provinsi} />}
                    onTabChange={setActiveTab} 
                />
            </div>
            <div className="lg:w-1/2 w-full relative h-full">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
                        <FaSpinner className="animate-spin text-4xl text-blue-500" />
                    </div>
                ) : (
                    <MapContainer 
                        center={[-2.5, 118]} 
                        zoom={5}
                        minZoom={4} // Set the minimum zoom level
                        maxZoom={8} // Set the maximum zoom level
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap contributors"
                        />
                        <DynamicMarkers 
                            stations={stations} 
                            handleMarkerClick={handleMarkerClick} 
                            renderPopupContent={renderPopupContent} 
                            activeTab={activeTab}
                        />
                    </MapContainer>
                )}
            </div>
        </div>
    );
};

const DynamicMarkers = ({ stations, handleMarkerClick, renderPopupContent, activeTab }) => {
    const zoomLevel = useZoomLevel();
    const minZoomToShowMarkers = 5; // Minimum zoom level to show markers

    const getColorForStation = (station) => {
        const stats = station.status;
        const precipStats = calculateCombinedStats(stats, 'prec_nwp', 'prec_mos');
        const rhStats = calculateCombinedStats(stats, 'rh_nwp', 'rh_mos');
        const tempStats = calculateCombinedStats(stats, 't_nwp', 't_mos');

        let value;
        let min;
        let max;

        switch (activeTab) {
            case 1:
                value = rhStats.mean;
                min = rhStats.min;
                max = rhStats.max;
                break;
            case 2:
                value = tempStats.mean;
                min = tempStats.min;
                max = tempStats.max;
                break;
            case 0:
            default:
                value = precipStats.mean;
                min = precipStats.min;
                max = precipStats.max;
                break;
        }

        return getColorForValue(value, min, max);
    };

    return (
        <>
            {stations.map(station => {
                if (zoomLevel < minZoomToShowMarkers) {
                    return null;
                }

                const iconSize = Math.max(8, Math.min(24, zoomLevel * 3)); // Adjust icon size based on zoom level
                const color = getColorForStation(station);
                const icon = createCustomIcon(iconSize, color);
                return (
                    <Marker 
                        key={station.wmoid} 
                        position={[station.lintang, station.bujur]} 
                        icon={icon}
                        eventHandlers={{
                            click: () => handleMarkerClick(station),
                        }}
                    >
                        <Popup>
                            {renderPopupContent(station)}
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
};

export default MapIndonesia;
