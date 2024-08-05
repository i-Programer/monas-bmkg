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
        return Inertia::render('Homepage/Home');

        
    }
}
