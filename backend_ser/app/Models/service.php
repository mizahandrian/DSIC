<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $table = 'services';

    protected $primaryKey = 'id_service'; // 🔥 IMPORTANT

    public $incrementing = true;

    protected $fillable = [
        'nom_service',
        'id_direction',
        'description'
    ];

    public function direction()
    {
        return $this->belongsTo(Direction::class, 'id_direction', 'id_direction');
    }
}