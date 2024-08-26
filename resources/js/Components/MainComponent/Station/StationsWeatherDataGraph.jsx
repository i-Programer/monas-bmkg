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

const StationsWeatherDataGraph = ({
    selectedStation,
    date,
    time,
    activeTab,
}) => {
    const [hoveredData, setHoveredData] = useState(null); // State to hold hovered data detail

    const [nwp, setNwp] = useState([]);
    const [mos, setMos] = useState([]);

    useEffect(() => {
        if (selectedStation) {
            const precipNwp = selectedStation.status.map((item) => item.prec_nwp);
            const precipMos = selectedStation.status.map((item) => item.prec_mos);
            const rhNwp = selectedStation.status.map((item) => item.rh_nwp);
            const rhMos = selectedStation.status.map((item) => item.rh_mos);
            const tempNwp = selectedStation.status.map((item) => item.t_nwp);
            const tempMos = selectedStation.status.map((item) => item.t_mos);
            console.log("Active Tab", activeTab)

            switch (activeTab) {
                case 1:
                    setNwp(precipNwp);
                    setMos(precipMos);
                    break;
                case 2:
                    setNwp(rhNwp);
                    setMos(rhMos);
                    break;
                case 3:
                    setNwp(tempNwp);
                    setMos(tempMos);
                    break;
                default:
                    setNwp([]);
                    setMos([]);
                    break;
            }
        }
    }, [selectedStation, activeTab]);

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

    const createChartData = (nwpData, mosData, date, time) => {
        return nwpData.map((nwp, index) => ({
            date: date[index] || "",
            time: time[index] || "",
            nwp,
            mos: mosData[index] || 0,
            comparison: nwp - (mosData[index] || 0),
        }));
    };

    return (
        <>
            {selectedStation && (
                <>
                    <ResponsiveContainer
                        width="100%"
                        height={300}
                        className={"text bg-slate-500/20 pt-4 rounded-bl-md"}
                    >
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
                            <XAxis
                                dataKey="date"
                                tick={{ fill: "white", fontSize: 14 }}
                            />
                            <YAxis tick={{ fill: "white", fontSize: 14 }} />
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
            )}
        </>
    );
};

export default StationsWeatherDataGraph;
