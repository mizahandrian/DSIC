<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Statut extends Model
{
      protected $table = 'statuts';
    protected $primaryKey = 'id_statut';
    public $timestamps = false;

    protected $fillable = [
        'nom_statut',
        'type_statut',
        'description'
    ];

    public function personnels()
    {
        return $this->belongsToMany(
            Personnel::class,
            'personnel_statut',
            'id_statut',
            'id_personnel'
        );
    }
}