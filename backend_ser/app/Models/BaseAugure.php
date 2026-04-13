<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BaseAugure extends Model
{
    protected $table = 'base_augure';
    protected $primaryKey = 'id_augure';

    protected $fillable = [
        'agentMatricule','agentNom','agentCin',
        'corpsCode','gradeCode','indice',
        'posteAgentNumero','titre','categorieCode',
        'structureRattachement',
        'regCode','regLibelle',
        'sanctionCode','sanctionLibelle',
        'agentDateNais','dateEffet',
        'intervalAge','statutAgent'
    ];
}