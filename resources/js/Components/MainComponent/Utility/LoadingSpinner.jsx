// src/components/LoadingSpinner.jsx
import React from "react";

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-28 w-28 border-t-4 border-slate-100"></div>
    </div>
);

export default LoadingSpinner;
