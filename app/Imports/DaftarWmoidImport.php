<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\ToArray;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\ToCollection;
use Illuminate\Support\Collection;

class DaftarWmoidImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        // Process the data as needed
        return $rows;
    }
}

