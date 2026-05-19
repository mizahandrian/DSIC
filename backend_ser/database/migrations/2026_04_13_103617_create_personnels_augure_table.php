<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('personnels_augure', function (Blueprint $table) {
    $table->id();

    $table->unsignedBigInteger('id_personnel');
    $table->unsignedBigInteger('id_augure');

    $table->timestamp('date_liaison')->useCurrent();

    $table->foreign('id_personnel')
        ->references('id')
        ->on('personnels')
        ->onDelete('cascade');

    $table->foreign('id_augure')
        ->references('id')
        ->on('base_augures')
        ->onDelete('cascade');
});
    }

    public function down(): void
    {
        Schema::dropIfExists('personnels_augure');
    }
};