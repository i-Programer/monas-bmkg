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

    // Calculate the mean position for the mean indicator
    const meanPosition = `${((mean - min) / (max - min)) * 100}%`;

    return (
        <div className="flex flex-col items-center absolute z-[590] mt-[17rem] ml-4">
            <div className="mb-2 text-white font-bold text-base">
                Max: {max}
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
                Min: {min}
            </div>
        </div>
    );
};

export default Legend;
