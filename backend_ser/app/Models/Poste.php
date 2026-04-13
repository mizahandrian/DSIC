<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Service;
use App\Models\Carriere;

class Poste extends Model
{
    protected $primaryKey = 'id_poste';

    protected $fillable = [
        'titre_poste',
        'indice',
        'id_service',
        'id_carriere',
        'description'
    ];

    public function service()
    {
        return $this->belongsTo(Service::class, 'id_service');
    }

    public function carriere()
    {
        return $this->belongsTo(Carriere::class, 'id_carriere');
    }
}