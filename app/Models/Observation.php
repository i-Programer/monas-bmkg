<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Observation extends Model
{
    use HasFactory;

    protected $fillable = [
        'WMOID', 'timestamp', 'temp', 'dew_point', 'humidity', 'wind_speed', 'wind_dir', 'pressure',
        'rain', 'visibility', 'cloud_cover', 'lat', 'lon', 'elevation'
    ];
}
