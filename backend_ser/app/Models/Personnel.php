<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Personnel extends Model
{
    protected $table = 'personnels';

    protected $fillable = [
        'matricule', 'nom', 'prenom', 'genre', 'numero_cin', 'tel', 'date_naissance',
        'date_entree', 'motif_entree',
        'id_direction', 'id_service', 'id_poste', 'id_carriere', 'id_etat', 'id_statut',
        'direction', 'service', 'poste',
        'categorie', 'indice', 'corps', 'grade', 'date_effet_carriere',
        'statut', 'etat',
        'situation', 'date_situation', 'destination', 'commentaire_situation',
        'ancien_poste', 'ancien_direction', 'commentaire_historique',
    ];

    // ─── RELATIONS ───────────────────────────────────────────

    public function direction()
    {
        return $this->belongsTo(Direction::class, 'id_direction', 'id_direction');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'id_service', 'id_service');
    }

    public function poste()
    {
        return $this->belongsTo(Poste::class, 'id_poste', 'id_poste');
    }

    public function carriere()
    {
        return $this->belongsTo(Carriere::class, 'id_carriere', 'id_carriere');
    }

    public function etat()
    {
        return $this->belongsTo(Etat::class, 'id_etat', 'id_etat'); // ✅ PK = id_etat
    }

    public function statut()
    {
        return $this->belongsTo(Statut::class, 'id_statut', 'id'); // ✅ PK = id
    }

    public function historiques()
    {
        return $this->hasMany(Historique::class, 'personnel_id', 'id');
    }
}