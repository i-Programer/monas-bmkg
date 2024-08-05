<?php

namespace App\Imports;

use App\Models\WeatherData;
use Maatwebsite\Excel\Concerns\ToArray;

class WeatherDataImport implements ToArray
{
    public function array(array $array)
    {
        return $array;
    }
}
