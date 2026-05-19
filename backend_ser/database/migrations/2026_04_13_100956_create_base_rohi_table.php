<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('base_rohis', function (Blueprint $table) {

            $table->id('id_rohi');

            $table->string('immatricule')->unique();
            $table->string('nom');
            $table->string('prenom');

            $table->string('poste')->nullable();
            $table->string('porte')->nullable();
            $table->string('telephone')->nullable();

            $table->string('direction');
            $table->string('service')->nullable();

            $table->string('statut')->default('Actif');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('base_rohis');
    }
};