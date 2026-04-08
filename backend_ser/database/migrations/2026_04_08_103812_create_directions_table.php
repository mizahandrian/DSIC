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
    Schema::create('directions', function (Blueprint $table) {
        $table->id('id_direction');
        $table->string('nom_direction');
        $table->enum('type', ['centrale', 'regionale', 'provinciale']);
        
        $table->unsignedBigInteger('parent_id')->nullable();

        $table->integer('nombre_services')->default(0);
        $table->integer('nombre_personnels')->default(0);

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('directions');
    }
};
