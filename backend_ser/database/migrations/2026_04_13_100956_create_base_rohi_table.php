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
    Schema::create('base_rohi', function (Blueprint $table) {
        $table->id('id_rohi');
        $table->string('immatricule');
        $table->string('nom');
        $table->string('prenom');
        $table->string('poste')->nullable();
        $table->string('porte')->nullable();
        $table->string('telephone')->nullable();
        $table->string('direction');
        $table->string('service')->nullable();
        $table->enum('statut', ['actif','inactif'])->default('actif');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('base_rohi');
    }
};
