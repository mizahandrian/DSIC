<?php

namespace App\Models;

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Carriere extends Model
{
    use HasFactory;

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