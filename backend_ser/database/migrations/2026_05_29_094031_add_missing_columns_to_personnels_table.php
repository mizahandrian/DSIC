<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('personnels', function (Blueprint $table) {
            // Ajoute uniquement les colonnes qui n'existent pas encore
            if (!Schema::hasColumn('personnels', 'id_direction'))
                $table->unsignedBigInteger('id_direction')->nullable();
            if (!Schema::hasColumn('personnels', 'id_service'))
                $table->unsignedBigInteger('id_service')->nullable();
            if (!Schema::hasColumn('personnels', 'id_poste'))
                $table->unsignedBigInteger('id_poste')->nullable();
            if (!Schema::hasColumn('personnels', 'id_carriere'))
                $table->unsignedBigInteger('id_carriere')->nullable();
            if (!Schema::hasColumn('personnels', 'id_etat'))
                $table->unsignedBigInteger('id_etat')->nullable();
            if (!Schema::hasColumn('personnels', 'id_statut'))
                $table->unsignedBigInteger('id_statut')->nullable();
            if (!Schema::hasColumn('personnels', 'motif_entree'))
                $table->string('motif_entree')->nullable();
            if (!Schema::hasColumn('personnels', 'poste'))
                $table->string('poste')->nullable();
            if (!Schema::hasColumn('personnels', 'service'))
                $table->string('service')->nullable();
            if (!Schema::hasColumn('personnels', 'direction'))
                $table->string('direction')->nullable();
            if (!Schema::hasColumn('personnels', 'categorie'))
                $table->string('categorie')->nullable();
            if (!Schema::hasColumn('personnels', 'indice'))
                $table->string('indice')->nullable();
            if (!Schema::hasColumn('personnels', 'corps'))
                $table->string('corps')->nullable();
            if (!Schema::hasColumn('personnels', 'grade'))
                $table->string('grade')->nullable();
            if (!Schema::hasColumn('personnels', 'date_effet_carriere'))
                $table->date('date_effet_carriere')->nullable();
            if (!Schema::hasColumn('personnels', 'statut'))
                $table->string('statut')->nullable();
            if (!Schema::hasColumn('personnels', 'etat'))
                $table->string('etat')->nullable();
            if (!Schema::hasColumn('personnels', 'situation'))
                $table->string('situation')->nullable();
            if (!Schema::hasColumn('personnels', 'date_situation'))
                $table->date('date_situation')->nullable();
            if (!Schema::hasColumn('personnels', 'destination'))
                $table->string('destination')->nullable();
            if (!Schema::hasColumn('personnels', 'commentaire_situation'))
                $table->text('commentaire_situation')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('personnels', function (Blueprint $table) {
            $table->dropColumn([
                'id_direction', 'id_service', 'id_poste', 'id_carriere',
                'id_etat', 'id_statut', 'motif_entree', 'poste', 'service',
                'direction', 'categorie', 'indice', 'corps', 'grade',
                'date_effet_carriere', 'statut', 'etat', 'situation',
                'date_situation', 'destination', 'commentaire_situation',
            ]);
        });
    }
};