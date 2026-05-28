<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carriere extends Model
{
    protected $table = 'carrieres';
    protected $primaryKey = 'id_carriere'; // ✅

    protected $fillable = [
        'personnel_id',
        'categorie',
        'indice',
        'corps',
        'grade',
        'date_effet',
    ];

    public function personnel()
    {
        return $this->belongsTo(Personnel::class, 'personnel_id'); // ✅
    }
}