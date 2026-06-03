<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Historique extends Model
{
    protected $table = 'historiques';
    // primaryKey reste 'id' par défaut ✅

   protected $fillable = [
    'id_personnel',       // ✅ était personnel_id, corrigé
    'ancien_poste',
    'ancien_direction',
    'motif_changement',
    'date_changement',
];

    public function personnel()
    {
        return $this->belongsTo(Personnel::class, 'id_personnel'); // ✅ corrigé
    }
}