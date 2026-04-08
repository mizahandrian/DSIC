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
    Schema::create('personnels', function (Blueprint $table) {
        $table->id('id_personnel');
        $table->string('nom');
        $table->string('prenom');
        $table->string('tel')->nullable();
        $table->enum('genre', ['M', 'F']);
        $table->date('date_naissance');
        $table->string('numero_cin');
        $table->date('date_entree');
        $table->string('motif_entree')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personnels');
    }
};
