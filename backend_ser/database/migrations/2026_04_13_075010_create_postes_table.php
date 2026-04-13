<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('postes', function (Blueprint $table) {
            $table->id('id_poste');
            $table->string('titre_poste');
            $table->string('indice')->nullable();

            $table->unsignedBigInteger('id_service');
            $table->unsignedBigInteger('id_carriere');

            $table->text('description')->nullable();
            $table->integer('nombre_personnels')->nullable();

            $table->timestamps();

            // relations
            $table->foreign('id_service')->references('id_service')->on('services')->onDelete('cascade');
            $table->foreign('id_carriere')->references('id_carriere')->on('carrieres')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('postes');
    }
};