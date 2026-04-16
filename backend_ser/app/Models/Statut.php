<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Statut extends Model
{
    protected $primaryKey = 'id_statut';

    protected $fillable = [
        'nom_statut',
        'type_statut',
        'description'
    ];
}