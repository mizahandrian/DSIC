<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('carrieres', function (Blueprint $table) {
            $table->id('id_carriere');
            $table->string('categorie');
            $table->string('indice');
            $table->string('corps');
            $table->string('grade');
            $table->date('date_effet');
            $table->integer('nombre_postes')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carrieres');
    }
};