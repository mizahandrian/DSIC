<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Historique extends Model
{
    protected $table = 'historiques';
    protected $primaryKey = 'id_historique';

    protected $fillable = [
        'id_personnel',
        'ancien_poste',
        'ancien_direction',
        'date_changement',
        'motif_changement'
    ];

    // relation personnel
    public function personnel()
    {
        return $this->belongsTo(Personnel::class, 'id_personnel');
    }
}