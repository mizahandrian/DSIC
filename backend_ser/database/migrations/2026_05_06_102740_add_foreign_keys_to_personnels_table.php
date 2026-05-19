<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('personnels', function (Blueprint $table) {
            // ✅ Ajouter SEULEMENT les colonnes qui n'existent pas encore
            if (!Schema::hasColumn('personnels', 'id_direction')) {
                $table->unsignedBigInteger('id_direction')->nullable()->after('motif_entree');
                $table->foreign('id_direction')->references('id_direction')->on('directions')->nullOnDelete();
            }
            if (!Schema::hasColumn('personnels', 'id_service')) {
                $table->unsignedBigInteger('id_service')->nullable();
                $table->foreign('id_service')->references('id_service')->on('services')->nullOnDelete();
            }
            if (!Schema::hasColumn('personnels', 'id_poste')) {
                $table->unsignedBigInteger('id_poste')->nullable();
                $table->foreign('id_poste')->references('id_poste')->on('postes')->nullOnDelete();
            }
            if (!Schema::hasColumn('personnels', 'id_carriere')) {
                $table->unsignedBigInteger('id_carriere')->nullable();
                $table->foreign('id_carriere')->references('id')->on('carrieres')->nullOnDelete();
            }
            if (!Schema::hasColumn('personnels', 'id_etat')) {
                $table->unsignedBigInteger('id_etat')->nullable();
                $table->foreign('id_etat')->references('id')->on('etats')->nullOnDelete();
            }
            if (!Schema::hasColumn('personnels', 'id_statut')) {
                $table->unsignedBigInteger('id_statut')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('personnels', function (Blueprint $table) {
            $table->dropForeign(['id_direction']);
            $table->dropForeign(['id_service']);
            $table->dropForeign(['id_poste']);
            $table->dropForeign(['id_carriere']);
            $table->dropForeign(['id_etat']);
            $table->dropColumn(['id_direction', 'id_service', 'id_poste', 'id_carriere', 'id_etat', 'id_statut']);
        });
    }
};