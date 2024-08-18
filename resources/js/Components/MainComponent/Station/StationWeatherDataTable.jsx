import React, { useEffect, useState } from "react";

const StationWeatherDataTable = ({
    selectedStation,
    activeTab,
    date,
    time,
}) => {
    const [timeCheckpoint, setTimeCheckpoint] = useState([]);

    const extractDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: "numeric", day: "numeric", year: "numeric" };
        return date.toLocaleDateString(undefined, options);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: "short", day: "numeric", year: "numeric" };
        return date.toLocaleDateString(undefined, options);
    };

    const extractTIme = (dateString) => {
        const date = new Date(dateString);
        const options = { hour: "2-digit", minute: "2-digit" };
        return date.toLocaleTimeString(undefined, options);
    };

    useEffect(() => {
        // Create a map to group data by date
        const dateMap = new Map();

        selectedStation.status.forEach((dateTime) => {
            const date = extractDate(dateTime.date);
            const time = extractTIme(dateTime.date);

            // Check if the date already exists in the map
            if (dateMap.has(date)) {
                // If it exists, add the time to the existing timeList
                const existingEntry = dateMap.get(date);
                existingEntry.timeList.push(time);
                existingEntry.temperatureNwpList.push(dateTime.t_nwp);
                existingEntry.temperatureMosList.push(dateTime.t_mos);
                existingEntry.relativeHumidityNwpList.push(dateTime.rh_nwp);
                existingEntry.relativeHumidityMosList.push(dateTime.rh_mos);
                existingEntry.precipitationNwpList.push(dateTime.prec_nwp);
                existingEntry.precipitationMosList.push(dateTime.prec_mos);
            } else {
                // If it doesn't exist, create a new entry
                dateMap.set(date, {
                    date,
                    timeList: [time],
                    temperatureNwpList: [dateTime.t_nwp],
                    temperatureMosList: [dateTime.t_mos],
                    relativeHumidityNwpList: [dateTime.rh_nwp],
                    relativeHumidityMosList: [dateTime.rh_mos],
                    precipitationNwpList: [dateTime.prec_nwp],
                    precipitationMosList: [dateTime.prec_mos],
                });
            }
        });

        // Convert the map into an array and calculate dateCount
        const groupedData = Array.from(dateMap.values()).map((entry) => ({
            ...entry,
            dateCount: entry.timeList.length,
        }));

        // Update the state with the grouped data
        setTimeCheckpoint(groupedData);
    }, [selectedStation]);

    const renderTableRow = (mainData, activeTab, dataLabel, label) => {
        const stationData = mainData.flatMap((index) => index[dataLabel]);
        // console.log(stationData)
        return (
            <>
                <tr className="text-bold text-center flex-row items-center">
                    <td className="font-bold text-base pr-3 pb-2">{label}</td>
                    {stationData.length > 0 ? (
                        stationData.map((tableData, index) => (
                            <td
                                key={index}
                                className={`${
                                    index === 0 ? "border-l" : ""
                                } border-r border-black rounded-md px-2`}
                            >
                                {tableData.toString()}
                            </td>
                        ))
                    ) : (
                        <td className="border-r border-black rounded-md px-2">
                            Data tidak tersedia / Data kosong
                        </td>
                    )}
                </tr>
            </>
        );
    };

    console.log(timeCheckpoint);

    return (
        <>
            <div className="overflow-x-auto sm:max-w-[50%] w-full">
                <table className="min-w-full text-left text-sm">
                    <thead>
                        <tr className="text-center">
                            <th></th>
                            {timeCheckpoint.map((date, i) => (
                                <th
                                    key={i}
                                    colSpan={date.dateCount}
                                    className={`${
                                        i == 0 && "border-l"
                                    } border-r border-black rounded-md`}
                                >
                                    {formatDate(date.date)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {renderTableRow(
                            timeCheckpoint,
                            activeTab,
                            "timeList",
                            "Hour"
                        )}
                        {activeTab == 1 &&
                            renderTableRow(
                                timeCheckpoint,
                                activeTab,
                                "precipitationNwpList",
                                "Precipitation Nwp"
                            )}
                        {activeTab == 1 &&
                            renderTableRow(
                                timeCheckpoint,
                                activeTab,
                                "precipitationMosList",
                                "Precipitation Mos"
                            )}
                        {activeTab == 2 &&
                            renderTableRow(
                                timeCheckpoint,
                                activeTab,
                                "relativeHumidityNwpList",
                                "Relative Humidity Nwp"
                            )}
                        {activeTab == 2 &&
                            renderTableRow(
                                timeCheckpoint,
                                activeTab,
                                "relativeHumidityMosList",
                                "Relative Humidity Mos"
                            )}
                        {activeTab == 3 &&
                            renderTableRow(
                                timeCheckpoint,
                                activeTab,
                                "temperatureNwpList",
                                "Temperature Nwp"
                            )}
                        {activeTab == 3 &&
                            renderTableRow(
                                timeCheckpoint,
                                activeTab,
                                "temperatureMosList",
                                "Temperature Mos"
                            )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default StationWeatherDataTable;
