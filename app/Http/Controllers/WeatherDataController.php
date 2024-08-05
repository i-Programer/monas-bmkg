<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\DaftarWmoidImport;
use App\Imports\MonasInputNwpCompileImport;
use Illuminate\Support\Facades\Cache;

class WeatherDataController extends Controller
{
    public function importData()
    {
        return Cache::remember('weather_data', 60 * 60, function () {
            $daftarWmoidPath = public_path('data/daftar_wmoid.xlsx');
            $daftarWmoidData = Excel::toCollection(new DaftarWmoidImport, $daftarWmoidPath)->first();

            // Combine data for the map
            $data = [];
            foreach ($daftarWmoidData as $row) {
                $data[] = [
                    'WMOID' => $row['wmoid'] ?? '',
                    'namaUPT' => $row['nama_upt'] ?? '',
                    'provinsi' => $row['provinsi'] ?? '',
                    'kabKota' => $row['kabkota'] ?? '',
                    'lintang' => (float)str_replace(',', '.', $row['lintang']) ?? '',
                    'bujur' => (float)str_replace(',', '.', $row['bujur']) ?? '',
                    'elevasi' => (float)str_replace(',', '.', $row['elevasi_m']) ?? '',
                    'catatan' => $row['catatan'] ?? ''
                ];
            }

            return $data;
        });
    }


    public function importDataDetails()
    {
        // return Cache::remember('weather_data_details', 60 * 60, function () {
        $monasInputNwpCompilePath = public_path('data/pred_output.csv');
        $monasInputNwpCompileData = Excel::toCollection(new MonasInputNwpCompileImport, $monasInputNwpCompilePath)->first();
        $monasInputNwpCompileData = $monasInputNwpCompileData->slice(1);

        // Combine data for the map
        $data = [];
        $count = 0;
        foreach ($monasInputNwpCompileData as $row) {
            // dd($row);
            $data[] = [
                'lokasi' => $row[0] ?? '',
                'Date' => $row[1] ?? '',
                'LAT' => $row[2] ?? '',
                'LON' => $row[3] ?? '',
                'ELEV' => $row[4] ?? '',
                'prec_nwp' => $row[5] ?? '',
                'prec_mos' => $row[6] ?? '',
                'rh_nwp' => $row[7] ?? '',
                'rh_mos' => $row[8] ?? '',
                't_nwp' => $row[9] ?? '',
                't_mos' => $row[10] ?? '',
            ];
        }

        // dd($data);

        return $data;
        // });
    }

    public function importMergedData()
    {
        // Fetch data from importData
        $stationData_path = public_path('data/daftar_wmoid.xlsx');
        $stationData_list = Excel::toCollection(new DaftarWmoidImport, $stationData_path)->first();

        $stationStatusData_path = public_path('data/MONAS-input_nwp_compile.csv');
        $stationStatusData_list = Excel::toCollection(new MonasInputNwpCompileImport, $stationStatusData_path)->first();
        $stationStatusData_list = $stationStatusData_list->slice(1);

        $stationData_array = [];
        foreach ($stationData_list as $row) {
            $stationStatusData_array = [];

            foreach ($stationStatusData_list as $status_row) {
                // dd($status_row[0], $row['wmoid']);
                if ($status_row[0] == $row['wmoid']) {
                    $stationStatusData_array[] = [
                        'date' => $status_row[1] ?? '',
                        'prec_nwp' => $status_row[5] ?? '',
                        'prec_mos' => $status_row[6] ?? '',
                        'rh_nwp' => $status_row[7] ?? '',
                        'rh_mos' => $status_row[8] ?? '',
                        't_nwp' => $status_row[9] ?? '',
                        't_mos' => $status_row[10] ?? '',
                    ];
                }
            }

            $stationData_array[] = [
                'wmoid' => $row['wmoid'] ?? '',
                'namaUPT' => $row['nama_upt'] ?? '',
                'provinsi' => $row['provinsi'] ?? '',
                'kabKota' => $row['kabkota'] ?? '',
                'lintang' => (float)str_replace(',', '.', $row['lintang']) ?? '',
                'bujur' => (float)str_replace(',', '.', $row['bujur']) ?? '',
                'elevasi' => (float)str_replace(',', '.', $row['elevasi_m']) ?? '',
                'catatan' => $row['catatan'] ?? '',
                'status' => $stationStatusData_array
            ];
            // dd($stationData_array);
        }

        // dd($stationData_array);

        return response()->json($stationData_array);
    }
}
