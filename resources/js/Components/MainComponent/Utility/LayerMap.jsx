import React from "react";
import { WiHumidity, WiThermometer, WiRain } from "react-icons/wi";

const LayerMap = ({ activeTab, setActiveTab, selectedStation }) => {
    return (
        <>
            <div className={`absolute left-5 top-[12rem] z-[500]`}>
                <div className="flex flex-col justify-between items-start gap-y-4 text-white text-sm font-bold">
                    <button
                        className="rounded-md  bg-green-700 p-1 flex flex-row justify-between items-center"
                        onClick={() => setActiveTab(1)}
                    >
                        <WiRain className="text-lg font-bold"/>
                        <span>Precipitation</span>
                    </button>
                    <button
                        className="rounded-md  bg-blue-700 p-1 flex flex-row justify-between items-center"
                        onClick={() => setActiveTab(2)}
                    >
                        <WiHumidity className="text-lg font-bold"/>
                        <span>Relative Humidity</span>
                    </button>
                    <button
                        className="rounded-md  bg-red-700 p-1 flex flex-row justify-between items-center"
                        onClick={() => setActiveTab(3)}
                    >
                        <WiThermometer className="text-lg font-bold"/>
                        <span>Temperature</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default LayerMap;
