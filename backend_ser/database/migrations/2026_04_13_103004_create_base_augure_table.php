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
    Schema::create('base_augure', function (Blueprint $table) {
        $table->id('id_augure');

        $table->string('agentMatricule');
        $table->string('agentNom');
        $table->string('agentCin')->nullable();

        $table->string('corpsCode')->nullable();
        $table->string('gradeCode')->nullable();
        $table->string('indice')->nullable();

        $table->string('posteAgentNumero')->nullable();
        $table->string('titre')->nullable();

        $table->string('categorieCode')->nullable();

        $table->string('structureRattachement');

        $table->string('regCode')->nullable();
        $table->string('regLibelle')->nullable();

        $table->string('sanctionCode')->nullable();
        $table->string('sanctionLibelle')->nullable();

        $table->date('agentDateNais')->nullable();
        $table->date('dateEffet')->nullable();

        $table->string('intervalAge')->nullable();
        $table->string('statutAgent')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('base_augure');
    }
};
