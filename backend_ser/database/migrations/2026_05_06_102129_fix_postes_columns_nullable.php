<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('postes', function (Blueprint $table) {
            // Supprimer les contraintes de clés étrangères
            $table->dropForeign(['id_service']);
            $table->dropForeign(['id_carriere']);

            // Modifier les colonnes pour les rendre nullable
            $table->unsignedBigInteger('id_service')->nullable()->change();
            $table->unsignedBigInteger('id_carriere')->nullable()->change();

            // Recréer les contraintes de clés étrangères (nullable)
            $table->foreign('id_service')->references('id_service')->on('services')->onDelete('set null');
            $table->foreign('id_carriere')->references('id_carriere')->on('carrieres')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('postes', function (Blueprint $table) {
            // Supprimer les contraintes de clés étrangères
            $table->dropForeign(['id_service']);
            $table->dropForeign(['id_carriere']);

            // Remettre NOT NULL
            $table->unsignedBigInteger('id_service')->nullable(false)->change();
            $table->unsignedBigInteger('id_carriere')->nullable(false)->change();

            // Recréer les contraintes de clés étrangères (NOT NULL)
            $table->foreign('id_service')->references('id_service')->on('services')->onDelete('cascade');
            $table->foreign('id_carriere')->references('id_carriere')->on('carrieres')->onDelete('cascade');
        });
    }
};
