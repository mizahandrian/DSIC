<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Personnel extends Model
{
    protected $primaryKey = 'id_personnel';

    protected $fillable = [
        'nom',
        'prenom',
        'tel',
        'genre',
        'date_naissance',
        'numero_cin',
        'date_entree',
        'motif_entree'
    ];
}