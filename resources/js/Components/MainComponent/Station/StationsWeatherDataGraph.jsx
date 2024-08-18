import React, { useState } from "react";
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

const StationsWeatherDataGraph = ({ nwp, mos, date, time, activeTab }) => {
    const [hoveredData, setHoveredData] = useState(null); // State to hold hovered data details

    const createChartData = (nwpData, mosData, date, time) => {
        return nwpData.map((nwp, index) => ({
            date: date[index] || "",
            time: time[index] || "",
            nwp,
            mos: mosData[index] || 0,
            comparison: nwp - (mosData[index] || 0),
        }));
    };

    const CustomTooltip = ({ payload, label, active }) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;

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

    return (
        <>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={createChartData(nwp, mos, date, time)}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
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
    );
};

export default StationsWeatherDataGraph;
