<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BaseAugure extends Model
{
    protected $table = 'base_augures';

    protected $primaryKey = 'id';

    // ⚠️ Mettez false si votre table n'a pas created_at / updated_at
    public $timestamps = true;

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

    // ✅ Conversion automatique des dates vides → null
    protected $casts = [
        'agentDateNais' => 'date:Y-m-d',
        'dateEffet'     => 'date:Y-m-d',
    ];
}