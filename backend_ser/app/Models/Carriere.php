<?php
// app/Models/Carriere.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carriere extends Model
{
    protected $table = 'carrieres';
    protected $primaryKey = 'id_carriere'; // ✅ clé primaire réelle

    protected $fillable = [
        'personnel_id',  // ✅ colonne qu'on vient d'ajouter
        'categorie',
        'indice',
        'corps',
        'grade',
        'date_effet',
    ];

    public function personnel()
    {
        return $this->belongsTo(Personnel::class, 'personnel_id');
    }
}