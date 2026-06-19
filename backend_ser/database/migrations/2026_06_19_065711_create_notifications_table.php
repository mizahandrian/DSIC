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
    Schema::create('notifications', function (Blueprint $table) {
        $table->id();
        $table->string('type');
        $table->string('title');
        $table->text('message');
        $table->string('link')->nullable();
        $table->string('created_by')->nullable();
        $table->string('created_by_name')->nullable();
        $table->boolean('is_global')->default(true);
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('notifications');
}
};
