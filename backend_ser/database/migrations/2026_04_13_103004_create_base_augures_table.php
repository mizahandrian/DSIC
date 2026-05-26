<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
{
    Schema::create('base_augures', function (Blueprint $table) {
        $table->id( );
        $table->string('agentMatricule')->unique();
        $table->string('agentNom');
        $table->string('agentCin')->nullable();
        $table->date('agentDateNais')->nullable();   // ⚠️ date, pas string
        $table->string('corpsCode')->nullable();
        $table->string('gradeCode')->nullable();
        $table->string('indice')->nullable();
        $table->string('categorieCode')->nullable();
        $table->string('posteAgentNumero')->nullable();
        $table->string('titre')->nullable();
        $table->string('structureRattachement');
        $table->string('statutAgent')->default('Actif');
        $table->string('sanctionCode')->nullable();
        $table->string('sanctionLibelle')->nullable();
        $table->string('regCode')->nullable();
        $table->string('regLibelle')->nullable();
        $table->date('dateEffet')->nullable();        // ⚠️ date, pas string
        $table->string('intervalAge')->nullable();
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('base_augures');
}
};