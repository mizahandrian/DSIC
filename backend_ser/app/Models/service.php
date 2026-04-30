<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'nom_service',
        'id_direction',
        'description'
    ];

    public function direction()
    {
        return $this->belongsTo(Direction::class, 'id_direction');
    }
}
