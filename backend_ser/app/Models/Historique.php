<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Historique extends Model
{
    protected $table = 'historiques';

    protected $fillable = [
    'personnel_id',
    'ancien_poste',
    'ancien_direction',
    'ancien_service',
    'ancien_employeur',
    'ancien_categorie',
    'ancien_grade',
    'ancien_corps',
    'ancien_indice',
    'date_debut',
    'date_fin',
    'motif_depart',
    'motif_changement',
    'date_changement',
];

    public function personnel()
    {
        return $this->belongsTo(Personnel::class, 'personnel_id', 'id');
    }
}