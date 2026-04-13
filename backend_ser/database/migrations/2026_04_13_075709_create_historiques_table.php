<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('historiques', function (Blueprint $table) {
            $table->id('id_historique');

            $table->unsignedBigInteger('id_personnel');

            $table->string('ancien_poste');
            $table->string('ancien_direction');

            $table->date('date_changement')->nullable();
            $table->string('motif_changement')->nullable();

            $table->timestamps();

            // relation
            $table->foreign('id_personnel')
                ->references('id_personnel')
                ->on('personnels')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historiques');
    }
};