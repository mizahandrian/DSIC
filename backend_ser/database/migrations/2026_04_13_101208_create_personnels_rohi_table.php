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
    Schema::create('personnels_rohi', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('id_personnel');
        $table->unsignedBigInteger('id_rohi');
        $table->timestamp('date_liaison')->useCurrent();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personnels_rohi');
    }
};
