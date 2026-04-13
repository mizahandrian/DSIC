<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Poste extends Model
{
    protected $table = 'postes';
    protected $primaryKey = 'id_poste';

    protected $fillable = [
        'titre_poste',
        'indice',
        'id_service',
        'id_carriere',
        'description',
        'nombre_personnels'
    ];

    // relation service
    public function service()
    {
        return $this->belongsTo(Service::class, 'id_service');
    }

    // relation carriere
    public function carriere()
    {
        return $this->belongsTo(Carriere::class, 'id_carriere');
    }
}