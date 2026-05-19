<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // ✅ Ne rien faire — id_statut existe déjà
        if (!Schema::hasColumn('personnels', 'id_statut')) {
            Schema::table('personnels', function (Blueprint $table) {
                $table->unsignedBigInteger('id_statut')->nullable()->after('id_etat');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('personnels', 'id_statut')) {
            Schema::table('personnels', function (Blueprint $table) {
                $table->dropColumn('id_statut');
            });
        }
    }
};