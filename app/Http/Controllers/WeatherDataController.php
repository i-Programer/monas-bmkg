<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\DaftarWmoidImport;
use App\Imports\MonasInputNwpCompileImport;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use League\Csv\Reader;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\LazyCollection;

class WeatherDataController extends Controller
{
    public function importMergedData()
    {
        $cacheKey = 'merged_station_data';
        $cacheTime = 60 * 60; // 1 hour

        // Check if the data is already cached
        if (Cache::has($cacheKey)) {
            return response()->json(Cache::get($cacheKey));
        }

        // Fetch data from importData
        $stationData_path = public_path('data/daftar_wmoid.xlsx');
        $stationData_list = Excel::toCollection(new DaftarWmoidImport, $stationData_path)->first();

        $stationStatusData_path = public_path('data/pred_output.csv');
        $stationStatusData_list = Excel::toCollection(new MonasInputNwpCompileImport, $stationStatusData_path)->first();
        $stationStatusData_list = $stationStatusData_list->slice(1);

        // Create a lookup array for station status data
        $stationStatusLookup = [];
        foreach ($stationStatusData_list as $status_row) {
            $wmoid = $status_row[0];
            if (!isset($stationStatusLookup[$wmoid])) {
                $stationStatusLookup[$wmoid] = [];
            }
            $stationStatusLookup[$wmoid][] = [
                'date' => $status_row[1] ?? '',
                'prec_nwp' => $status_row[5] ?? '',
                'prec_mos' => $status_row[6] ?? '',
                'rh_nwp' => $status_row[7] ?? '',
                'rh_mos' => $status_row[8] ?? '',
                't_nwp' => $status_row[9] ?? '',
                't_mos' => $status_row[10] ?? '',
            ];
        }

        $stationData_array = [];
        foreach ($stationData_list as $row) {
            $wmoid = $row['wmoid'] ?? '';
            $stationData_array[] = [
                'wmoid' => $wmoid,
                'namaUPT' => $row['nama_upt'] ?? '',
                'provinsi' => $row['provinsi'] ?? '',
                'kabKota' => $row['kabkota'] ?? '',
                'lintang' => (float)str_replace(',', '.', $row['lintang']) ?? '',
                'bujur' => (float)str_replace(',', '.', $row['bujur']) ?? '',
                'elevasi' => (float)str_replace(',', '.', $row['elevasi_m']) ?? '',
                'catatan' => $row['catatan'] ?? '',
                'status' => $stationStatusLookup[$wmoid] ?? []
            ];
        }

        // Cache the processed data
        Cache::put($cacheKey, $stationData_array, $cacheTime);

        return response()->json($stationData_array);
    }

    public function importDetailedData()
    {
        $baseCacheKey = 'station_detailed_data_json';
        $chunkSize = 200; // Increase chunk size for fewer cache operations
        $stationData_array = [];
        $chunkIndex = 0;

        // Retrieve from cache if available
        while (Cache::has($baseCacheKey . '_chunk_' . $chunkIndex)) {
            $stationData_array = array_merge($stationData_array, Cache::get($baseCacheKey . '_chunk_' . $chunkIndex));
            $chunkIndex++;
        }

        // If no cache available
        if (empty($stationData_array)) {
            $stationData_path = public_path('data/daftar_wmoid.xlsx');
            $detailedData_path = public_path('data/MONAS-input_nwp_compile.csv');
            $stationStatusData_path = public_path('data/pred_output.csv');

            // Lazy loading Excel data
            $stationData_list = LazyCollection::make(function () use ($stationData_path) {
                return Excel::toCollection(new DaftarWmoidImport, $stationData_path)->first();
            });

            // Use native CSV reader for large files
            $detailedData_list = LazyCollection::make(function () use ($detailedData_path) {
                $handle = fopen($detailedData_path, 'r');
                while (($data = fgetcsv($handle, 1000, ',')) !== FALSE) {
                    yield $data;
                }
                fclose($handle);
            });

            $stationStatusData_list = LazyCollection::make(function () use ($stationStatusData_path) {
                $handle = fopen($stationStatusData_path, 'r');
                while (($data = fgetcsv($handle, 1000, ',')) !== FALSE) {
                    yield $data;
                }
                fclose($handle);
            });

            // Process and map data
            $detailedLookup = [];
            foreach ($detailedData_list as $status_row) {
                $wmoid = $status_row[0];
                $detailedLookup[$wmoid][] = $this->transformDetailedData($status_row);
            }

            $stationStatusLookup = [];
            foreach ($stationStatusData_list as $status_row) {
                $wmoid = $status_row[0];
                $stationStatusLookup[$wmoid][] = $this->transformStatusData($status_row);
            }

            // Merge all data together
            foreach ($stationData_list as $row) {
                $wmoid = $row['wmoid'] ?? '';
                $stationData_array[] = [
                    'wmoid' => $wmoid,
                    'namaUPT' => $row['nama_upt'] ?? '',
                    'provinsi' => $row['provinsi'] ?? '',
                    'kabKota' => $row['kabkota'] ?? '',
                    'lintang' => (float)str_replace(',', '.', $row['lintang']) ?? '',
                    'bujur' => (float)str_replace(',', '.', $row['bujur']) ?? '',
                    'elevasi' => (float)str_replace(',', '.', $row['elevasi_m']) ?? '',
                    'catatan' => $row['catatan'] ?? '',
                    'status' => $stationStatusLookup[$wmoid] ?? [],
                    'detailed' => $detailedLookup[$wmoid] ?? []
                ];
            }

            // Cache in chunks
            $chunks = array_chunk($stationData_array, $chunkSize);
            foreach ($chunks as $index => $chunk) {
                Cache::put($baseCacheKey . '_chunk_' . $index, $chunk, 60 * 60);
            }
        }

        return response()->json($stationData_array);
    }

    // Helper functions for data transformation
    private function transformDetailedData($status_row)
    {
        return [
            'lokasi' => $status_row[0] ?? '',
            'date' => $status_row[1] ?? '',
            'suhu2m(degC)' => $status_row[2] ?? '',
            'dew2m(degC)' => $status_row[3] ?? '',
            'rh2m(%)' => $status_row[4] ?? '',
            'wspeed(m/s)' => $status_row[5] ?? '',
            'wdir(deg)' => $status_row[6] ?? '',
            'lcloud(%)' => $status_row[7] ?? '',
            'mcloud(%)' => $status_row[8] ?? '',
            'hcloud(%)' => $status_row[9] ?? '',
            'surpre(Pa)' => $status_row[10] ?? '',
            'clmix(kg/kg)' => $status_row[11] ?? '',
            'wamix(kg/kg)' => $status_row[12] ?? '',
            'outlr(W/m2)' => $status_row[13] ?? '',
            'pblh(m)' => $status_row[14] ?? '',
            'lifcl(m)' => $status_row[15] ?? '',
            'cape(j/kg)' => $status_row[16] ?? '',
            'mdbz' => $status_row[17] ?? '',
            't950(degC)' => $status_row[18] ?? '',
            'rh950(%)' => $status_row[19] ?? '',
            'ws950(m/s)' => $status_row[20] ?? '',
            'wd950(deg)' => $status_row[21] ?? '',
            't800(degC)' => $status_row[22] ?? '',
            'rh800(%)' => $status_row[23] ?? '',
            'ws800(m/s)' => $status_row[24] ?? '',
            'wd800(deg)' => $status_row[25] ?? '',
            't500(degC)' => $status_row[26] ?? '',
            'rh500(%)' => $status_row[27] ?? '',
            'ws500(m/s)' => $status_row[28] ?? '',
            'wd500(deg)' => $status_row[29] ?? '',
            'prec_nwp' => $status_row[30] ?? '',
            'LAT' => $status_row[31] ?? '',
            'LON' => $status_row[32] ?? '',
            'ELEV' => $status_row[33] ?? '',
        ];
    }

    private function transformStatusData($status_row)
    {
        return [
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