<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    private $xlsxFilePath;
    private $csvFilePath;

    public function __construct()
    {
        $this->xlsxFilePath = public_path('data/daftar_wmoid.xlsx');
        $this->csvFilePath = public_path('data/MONAS-input_nwp_compile.csv');
    }
    public function index(){
        $openweather_api = env('REACT_APP_OPENWEATHER_API_KEY');
        $stadiamaps_api = env('REACT_APP_STADIAMAPS_API_KEY');
        return Inertia::render('Homepage/Home', compact('openweather_api', 'stadiamaps_api'));
    }
    
    public function windMap(){
        return Inertia::render('Homepage/WindMap');
    }
}
