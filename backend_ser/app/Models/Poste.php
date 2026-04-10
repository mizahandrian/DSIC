<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Poste extends Model
{
    protected $primaryKey = 'id_poste';

    protected $fillable = [
        'titre_poste',
        'indive',
        'id_service',
        'id_carriere',
        'description'
    ];

    public fonction service()
    {
        return $this->belongsTo(service::class, 'id_service')
    }

    public fonction carriere()
    {
        return $this->belongsTo(carriere::class, 'id_carriere')
    }

}
