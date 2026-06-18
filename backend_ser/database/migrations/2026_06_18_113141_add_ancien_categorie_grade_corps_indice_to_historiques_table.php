<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('historiques', function (Blueprint $table) {
            $table->string('ancien_categorie')->nullable()->after('ancien_employeur');
            $table->string('ancien_grade')->nullable()->after('ancien_categorie');
            $table->string('ancien_corps')->nullable()->after('ancien_grade');
            $table->string('ancien_indice')->nullable()->after('ancien_corps');
        });
    }

    public function down(): void
    {
        Schema::table('historiques', function (Blueprint $table) {
            $table->dropColumn(['ancien_categorie', 'ancien_grade', 'ancien_corps', 'ancien_indice']);
        });
    }
};