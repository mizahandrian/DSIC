<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::dropIfExists('postes');

        Schema::create('postes', function (Blueprint $table) {
            $table->bigIncrements('id_poste');
            $table->string('titre_poste');
            $table->string('indice')->nullable();

            $table->unsignedBigInteger('id_service')->nullable();
            $table->unsignedBigInteger('id_carriere')->nullable();

            $table->text('description')->nullable();
            $table->integer('nombre_personnels')->nullable();

            $table->timestamps();

            $table->foreign('id_service')
                  ->references('id_service')
                  ->on('services')
                  ->onDelete('set null');

            $table->foreign('id_carriere')
                  ->references('id_carriere')
                  ->on('carrieres')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('postes');
    }
};