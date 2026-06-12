<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Poste extends Model
{
    protected $table = 'postes';
    public $timestamps = false;
    protected $primaryKey = 'id_poste';

    protected $fillable = [
        'titre_poste',
        'description',
        'id_direction',
        'id_service',
        'categorie',
        'niveau',
        'salaire_base',
        'competences',
    ];

    public function direction()
    {
        return $this->belongsTo(Direction::class, 'id_direction', 'id_direction');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'id_service', 'id_service');
    }
}