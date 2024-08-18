import React from "react";

const StationWeatherDataInfo = ({ selectedStation }) => {
    console.log(selectedStation)
    return (
        <>
            <div className="flex justify-center item-center p-1 w-full">
                <div className="flex flex-col justify-center items-center gap-y-3">
                    <span className="text-2xl font-bold ">Station Info</span> 
                    <div className="flex flex-col justify-center items-center whitespace-normal">
                        <span className="text-center font-bold text-lg">Nama Stasiun: {selectedStation.namaUPT}</span>
                        <span className="text-center font-bold text-lg">Provinsi: {selectedStation.provinsi}</span>
                        <span className="text-center font-bold text-lg">Kabupaten Kota: {selectedStation.kabKota}</span>
                        <span className="text-center font-bold text-lg">Lintang/Bujur: {selectedStation.litang} / {selectedStation.bujur}</span>
                        <span className="text-center font-bold text-lg">Catatan: {selectedStation.catatan}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StationWeatherDataInfo;
