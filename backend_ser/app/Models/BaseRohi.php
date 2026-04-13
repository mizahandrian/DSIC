<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BaseRohi extends Model
{
    protected $table = 'base_rohi';
    protected $primaryKey = 'id_rohi';

    protected $fillable = [
        'immatricule','nom','prenom','poste',
        'porte','telephone','direction','service','statut'
    ];
}