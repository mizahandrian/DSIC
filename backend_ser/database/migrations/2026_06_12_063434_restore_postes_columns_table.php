<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('postes', function (Blueprint $table) {
            $table->unsignedBigInteger('id_direction')->nullable()->after('id_poste');
            $table->string('categorie')->nullable()->after('description');
            $table->string('niveau')->nullable()->after('categorie');
            $table->decimal('salaire_base', 15, 2)->nullable()->after('niveau');
            $table->text('competences')->nullable()->after('salaire_base');

            $table->foreign('id_direction')
                  ->references('id_direction')
                  ->on('directions')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('postes', function (Blueprint $table) {
            $table->dropForeign(['id_direction']);
            $table->dropColumn(['id_direction', 'categorie', 'niveau', 'salaire_base', 'competences']);
        });
    }
};
