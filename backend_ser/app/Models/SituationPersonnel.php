<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SituationPersonnel extends Model
{
    protected $primaryKey = 'id_disposition';

    protected $fillable = [
        'id_personnel',
        'statut_administratif',
        'provenance',
        'destination',
        'date_debut',
        'date_fin',
        'type_mobilite',
        'commentaire',
    ];

    // ← Ajouter les casts sans format pour éviter le 500
    protected $casts = [
        'date_debut' => 'date',
        'date_fin'   => 'date',
    ];

    public function personnel()
    {
        return $this->belongsTo(\App\Models\Personnel::class, 'id_personnel', 'id');
    }
}