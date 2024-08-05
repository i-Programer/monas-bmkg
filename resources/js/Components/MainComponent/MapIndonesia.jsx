import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import TabComponent from './TabComponent';
import { FaFlask } from 'react-icons/fa';  // Importing the laboratory icon
import ReactDOMServer from 'react-dom/server'; // Import ReactDOMServer

// Create a custom icon using an HTML element and CSS classes
const createCustomIcon = () => {
    return L.divIcon({
        html: ReactDOMServer.renderToString(<FaFlask style={{ color: 'red', fontSize: '24px' }} />),
        className: '',  // No additional class needed
        iconSize: [24, 24],  // Size of the icon
        iconAnchor: [12, 24],  // Anchor point of the icon
    });
};

const MapIndonesia = () => {
    const [stations, setStations] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null);
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        axios.get('/api/import-merged-data')
            .then(response => {
                const data = response.data;
                setStations(data);

                // Extract statuses from the stations data
                const extractedStatuses = data.map(station => station.Status);
                setStatuses(extractedStatuses);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleMarkerClick = (station) => {
        setSelectedStation(station);
    };

    return (
        <div className="flex h-screen w-full">
            <div className="w-[50%] p-4 bg-gray-100 overflow-y-auto">
                <TabComponent selectedStation={selectedStation} statuses={statuses} />
            </div>
            <div className="w-full">
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
                            key={station.WMOID} 
                            position={[station.lintang, station.bujur]} 
                            icon={createCustomIcon()}
                            eventHandlers={{
                                click: () => handleMarkerClick(station),
                            }}
                        >
                            <Popup>
                                <strong>{station.namaUPT}</strong><br />
                                Provinsi: {station.provinsi}<br />
                                Kabupaten/Kota: {station.kabKota}<br />
                                Elevasi: {station.elevasi} m<br />
                                Catatan: {station.catatan}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapIndonesia;
