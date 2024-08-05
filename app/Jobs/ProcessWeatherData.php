<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\DaftarWmoidImport;
use App\Imports\MonasInputNwpCompileImport;
use Illuminate\Support\Facades\Cache;

class ProcessWeatherData implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        $daftarWmoidPath = public_path('data/daftar_wmoid.xlsx');
        $monasInputNwpCompilePath = public_path('data/MONAS-input_nwp_compile.csv');

        $daftarWmoidData = Excel::toCollection(new DaftarWmoidImport, $daftarWmoidPath)->first();
        $monasInputNwpCompileData = Excel::toCollection(new MonasInputNwpCompileImport, $monasInputNwpCompilePath)->first();

        $data = [];
        foreach ($daftarWmoidData as $row) {
            $data[] = [
                'WMOID' => $row['wmoid'] ?? '',
                'NamaUPT' => $row['nama_upt'] ?? '',
                'Provinsi' => $row['provinsi'] ?? '',
                'KabKota' => $row['kabkota'] ?? '',
                'Lintang' => (float)str_replace(',', '.', $row['lintang']) ?? '',
                'Bujur' => (float)str_replace(',', '.', $row['bujur']) ?? '',
                'Elevasi' => (float)str_replace(',', '.', $row['elevasi_m']) ?? '',
                'Catatan' => $row['catatan'] ?? ''
            ];
        }

        Cache::put('weather_data', $data, 60 * 60);
    }
}
