<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('postes', function (Blueprint $table) {
            // Rendre les colonnes nullable
            $table->unsignedBigInteger('id_service')->nullable()->change();
            $table->unsignedBigInteger('id_carriere')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('postes', function (Blueprint $table) {
            // Revenir à NOT NULL
            $table->unsignedBigInteger('id_service')->nullable(false)->change();
            $table->unsignedBigInteger('id_carriere')->nullable(false)->change();
        });
    }
};
