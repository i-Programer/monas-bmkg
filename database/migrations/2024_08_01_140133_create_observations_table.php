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
        Schema::create('observations', function (Blueprint $table) {
            $table->id();
            $table->string('WMOID');
            $table->timestamp('timestamp');
            $table->float('temp');
            $table->float('dew_point');
            $table->float('humidity');
            $table->float('wind_speed');
            $table->float('wind_dir');
            $table->float('pressure');
            $table->float('rain');
            $table->float('visibility');
            $table->float('cloud_cover');
            $table->decimal('lat', 10, 7);
            $table->decimal('lon', 10, 7);
            $table->integer('elevation');
            $table->timestamps();

            $table->foreign('WMOID')->references('WMOID')->on('stations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('observations');
    }
};
