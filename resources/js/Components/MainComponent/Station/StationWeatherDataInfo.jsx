import React from "react";

const StationWeatherDataInfo = ({ selectedStation }) => {
    // console.log(selectedStation)
    return (
        <>
            <div className="flex justify-center item-center p-1 lg:w-[30%]">
                <div className="flex flex-col justify-center items-center gap-y-3">
                    <span className="text-2xl font-bold ">Station Info</span> 
                    <div className="flex flex-col justify-center items-center whitespace-normal">
                        <span className="text-center font-bold text-base">Nama Stasiun: {selectedStation.namaUPT}</span>
                        <span className="text-center font-bold text-base">Provinsi: {selectedStation.provinsi}</span>
                        <span className="text-center font-bold text-base">Kabupaten Kota: {selectedStation.kabKota}</span>
                        <span className="text-center font-bold text-base">Lintang/Bujur: {selectedStation.litang} / {selectedStation.bujur}</span>
                        <span className="text-center font-bold text-base">Catatan: {selectedStation.catatan}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StationWeatherDataInfo;
