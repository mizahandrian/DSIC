<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
       Schema::create('historiques', function (Blueprint $table) {
    $table->id();
    $table->foreignId('personnel_id')->constrained()->onDelete('cascade');

    $table->string('ancien_poste')->nullable();
    $table->string('ancien_direction')->nullable();
    $table->text('motif_changement')->nullable();
    $table->date('date_changement')->nullable();

    $table->timestamps();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('historiques');
    }
};