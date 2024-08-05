import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import TabComponent from './TabComponent';
import { FaFlask } from 'react-icons/fa';
import ReactDOMServer from 'react-dom/server';
import { FaSpinner } from 'react-icons/fa';
import { DisplacementMap } from '..';


// Create a custom icon using an HTML element and CSS classes
const createCustomIcon = () => {
    return L.divIcon({
        html: ReactDOMServer.renderToString(<FaFlask style={{ color: 'red', fontSize: '24px' }} />),
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 24],
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

const MapIndonesia = () => {
    const [stations, setStations] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null);
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);

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
                <hr className="my-2" />
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2">
                            <th className="px-2 py-1"></th>
                            <th className="px-2 py-1">Max</th>
                            <th className="px-2 py-1">Mean</th>
                            <th className="px-2 py-1">Min</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="font-bold px-2 py-1">Precipitation</td>
                            <td className="px-2 py-1">{precipStats.max}</td>
                            <td className="px-2 py-1">{precipStats.mean}</td>
                            <td className="px-2 py-1">{precipStats.min}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="font-bold px-2 py-1">Humidity</td>
                            <td className="px-2 py-1">{rhStats.max}</td>
                            <td className="px-2 py-1">{rhStats.mean}</td>
                            <td className="px-2 py-1">{rhStats.min}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="font-bold px-2 py-1">Temperature</td>
                            <td className="px-2 py-1">{tempStats.max}</td>
                            <td className="px-2 py-1">{tempStats.mean}</td>
                            <td className="px-2 py-1">{tempStats.min}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="mt-4" style={{ height: "200px" }}>
                    <DisplacementMap activeProvince={station.provinsi} />
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen w-full">
            <div className="w-[50%] p-4 bg-gray-100 overflow-y-auto">
                <TabComponent selectedStation={selectedStation} statuses={statuses} />
            </div>
            <div className="w-full relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
                        <FaSpinner className="animate-spin text-4xl text-blue-500" />
                    </div>
                ) : (
                    <MapContainer 
                        center={[-2.5, 118]} 
                        zoom={5} 
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap contributors"
                        />
                        {stations.map(station => (
                            <Marker 
                                key={station.wmoid} 
                                position={[station.lintang, station.bujur]} 
                                icon={createCustomIcon()}
                                eventHandlers={{
                                    click: () => handleMarkerClick(station),
                                }}
                            >
                                <Popup>
                                    {renderPopupContent(station)}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>
        </div>
    );
};

export default MapIndonesia;
