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
        Schema::create('nodes', function (Blueprint $table) {
            // Attributes
            $table->uuid('id')->primary();
            $table->uuid('mapId');
            $table->uuid('parentNode')->nullable();
            $table->string('type', 50);
            $table->text('label');
            $table->string('startDate', 10);
            $table->string('duration', 10);
            $table->string('endDate', 10);
            $table->boolean('startDateLocked');
            $table->boolean('endDateLocked');
            $table->boolean('startDateVisible');
            $table->boolean('durationVisible');
            $table->boolean('endDateVisible');
            // React Flow Properties
            $table->boolean('expandParent');
            $table->smallInteger('positionX');
            $table->smallInteger('positionY');
            $table->smallInteger('zIndex');
            $table->timestamps();

            // Foreign keys
            $table->foreign('mapId')->references('id')->on('maps');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nodes');
    }
};
