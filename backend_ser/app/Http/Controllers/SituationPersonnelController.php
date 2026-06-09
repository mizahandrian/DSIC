<?php

namespace App\Http\Controllers;

use App\Models\SituationPersonnel;
use Illuminate\Http\Request;

class SituationPersonnelController extends Controller
{
    private function formatSituation(SituationPersonnel $s): array
    {
        return [
            'id_disposition'       => $s->id_disposition,
            'id_personnel'         => $s->id_personnel,
            'personnel_nom'        => $s->personnel?->nom,
            'personnel_prenom'     => $s->personnel?->prenom,
            'personnel_matricule'  => $s->personnel?->matricule,
            'statut_administratif' => $s->statut_administratif,
            'provenance'           => $s->provenance,
            'destination'          => $s->destination,
            'date_debut'           => $s->date_debut?->format('Y-m-d'),
            'date_fin'             => $s->date_fin?->format('Y-m-d'),
            'type_mobilite'        => $s->type_mobilite,
            'commentaire'          => $s->commentaire,
        ];
    }

    public function index()
    {
        $situations = SituationPersonnel::with('personnel')
            ->get()
            ->map(fn($s) => $this->formatSituation($s));

        return response()->json($situations);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_personnel'         => 'required|exists:personnels,id',
            'statut_administratif' => 'required|in:fonctionnaire,prive',
            'provenance'           => 'required|string',
            'destination'          => 'required|string',
            'date_debut'           => 'required|date',
            'date_fin'             => 'required|date|after_or_equal:date_debut',
            'type_mobilite'        => 'required|in:formation,mission,detachement,stage',
            'commentaire'          => 'nullable|string',
        ]);

        $situation = SituationPersonnel::create($validated);
        $situation->load('personnel'); // ← important

        return response()->json($this->formatSituation($situation), 201);
    }

    public function update(Request $request, $id)
    {
        $situation = SituationPersonnel::findOrFail($id);

        $validated = $request->validate([
            'id_personnel'         => 'required|exists:personnels,id',
            'statut_administratif' => 'required|in:fonctionnaire,prive',
            'provenance'           => 'required|string',
            'destination'          => 'required|string',
            'date_debut'           => 'required|date',
            'date_fin'             => 'required|date|after_or_equal:date_debut',
            'type_mobilite'        => 'required|in:formation,mission,detachement,stage',
            'commentaire'          => 'nullable|string',
        ]);

        $situation->update($validated);
        $situation->load('personnel'); // ← important

        return response()->json($this->formatSituation($situation));
    }

    public function destroy($id)
    {
        $situation = SituationPersonnel::findOrFail($id);
        $situation->delete();
        return response()->json(null, 204);
    }
}