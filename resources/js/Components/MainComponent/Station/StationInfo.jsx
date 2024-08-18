import React, { useState } from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import ReactDOMServer from "react-dom/server";
import { FaCircle } from "react-icons/fa";

const StationInfo = ({ station, setSelectedStation, setSelectedMarker, selectedMarker, markerId }) => {
    const customIcon =  L.divIcon({
        html: ReactDOMServer.renderToString(
            <FaCircle style={{ color: "white", fontSize: "12px" }} />
        ),
        className: "", // You can add custom CSS classes here
        iconSize: [1, 1], // Set the size of your icon [width, height]
        // iconAnchor: [12, 24], // Anchor the icon at the bottom center
    });

    const customIconSelected =  L.divIcon({
        html: ReactDOMServer.renderToString(
            <FaCircle style={{ color: "black", fontSize: "12px" }} />
        ),
        className: "", // You can add custom CSS classes here
        iconSize: [1, 1], // Set the size of your icon [width, height]
        // iconAnchor: [12, 24], // Anchor the icon at the bottom center
    });

    const calculateCombinedStats = (data, key1, key2) => {
        if (!data || data.length === 0) return { max: 0, mean: 0, min: 0 };

        const values = data
            .flatMap((item) => [item[key1], item[key2]])
            .filter((value) => value !== "");
        const sum = values.reduce((a, b) => a + parseFloat(b), 0);
        const mean = (sum / values.length).toFixed(2);
        const max = Math.max(...values).toFixed(2);
        const min = Math.min(...values).toFixed(2);

        return { max, mean, min };
    };

    const temperature = calculateCombinedStats(
        station.status,
        "t_nwp",
        "t_mos"
    );
    const precipitation = calculateCombinedStats(
        station.status,
        "prec_nwp",
        "prec_mos"
    );
    const relative_humidity = calculateCombinedStats(
        station.status,
        "rh_nwp",
        "rh_mos"
    );

    const onClickHandler = (station) => {
        setSelectedStation(station);
        setSelectedMarker(markerId);
    };

    // console.log(station.status)

    return (
        <>
            <Marker
                position={[station.lintang, station.bujur]}
                icon={selectedMarker === markerId ? customIconSelected : customIcon}
                eventHandlers={{
                    click: () => onClickHandler(station),
                }}
            >
                <Tooltip>
                    <div className="flex flex-col justify-center items-center flex-wrap">
                        <div className="flex flex-col justify-center items-start mr-auto text-sm font-base max-w-xs whitespace-normal">
                            <span>
                                <span className="font-bold">Nama Stasiun</span>:{" "}
                                {station.namaUPT}
                            </span>
                            <span>
                                <span className="font-bold">Provinsi</span>:{" "}
                                {station.provinsi}
                            </span>
                            <span>
                                <span className="font-bold">
                                    Kabupaten/Kota
                                </span>
                                : {station.kabKota}
                            </span>
                            <span>
                                <span className="font-bold">Lintang/Bujur</span>
                                : {station.lintang} / {station.bujur}
                            </span>
                            <span>
                                <span className="font-bold">Catatan</span>:{" "}
                                {station.catatan}
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                                            Metric
                                        </th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                                            Max
                                        </th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                                            Mean
                                        </th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                                            Min
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-2 py-1">
                                            Precipitaion
                                        </td>
                                        <td className="px-2 py-1">
                                            {precipitation.max}
                                        </td>
                                        <td className="px-2 py-1">
                                            {precipitation.mean}
                                        </td>
                                        <td className="px-2 py-1">
                                            {precipitation.min}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-1">Humidity</td>
                                        <td className="px-2 py-1">
                                            {relative_humidity.max}
                                        </td>
                                        <td className="px-2 py-1">
                                            {relative_humidity.mean}
                                        </td>
                                        <td className="px-2 py-1">
                                            {relative_humidity.min}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-1">
                                            Temperature
                                        </td>
                                        <td className="px-2 py-1">
                                            {temperature.max}
                                        </td>
                                        <td className="px-2 py-1">
                                            {temperature.mean}
                                        </td>
                                        <td className="px-2 py-1">
                                            {temperature.min}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Tooltip>
            </Marker>
        </>
    );
};

export default StationInfo;
