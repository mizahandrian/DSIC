<?php
// database/migrations/xxxx_fix_personnels_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Vérifie et ajoute les colonnes manquantes si elles n'existent pas
        Schema::table('personnels', function (Blueprint $table) {
            if (!Schema::hasColumn('personnels', 'id_poste')) {
                $table->foreignId('id_poste')->nullable();
            }
            if (!Schema::hasColumn('personnels', 'id_carriere')) {
                $table->foreignId('id_carriere')->nullable();
            }
        });
    }

    public function down(): void {}
};