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
      Schema::create('personnel_statut', function (Blueprint $table) {
    $table->id();
    $table->foreignId('id_personnel')->constrained('personnels', 'id_personnel')->onDelete('cascade');
    $table->foreignId('id_statut')->constrained('statuts', 'id_statut')->onDelete('cascade');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personnel_statut');
    }
};
