<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Direction extends Model
{
    protected $primaryKey = 'id_direction';

    protected $fillable = [
        'nom_direction',
        'type',
        'description'
    ];

    public $timestamps = true;

    // Relation avec services
    public function services()
    {
        return $this->hasMany(Service::class, 'id_direction');
    }

    // Relation avec personnels
    public function personnels()
    {
        return $this->hasMany(Personnel::class, 'id_direction', 'id_direction');
    }
}