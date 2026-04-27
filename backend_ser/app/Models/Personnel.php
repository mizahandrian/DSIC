<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Personnel extends Model
{
    protected $primaryKey = 'id_personnel';

    protected $fillable = [
        'nom','prenom','genre','numero_cin','tel','date_naissance',
        'date_entree','motif_entree',
        'id_direction','id_service','id_poste','id_carriere','id_etat',
        'situation_admin','date_entrer_situation','destination','commentaire_situation'
    ];

    public function direction() {
        return $this->belongsTo(Direction::class, 'id_direction');
    }

    public function service() {
        return $this->belongsTo(Service::class, 'id_service');
    }

    public function poste() {
        return $this->belongsTo(Poste::class, 'id_poste');
    }

    public function carriere() {
        return $this->belongsTo(Carriere::class, 'id_carriere');
    }

    public function etat() {
        return $this->belongsTo(Etat::class, 'id_etat');
    }

    public function statuts() {
        return $this->belongsToMany(Statut::class, 'personnel_statut', 'id_personnel', 'id_statut');
    }

    public function historique() {
        return $this->hasOne(Historique::class, 'id_personnel');
    }
}