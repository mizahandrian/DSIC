<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Direction extends Model
{
    protected $primaryKey = 'id_direction';

    protected $fillable = [
        'nom_direction',
        'type',
        'parent_id',
        'nombre_services',
        'nombre_personnels'
    ];
}