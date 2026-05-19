<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // ✅ Ajouter personnel_id dans carrieres
        Schema::table('carrieres', function (Blueprint $table) {
            if (!Schema::hasColumn('carrieres', 'personnel_id')) {
                $table->unsignedBigInteger('personnel_id')
                      ->nullable()
                      ->after('id_carriere');
            }
        });
    }

    public function down(): void
    {
        Schema::table('carrieres', function (Blueprint $table) {
            $table->dropColumn('personnel_id');
        });
    }
};