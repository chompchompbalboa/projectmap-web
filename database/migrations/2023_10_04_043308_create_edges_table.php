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
        Schema::create('edges', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('mapId');
            $table->string('type', 20);
            $table->uuid('source');
            $table->uuid('target');
            $table->timestamps();
            // Foreign keys
            $table->foreign('mapId')->references('id')->on('maps');
            $table->foreign('source')->references('id')->on('nodes');
            $table->foreign('target')->references('id')->on('nodes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('edges');
    }
};
