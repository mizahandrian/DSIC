<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('historiques', function (Blueprint $table) {
            $table->string('ancien_service')->nullable()->after('ancien_direction');
            $table->string('ancien_employeur')->nullable()->after('ancien_service');
            $table->date('date_debut')->nullable()->after('ancien_employeur');
            $table->date('date_fin')->nullable()->after('date_debut');
            $table->string('motif_depart')->nullable()->after('date_fin');
        });
    }

    public function down(): void
    {
        Schema::table('historiques', function (Blueprint $table) {
            $table->dropColumn(['ancien_service', 'ancien_employeur', 'date_debut', 'date_fin', 'motif_depart']);
        });
    }
};