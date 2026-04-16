<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SituationAdmin extends Model
{
    protected $table = 'situations_admin';
    protected $primaryKey = 'id_situation';

    protected $fillable = [
        'id_personnel',
        'date_entrer',
        'situation',
        'destination',
        'date_depart',
        'commentaire'
    ];

    public function personnel()
    {
        return $this->belongsTo(Personnel::class, 'id_personnel');
    }
}