<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $primaryKey = 'id_service';

    protected $fillable = [
        'nom_service',
        'id_direction',
        'description',
        'nombre_personnels'
    ];

    public function direction()
    {
        return $this->belongsTo(Direction::class, 'id_direction');
    }
}