import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

const SearchBar = ({ handleSearch, query, results, onSelectResult }) => {
    return (
        <div className="relative flex items-center justify-center bg-slate-300/10 rounded-full top-5 left-5 z-[550]">
            <div className="w-full h-full rounded-full relative">
                <button className="absolute p-2 top-[25%] right-3">
                    <span className="text-lg font-bold">
                        <IoIosCloseCircleOutline />
                    </span>
                </button>
                <div className="w-[32rem] p-4">
                    <input
                        type="text"
                        placeholder="Ketikkan kata kunci pencarian..."
                        className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleSearch}
                        value={query}
                    />
                    {query && results.length > 0 && (
                        <ul className="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                            {results.map((result, index) => (
                                <li
                                    key={index}
                                    className="p-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => onSelectResult(result)}
                                >
                                    <div className="font-semibold">{result.namaUPT}</div>
                                    <div className="text-sm text-gray-500">{result.provinsi}</div>
                                    <div className="text-sm text-gray-500">{result.kabKota}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
