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
    $table->enum('genre', ['M', 'F']);
    $table->string('numero_cin')->unique();
    $table->string('tel')->nullable();
    $table->date('date_naissance');

    $table->date('date_entree');
    $table->string('motif_entree')->nullable();

    $table->foreignId('id_direction')->constrained('directions', 'id_direction');
    $table->foreignId('id_service')->constrained('services', 'id_service');
    $table->foreignId('id_poste')->constrained('postes', 'id_poste');
    $table->foreignId('id_carriere')->constrained('carrieres', 'id_carriere');
    $table->foreignId('id_etat')->constrained('etats', 'id_etat');

    $table->string('situation_admin')->nullable();
    $table->date('date_entrer_situation')->nullable();
    $table->string('destination')->nullable();
    $table->text('commentaire_situation')->nullable();

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
