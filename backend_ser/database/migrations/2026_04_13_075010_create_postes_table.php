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
            $table->text('description')->nullable();
            $table->unsignedBigInteger('id_direction');
            $table->unsignedBigInteger('id_service');
            $table->string('categorie')->nullable();
            $table->string('niveau')->nullable();
            $table->decimal('salaire_base', 15, 2)->nullable();
            $table->text('competences')->nullable();
            $table->foreign('id_direction')
                  ->references('id_direction')
                  ->on('directions')
                  ->onDelete('cascade');
            $table->foreign('id_service')
                  ->references('id_service')
                  ->on('services')
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('postes');
    }
};