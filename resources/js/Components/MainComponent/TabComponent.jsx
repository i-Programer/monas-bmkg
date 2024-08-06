import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const TabComponent = ({ selectedStation, displacementMap, onTabChange }) => {
    const [activeTab, setActiveTab] = useState(0);

    const [precipitationNwp, setPrecipitationNwp] = useState([]);
    const [precipitationMos, setPrecipitationMos] = useState([]);
    const [relativeHumidityNwp, setRelativeHumidityNwp] = useState([]);
    const [relativeHumidityMos, setRelativeHumidityMos] = useState([]);
    const [temperatureNwp, setTemperatureNwp] = useState([]);
    const [temperatureMos, setTemperatureMos] = useState([]);
    const [statusDate, setStatusDate] = useState([]);

    useEffect(() => {
        if (selectedStation) {
            setPrecipitationNwp(selectedStation.status.map(item => item.prec_nwp));
            setPrecipitationMos(selectedStation.status.map(item => item.prec_mos));
            setRelativeHumidityNwp(selectedStation.status.map(item => item.rh_nwp));
            setRelativeHumidityMos(selectedStation.status.map(item => item.rh_mos));
            setTemperatureNwp(selectedStation.status.map(item => item.t_nwp));
            setTemperatureMos(selectedStation.status.map(item => item.t_mos));
            setStatusDate(selectedStation.status.map(item => formatDate(item.date)));
        }
    }, [selectedStation]);

    useEffect(() => {
        if (onTabChange) {
            onTabChange(activeTab);
        }
    }, [activeTab, onTabChange]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = date.toLocaleDateString(undefined, options);
        return `${formattedDate}`;
    };

    const createChartData = (nwpData, mosData, date) => {
        return nwpData.map((nwp, index) => ({
            date: date[index] || '',
            nwp,
            mos: mosData[index] || 0,
        }));
    };

    const tabs = [
        { title: 'Precipitation Comparison', content: selectedStation ? (
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={createChartData(precipitationNwp, precipitationMos, statusDate)}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="nwp" name="prec_nwp" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="mos" name="prec_mos" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        ) : (
            <p>Select a marker to see the details</p>
        ) },
        { title: 'Relative Humidity Comparison', content: selectedStation ? (
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={createChartData(relativeHumidityNwp, relativeHumidityMos, statusDate)}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="nwp" name="rh_nwp" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="mos" name="rh_mos" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        ) : (
            <p>Select a marker to see the details</p>
        ) },
        { title: 'Temperature Comparison', content: selectedStation ? (
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={createChartData(temperatureNwp, temperatureMos, statusDate)}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="nwp" name="t_nwp" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="mos" name="t_mos" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        ) : (
            <p>Select a marker to see the details</p>
        ) },
    ];

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4">
            <div className="flex flex-wrap mb-4 border-b border-gray-200">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`py-2 px-4 font-semibold focus:outline-none ${
                            activeTab === index
                                ? 'border-b-2 border-blue-500 text-blue-500'
                                : 'text-gray-500'
                        }`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>
            {displacementMap}
            <div className="p-4 mt-4 border rounded-lg bg-white shadow-md">
                {tabs[activeTab].content}
            </div>
        </div>
    );
};

export default TabComponent;
