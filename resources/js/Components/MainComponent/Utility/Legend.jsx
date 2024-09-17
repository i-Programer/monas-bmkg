import React from "react";

const Legend = ({ min, max, mean, activeTab }) => {
    // Inline style for the vertical gradient
    const getGradientStyle = (activeTab) => {
        if (activeTab === 3) {
            return {
                background: "linear-gradient(to bottom, yellow, red, black)",
            };
        } else if (activeTab === 2) {
            return {
                background: "linear-gradient(to bottom, white, blue, black)",
            };
        } else if (activeTab === 1) {
            return {
                background:
                    "linear-gradient(to bottom, lightgreen, darkgreen, black)",
            };
        }
    };

    // Handle invalid (Infinity, -Infinity, NaN) or null values for min, max, and mean
    const safeMin = isFinite(min) && min !== null ? min : 0;
    const safeMax = isFinite(max) && max !== null ? max : 0;
    const safeMean = isFinite(mean) && mean !== null ? mean : 0;

    // Avoid division by zero when calculating the mean position
    const meanPosition =
        safeMax !== safeMin ? `${((safeMean - safeMin) / (safeMax - safeMin)) * 100}%` : "50%";

    return (
        <div className="flex flex-col items-center absolute z-[590] mt-[17rem] ml-4">
            <div className="mb-2 text-white font-bold text-base">
                Max: {safeMax}
            </div>
            <div
                className="relative w-5 h-48 border border-white rounded-md"
                style={getGradientStyle(activeTab)}
            >
                {/* Mean Indicator */}
                <div
                    className="absolute left-[-10px] w-9 h-[2px] bg-black"
                    style={{ top: meanPosition }}
                />
            </div>
            <div className="mt-2 text-white font-bold text-base">
                Min: {safeMin}
            </div>
        </div>
    );
};

export default Legend;
