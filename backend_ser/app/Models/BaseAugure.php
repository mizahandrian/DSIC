<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BaseAugure extends Model
{
    protected $table = 'base_augures';

    protected $primaryKey = 'id_augure';

    protected $fillable = [

        'agentMatricule',
        'agentNom',
        'agentCin',
        'agentDateNais',

        'corpsCode',
        'gradeCode',

        'indice',
        'categorieCode',

        'posteAgentNumero',

        'titre',

        'structureRattachement',

        'statutAgent',

        'sanctionCode',
        'sanctionLibelle',

        'regCode',
        'regLibelle',

        'dateEffet',

        'intervalAge',
    ];
}