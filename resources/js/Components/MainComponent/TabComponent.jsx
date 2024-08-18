import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const TabComponent = ({ selectedStation, displacementMap, onTabChange }) => {
    const [activeTab, setActiveTab] = useState(0);

    const [precipitationNwp, setPrecipitationNwp] = useState([]);
    const [precipitationMos, setPrecipitationMos] = useState([]);
    const [relativeHumidityNwp, setRelativeHumidityNwp] = useState([]);
    const [relativeHumidityMos, setRelativeHumidityMos] = useState([]);
    const [temperatureNwp, setTemperatureNwp] = useState([]);
    const [temperatureMos, setTemperatureMos] = useState([]);
    const [statusDate, setStatusDate] = useState([]);
    const [statusTime, setStatusTime] = useState([]);
    const [hoveredData, setHoveredData] = useState(null); // State to hold hovered data details

    useEffect(() => {
        if (selectedStation) {
            setPrecipitationNwp(
                selectedStation.status.map((item) => item.prec_nwp)
            );
            setPrecipitationMos(
                selectedStation.status.map((item) => item.prec_mos)
            );
            setRelativeHumidityNwp(
                selectedStation.status.map((item) => item.rh_nwp)
            );
            setRelativeHumidityMos(
                selectedStation.status.map((item) => item.rh_mos)
            );
            setTemperatureNwp(selectedStation.status.map((item) => item.t_nwp));
            setTemperatureMos(selectedStation.status.map((item) => item.t_mos));
            setStatusDate(
                selectedStation.status.map((item) => formatDate(item.date))
            );
            setStatusTime(
                selectedStation.status.map((item) => formatTime(item.date))
            );
        }
    }, [selectedStation]);

    useEffect(() => {
        if (onTabChange) {
            onTabChange(activeTab);
        }
    }, [activeTab, onTabChange]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: "short", day: "numeric", year: "numeric" };
        return date.toLocaleDateString(undefined, options);
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const options = { hour: "2-digit", minute: "2-digit" };
        return date.toLocaleTimeString(undefined, options);
    };

    const createChartData = (nwpData, mosData, date, time) => {
        return nwpData.map((nwp, index) => ({
            date: date[index] || "",
            time: time[index] || "",
            nwp,
            mos: mosData[index] || 0,
            comparison: nwp - (mosData[index] || 0),
        }));
    };

    const CustomTooltip = ({ payload, label }) => {
        if (payload && payload.length) {
            const dataPoint = payload[0].payload;
            setHoveredData(dataPoint); // Update hovered data state
            return (
                <div className="bg-white border p-2 rounded shadow-md">
                    <p>
                        <strong>Date:</strong> {dataPoint.date}
                    </p>
                    <p>
                        <strong>Time:</strong> {dataPoint.time}
                    </p>
                    <p>
                        <strong>NWP:</strong> {dataPoint.nwp}
                    </p>
                    <p>
                        <strong>MOS:</strong> {dataPoint.mos}
                    </p>
                    <p>
                        <strong>Difference:</strong> {dataPoint.comparison}
                    </p>
                </div>
            );
        }
        setHoveredData(null); // Clear hovered data when not hovering
        return null;
    };

    const DetailCard = () => {
        if (!hoveredData) {
            return null; // Hide the card if no point is hovered
        }
        return (
            <div className="bg-white border p-4 rounded-lg shadow-md mt-4">
                <h2 className="text-lg font-semibold mb-2">
                    Details for {hoveredData.date} {hoveredData.time}
                </h2>
                <p>
                    <strong>NWP Value:</strong> {hoveredData.nwp}
                </p>
                <p>
                    <strong>MOS Value:</strong> {hoveredData.mos}
                </p>
                <p>
                    <strong>Difference (NWP - MOS):</strong>{" "}
                    {hoveredData.comparison}
                </p>
            </div>
        );
    };

    const formatNumber = (value) => {
        if (typeof value === "number" && value.toString().includes("e")) {
            return value.toFixed(10).replace(/\.?0+$/, ""); // Convert and remove trailing zeros
        }
        return value;
    };

    // New tab content to display detailed data
    const DetailedDataTable = () => {
        if (!selectedStation || !selectedStation.detailed)
            return <p>No detailed data available</p>;

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* Table Headers */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Temperature (°C)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Dew Point (°C)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Relative Humidity (%)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Wind Speed (m/s)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Wind Direction (°)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Low Cloud (%)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Medium Cloud (%)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                High Cloud (%)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Surface Pressure (Pa)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                CL Mix (kg/kg)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                WAMix (kg/kg)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Outlr (W/m²)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                PBLH (m)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                LIFCL (m)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                CAPE (J/kg)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                MDBZ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                T950 (°C)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                RH950 (%)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                WS950 (m/s)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                WD950 (°)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                T800 (°C)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                RH800 (%)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                WS800 (m/s)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                WD800 (°)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                T500 (°C)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                RH500 (%)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                WS500 (m/s)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                WD500 (°)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Precipitation NWP
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Latitude
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Longitude
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Elevation
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {selectedStation.detailed.map((row, index) => (
                            <tr key={index}>
                                {/* Table Rows with formatNumber applied */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row.lokasi)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row.date)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["suhu2m(degC)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["dew2m(degC)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["rh2m(%)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["wspeed(m/s)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["wdir(deg)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["lcloud(%)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["mcloud(%)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["hcloud(%)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["surpre(Pa)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["clmix(kg/kg)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["wamix(kg/kg)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["outlr(W/m2)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["pblh(m)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["lifcl(m)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["cape(j/kg)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["mdbz"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["t950(degC)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["rh950(%)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["ws950(m/s)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["wd950(deg)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["t800(degC)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["rh800(%)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["ws800(m/s)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["wd800(deg)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["t500(degC)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["rh500(%)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["ws500(m/s)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["wd500(deg)"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["prec_nwp"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["LAT"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["LON"])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(row["ELEV"])}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const tabs = [
        {
            title: "Precipitation Comparison",
            content: selectedStation ? (
                <>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                            data={createChartData(
                                precipitationNwp,
                                precipitationMos,
                                statusDate,
                                statusTime
                            )}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="nwp"
                                name="prec_nwp"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="mos"
                                name="prec_mos"
                                stroke="#82ca9d"
                            />
                            <Line
                                type="monotone"
                                dataKey="comparison"
                                name="Difference (NWP-MOS)"
                                stroke="#ff7300"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <DetailCard />
                </>
            ) : (
                <p>Select a marker to see the details</p>
            ),
        },
        {
            title: "Relative Humidity Comparison",
            content: selectedStation ? (
                <>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                            data={createChartData(
                                relativeHumidityNwp,
                                relativeHumidityMos,
                                statusDate,
                                statusTime
                            )}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="nwp"
                                name="rh_nwp"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="mos"
                                name="rh_mos"
                                stroke="#82ca9d"
                            />
                            <Line
                                type="monotone"
                                dataKey="comparison"
                                name="Difference (NWP-MOS)"
                                stroke="#ff7300"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <DetailCard />
                </>
            ) : (
                <p>Select a marker to see the details</p>
            ),
        },
        {
            title: "Temperature Comparison",
            content: selectedStation ? (
                <>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                            data={createChartData(
                                temperatureNwp,
                                temperatureMos,
                                statusDate,
                                statusTime
                            )}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="nwp"
                                name="t_nwp"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="mos"
                                name="t_mos"
                                stroke="#82ca9d"
                            />
                            <Line
                                type="monotone"
                                dataKey="comparison"
                                name="Difference (NWP-MOS)"
                                stroke="#ff7300"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <DetailCard />
                </>
            ) : (
                <p>Select a marker to see the details</p>
            ),
        },
        { title: "Detailed Data", content: <DetailedDataTable /> },
    ];

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4">
            <div className="flex flex-wrap mb-4 border-b border-gray-200">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`py-2 px-4 font-semibold focus:outline-none ${
                            activeTab === index
                                ? "border-b-2 border-blue-500 text-blue-500"
                                : "text-gray-500"
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
