<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personnels', function (Blueprint $table) {
            $table->id();

            $table->string('nom');
            $table->string('prenom');
            $table->string('genre')->nullable();
            $table->string('numero_cin')->nullable();
            $table->string('tel')->nullable();
            $table->date('date_naissance')->nullable();

            $table->date('date_entree')->nullable();
            $table->string('motif_entree')->nullable();

            $table->foreignId('id_direction')->nullable();
            $table->foreignId('id_service')->nullable();
            $table->foreignId('id_poste')->nullable();
            $table->foreignId('id_carriere')->nullable();
            $table->foreignId('id_etat')->nullable();

            $table->string('direction')->nullable();
            $table->string('service')->nullable();
            $table->string('poste')->nullable();

            $table->string('categorie')->nullable();
            $table->string('indice')->nullable();
            $table->string('corps')->nullable();
            $table->string('grade')->nullable();
            $table->date('date_effet_carriere')->nullable();

            $table->string('statut')->nullable();
            $table->string('etat')->nullable();

            $table->string('situation')->nullable();
            $table->date('date_situation')->nullable();
            $table->string('destination')->nullable();
            $table->text('commentaire_situation')->nullable();

            $table->string('ancien_poste')->nullable();
            $table->string('ancien_direction')->nullable();
            $table->text('commentaire_historique')->nullable();

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
