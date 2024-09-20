import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import StationsWeatherDataGraph from "./StationsWeatherDataGraph";
import StationWeatherDataTable from "./StationWeatherDataTable";
import StationWeatherDataInfo from "./StationWeatherDataInfo";
import { IoIosClose, IoIosCloseCircle } from "react-icons/io";
import StationWeatherDataDetailedTable from "./StationWeatherDataDetailedTable";

const StationDetails = ({
    setSelectedStation,
    setSelectedMarker,
    selectedMarker,
    selectedStation,
    activeTab,
}) => {
    const [statusDate, setStatusDate] = useState([]);
    const [statusTime, setStatusTime] = useState([]);

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

    useEffect(() => {
        if (selectedStation) {
            setStatusDate(
                selectedStation.status.map((item) => formatDate(item.date))
            );
            setStatusTime(
                selectedStation.status.map((item) => formatTime(item.date))
            );
        }
    }, [selectedStation]);

    const renderGraph = (activeTab) => {
        return (
            <>
                <StationsWeatherDataGraph
                    selectedStation={selectedStation}
                    activeTab={activeTab}
                    date={statusDate}
                    time={statusTime}
                />
            </>
        );
    };

    const renderTable = (activeTab) => {
        return (
            <>
                <StationWeatherDataTable
                    selectedStation={selectedStation}
                    activeTab={activeTab}
                    date={statusDate}
                    time={statusTime}
                />
            </>
        );
    };

    const handleCloseButton = () => {
        setSelectedMarker(null);
        setSelectedStation(null);
    }

    return (
        <>
            <div className="flex flex-row justify-start items-start absolute left-0 bottom-0 z-[500] w-screen max-h-[30%] overflow-x-hidden">
                <div className="flex flex-row justify-center items-center p-4 bg-slate-500/40 w-full h-100% relativet text-white">
                    {selectedStation ? (
                        <>
                            <button
                                className="absolute text-3xl font-extrabold top-1 right-1 p-2
                                " // This is the button
                                onClick={handleCloseButton}
                            >
                                <IoIosCloseCircle />
                            </button>
                            <div className="flex flex-row justify-center items-stretch gap-y-3 w-full h-full">
                                <div className="flex flex-col justify-start items-start gap-x-9 gap-y-16 w-full h-full max-sm:flex-wrap">
                                    <div className="flex flex-row justify-between items-start gap-x-9 gap-y-16 w-full h-full max-sm:flex-wrap">
                                        {renderTable(activeTab)}
                                        <StationWeatherDataInfo
                                            selectedStation={selectedStation}
                                        />
                                    </div>
                                    <div className="flex flex-row justify-center items-center gap-x-4 w-full h-full">
                                        <StationWeatherDataDetailedTable
                                            selectedStation={selectedStation}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <span className="font-bold">
                                Select a marker to see the details
                            </span>
                        </>
                    )}
                </div>
            </div>
            <div
                className={`${
                    selectedStation
                        ? "absolute w-[50%] opacity-100 h-0"
                        : "opacity-0 pointer-events-none w-0 h-0 overflow-hidden"
                } flex justify-start items-start top-0 right-0 z-[600] transition-all duration-1000 ease-out bg-transparent`}
            >
                <div className="flex flex-row justify-start items-start w-full bg-transparent">
                    <div className="w-full flex flex-col justify-start items-start gap-y-3">
                        {renderGraph(activeTab)}
                    </div>

                    <button
                        className="absolute text-3xl font-extrabold top-1 right-1 p-2 text-white"
                        onClick={handleCloseButton}
                    >
                        <IoIosCloseCircle />
                    </button>
                </div>
            </div>
        </>
    );
};

export default StationDetails;
