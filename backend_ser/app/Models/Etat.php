<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Etat extends Model
{
    protected $primaryKey = 'id_etat';

    protected $fillable = [
        'nom_etat',
        'cause_inactivite',
        'commentaire'
    ];
}