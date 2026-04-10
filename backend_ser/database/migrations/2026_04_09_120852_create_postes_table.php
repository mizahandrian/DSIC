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
        Schema::create('postes', function (Blueprint $table) {
            $table->id('id_poste');
            $table->string('tite_poste');
            $table->string('indice')->nullable();

            $table->usingnebBigInteger('id_servive');
            $table->usingnebBigInteger('id_carriere');

            $table->text('description')->nullable();

            $table->timestamps();

            $table->foreign('id_service')->references('id_service')->on('service')->onDelete('cascade');
            $table->foreign('id_carriere')->references('id_carriere')->on('carriere')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('postes');
    }
};
