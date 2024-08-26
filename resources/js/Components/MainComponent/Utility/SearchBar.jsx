import React from 'react';

const SearchBar = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-slate-300/10 absolute z-[550] rounded-md top-0 left-0">
            <div className="w-full max-w-md p-4">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    );
};

export default SearchBar;
