// database/migrations/xxxx_xx_xx_create_directions_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDirectionsTable extends Migration
{
    public function up()
    {
        Schema::create('directions', function (Blueprint $table) {
            $table->id('id_direction');
            $table->string('nom_direction');
            $table->enum('type', ['centrale', 'regionale', 'provinciale'])->default('centrale');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('directions');
    }
}