<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
    Schema::create('situation_personnels', function (Blueprint $table) {
        $table->id('id_disposition');
        $table->foreignId('id_personnel')->constrained('personnels', 'id');
        $table->enum('statut_administratif', ['fonctionnaire', 'prive']);
        $table->string('provenance');
        $table->string('destination');
        $table->date('date_debut');
        $table->date('date_fin')->nullable();
        $table->enum('type_mobilite', ['formation', 'mission', 'detachement', 'stage']);
        $table->text('commentaire')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('situation_personnels');
    }
};
