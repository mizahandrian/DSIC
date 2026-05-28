<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Historique extends Model
{
    protected $table = 'historiques';
    // primaryKey reste 'id' par défaut ✅

    protected $fillable = [
        'personnel_id',
        'ancien_poste',
        'ancien_direction',
        'motif_changement',
        'date_changement',
    ];

    public function personnel()
    {
        return $this->belongsTo(Personnel::class, 'personnel_id'); // ✅ corrigé
    }
}