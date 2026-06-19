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
    Schema::create('notification_reads', function (Blueprint $table) {
        $table->id();
        $table->foreignId('notification_id')->constrained()->onDelete('cascade');
        $table->string('user_id');
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('notification_reads');
}
};
