<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carriere extends Model
{
    protected $table = 'carrieres';
    protected $primaryKey = 'id_carriere';

    protected $fillable = [
        'categorie',
        'indice',
        'corps',
        'grade',
        'date_effet',
        'nombre_postes',
        'description'
    ];
}