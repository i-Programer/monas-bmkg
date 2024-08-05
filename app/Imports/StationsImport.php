<?php

namespace App\Imports;

use App\Models\Station;
use Maatwebsite\Excel\Concerns\ToArray;

class StationDataImport implements ToArray
{
    public function array(array $array)
    {
        return $array;
    }
}
