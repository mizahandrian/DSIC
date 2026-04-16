<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::create('situations_admin', function (Blueprint $table) {
        $table->id('id_situation');

        $table->unsignedBigInteger('id_personnel');

        $table->date('date_entrer')->nullable();
        $table->enum('situation', [
            'activite',
            'mise_disposition',
            'detachement',
            'disponibilite'
        ]);

        $table->string('destination')->nullable();
        $table->date('date_depart')->nullable();
        $table->text('commentaire')->nullable();

        $table->timestamps();

        // relation avec personnels
        $table->foreign('id_personnel')
              ->references('id_personnel')
              ->on('personnels')
              ->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('situations_admin');
    }
};
