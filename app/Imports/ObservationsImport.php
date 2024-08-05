<?php

namespace App\Imports;

use App\Models\Observation;
use Maatwebsite\Excel\Concerns\ToModel;

class ObservationsImport implements ToModel
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        return new Observation([
            'WMOID' => $row[0],
            'timestamp' => $row[1],
            'temp' => $row[2],
            'dew_point' => $row[3],
            'humidity' => $row[4],
            'wind_speed' => $row[5],
            'wind_dir' => $row[6],
            'pressure' => $row[7],
            'rain' => $row[8],
            'visibility' => $row[9],
            'cloud_cover' => $row[10],
            'lat' => $row[28],
            'lon' => $row[29],
            'elevation' => $row[30],
        ]);
    }
}
