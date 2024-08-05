<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('weather_data', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('station_id');
            $table->dateTime('date');
            $table->decimal('temperature', 5, 2);
            $table->decimal('dew_point', 5, 2);
            $table->decimal('humidity', 5, 2);
            $table->decimal('wind_speed', 5, 2);
            $table->decimal('wind_direction', 5, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weather_data');
    }
};
