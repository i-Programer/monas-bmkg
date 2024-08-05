<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\ToCollection;
use Illuminate\Support\Collection;

class MonasInputNwpCompileImport implements ToCollection
{
    public function collection(Collection $rows)
    {
        $allData = $rows->first()->first();
        $dataRows = explode("\n", $allData);

        $headers = explode(',', array_shift($dataRows));

        $data = [];
        foreach ($dataRows as $dataRow){
            $values = explode(',', $dataRow);
            $data[] = array_combine($headers,$values);
        }

        return collect($data);
    }
}
