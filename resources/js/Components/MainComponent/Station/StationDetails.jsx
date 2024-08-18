import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import StationsWeatherDataGraph from "./StationsWeatherDataGraph";
import StationWeatherDataTable from "./StationWeatherDataTable";
import StationWeatherDataInfo from "./StationWeatherDataInfo";
import { IoIosClose, IoIosCloseCircle } from "react-icons/io";

const StationDetails = ({ setSelectedStation, selectedStation, activeTab }) => {
    const [precipitationNwp, setPrecipitationNwp] = useState([]);
    const [precipitationMos, setPrecipitationMos] = useState([]);
    const [relativeHumidityNwp, setRelativeHumidityNwp] = useState([]);
    const [relativeHumidityMos, setRelativeHumidityMos] = useState([]);
    const [temperatureNwp, setTemperatureNwp] = useState([]);
    const [temperatureMos, setTemperatureMos] = useState([]);
    const [statusDate, setStatusDate] = useState([]);
    const [statusTime, setStatusTime] = useState([]);

    // console.log(activeTab);

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

    const formatNumber = (value) => {
        if (typeof value === "number" && value.toString().includes("e")) {
            return value.toFixed(10).replace(/\.?0+$/, ""); // Convert and remove trailing zeros
        }
        return value;
    };

    const renderGraph = (activeTab) => {
        if (activeTab == 1) {
            return (
                <>
                    <div className="flex justify-center items-center h-full w-full">
                        <StationsWeatherDataGraph
                            date={statusDate}
                            time={statusTime}
                            mos={precipitationMos}
                            nwp={precipitationNwp}
                        />
                    </div>
                </>
            );
        } else if (activeTab == 2) {
            return (
                <>
                    <div className="flex justify-center items-center h-full w-full">
                        <StationsWeatherDataGraph
                            date={statusDate}
                            time={statusTime}
                            mos={relativeHumidityMos}
                            nwp={relativeHumidityNwp}
                        />
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className="flex justify-center items-center h-full w-full">
                        <StationsWeatherDataGraph
                            date={statusDate}
                            time={statusTime}
                            mos={temperatureMos}
                            nwp={temperatureNwp}
                        />
                    </div>
                </>
            );
        }
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

    return (
        <>
            <div className="flex flex-row justify-start items-start absolute left-0 bottom-0 z-[500] w-screen max-h-[35%] overflow-x-hidden">
                <div className="flex flex-row justify-center items-center p-4 bg-slate-100 w-full h-100% relative">
                    {selectedStation ? (
                        <>
                            <button
                                className="absolute text-3xl font-extrabold top-1 right-1"
                                onClick={() => setSelectedStation(null)}
                            >
                                <IoIosCloseCircle />
                            </button>
                            <div className="flex flex-row justify-center items-stretch gap-y-3 w-full h-full">
                                <div className="flex flex-row justify-start items-start gap-x-9 gap-y-16 w-full h-full max-sm:flex-wrap">
                                    {renderTable(activeTab)}
                                    <StationWeatherDataInfo
                                        selectedStation={selectedStation}
                                    />
                                </div>
                                {/* <div className="flex justify-center items-center w-full h-full">
                                <div className="flex justify-center items-center h-full w-full">
                                    <div className="overflow-x-auto overflow-y-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
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
                                                {selectedStation.detailed.map(
                                                    (row, index) => (
                                                        <tr key={index}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row.lokasi
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row.date
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "suhu2m(degC)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "dew2m(degC)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "rh2m(%)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "wspeed(m/s)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "wdir(deg)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "lcloud(%)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "mcloud(%)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "hcloud(%)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "surpre(Pa)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "clmix(kg/kg)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "wamix(kg/kg)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "outlr(W/m2)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "pblh(m)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "lifcl(m)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "cape(j/kg)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row["mdbz"]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "t950(degC)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "rh950(%)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "ws950(m/s)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "wd950(deg)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "t800(degC)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "rh800(%)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "ws800(m/s)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "wd800(deg)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "t500(degC)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "rh500(%)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "ws500(m/s)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "wd500(deg)"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row[
                                                                        "prec_nwp"
                                                                    ]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row["LAT"]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row["LON"]
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatNumber(
                                                                    row["ELEV"]
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div> */}
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
        </>
    );
};

export default StationDetails;
