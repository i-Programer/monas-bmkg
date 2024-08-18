import React from "react";

const LayerMap = ({activeTab, setActiveTab}) => {
    return (
        <>
            <div className="absolute right-5 top-5 z-[9999]">
                <div className="flex flex-col justify-between items-center gap-y-4 text-white font-bold">
                    <button className="rounded-md w-full bg-green-700 p-3" onClick={() => setActiveTab(1)}>
                        Precipitation
                    </button>
                    <button className="rounded-md w-full bg-blue-700 p-3" onClick={() => setActiveTab(2)}>
                        Relative Humidity
                    </button>
                    <button className="rounded-md w-full bg-red-700 p-3" onClick={() => setActiveTab(3)}>
                        Temperature
                    </button>
                </div>
            </div>
        </>
    );
};

export default LayerMap;
