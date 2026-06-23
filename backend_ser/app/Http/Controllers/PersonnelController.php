<?php

namespace App\Http\Controllers;
/*
use App\Models\Personnel;
use Illuminate\Http\Request;

class PersonnelController extends Controller
{
    public function index()
    {
        return Personnel::all();
    }

   public function store(Request $request)
{
      // 🔥 VALIDATION (AJOUT ICI)
    $request->validate([
    'nom' => 'required',
    'prenom' => 'required',
    'genre' => 'required',
    'numero_cin' => 'required',
    'date_naissance' => 'required',
    'date_entree' => 'required',

    'id_direction' => 'required|exists:directions,id_direction',
    'id_service' => 'required|exists:services,id_service',

    'id_etat' => 'nullable|integer',
    'id_poste' => 'nullable|integer',
    'id_carriere' => 'nullable|integer',
]);
    // 1. créer personnel (champs contrôlés)
     $personnel = Personnel::create([
        'nom' => $request->nom,
        'prenom' => $request->prenom,
        'genre' => $request->genre,
        'numero_cin' => $request->numero_cin,
        'tel' => $request->tel,
        'date_naissance' => $request->date_naissance,
        'date_entree' => $request->date_entree,
        'motif_entree' => $request->motif_entree,

        'id_direction' => $request->id_direction,
        'id_service' => $request->id_service,
        'id_poste' => $request->id_poste ?? null,
        'id_carriere' => $request->id_carriere ?? null,
        'id_etat' => $request->id_etat,

        'situation_admin' => $request->situation_admin,
        'date_entrer_situation' => $request->date_entrer_situation,
        'destination' => $request->destination,
        'commentaire_situation' => $request->commentaire_situation,
    ]);

    // 2. gérer statuts (TABLEAU)
    if ($request->has('statuts') && is_array($request->statuts)) {
        $personnel->statuts()->sync($request->statuts);
    }

    return response()->json([
        'message' => 'Personnel créé avec succès',
        'data' => $personnel
    ], 201);
}

    public function show($id)
    {
        return Personnel::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $personnel = Personnel::findOrFail($id);
        $personnel->update($request->all());
        return response()->json($personnel);
    }

    public function destroy($id)
    {
        try {
            $personnel = Personnel::findOrFail($id);
            $personnel->delete();
            return response()->json(['message' => 'Supprimé']);
        } catch (\Exception $e) {
            // Journaliser l'erreur complète pour investigation
            logger()->error('Erreur suppression personnel', ['id' => $id, 'error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Erreur serveur lors de la suppression', 'error' => $e->getMessage()], 500);
        }
    }
}*/
use App\Models\Personnel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PersonnelController extends Controller
{
    private function normalizeEtat(?string $etat): ?string
    {
        if ($etat === null) {
            return null;
        }

        $etat = trim($etat);
        if ($etat === '') {
            return null;
        }

        $lower = strtolower($etat);
        if ($lower === 'inactif') {
            return 'Inactif';
        }

        if ($lower === 'actif') {
            return 'Actif';
        }

        return $etat;
    }

    public function store(Request $request)
    {
        $data = $request->all();
        
        // Récupérer le titre du poste depuis id_poste
        if (!empty($data['id_poste'])) {
            $poste = \App\Models\Poste::find($data['id_poste']);
            $data['poste'] = $poste?->titre_poste;
        }

        if (!empty($data['id_etat'])) {
            $etatModel = \App\Models\Etat::find($data['id_etat']);
            $data['etat'] = $etatModel?->nom_etat ?? $this->normalizeEtat($data['etat'] ?? 'Actif');
        } else {
            $data['etat'] = $this->normalizeEtat($data['etat'] ?? 'Actif');
        }
        
        $personnel = Personnel::create($data);

        return response()->json([
            'message' => 'OK',
            'data' => $personnel
        ]);
    }

   public function index()
{
    return Personnel::with(['directionRelation', 'serviceRelation', 'posteRelation'])
        ->get()
        ->map(fn($p) => array_merge($p->toArray(), [
            'id_personnel' => $p->id, 
            'direction' => $p->directionRelation?->nom_direction ?? $p->direction,
            'service'   => $p->serviceRelation?->nom_service ?? $p->service,
            'poste'     => $p->posteRelation?->titre_poste ?? $p->poste,
            'etat'      => $this->normalizeEtat($p->etat),
        ]));
}

    public function update(Request $request, $id)
    {
        $personnel = Personnel::findOrFail($id);
        $data = $request->all();

        if (!empty($data['id_etat'])) {
            $etatModel = \App\Models\Etat::find($data['id_etat']);
            if ($etatModel) {
                $data['etat'] = $etatModel->nom_etat;
            }
        } elseif (array_key_exists('etat', $data)) {
            $data['etat'] = $this->normalizeEtat($data['etat'] ?? 'Actif');
        }

        if (!empty($data['id_poste'])) {
            $poste = \App\Models\Poste::find($data['id_poste']);
            $data['poste'] = $poste?->titre_poste;
        }

        $personnel->update($data);
        return response()->json($personnel);
    }

    public function destroy($id)
    {
        try {
            $personnel = Personnel::findOrFail($id);
            $personnel->delete();
            return response()->json(['message' => 'Supprimé']);
        } catch (\Exception $e) {
            logger()->error('Erreur suppression personnel', ['id' => $id, 'error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Erreur serveur lors de la suppression', 'error' => $e->getMessage()], 500);
        }
    }

    public function getAnciennete($id)
    {
        try {
            $historique = \App\Models\Historique::where('personnel_id', $id)
                ->orderByDesc('id')
                ->first();

        if (!$historique) {
            return response()->json([
                'ancien_poste' => null,
                'ancien_direction' => null,
                'ancien_service' => null,
                'ancien_employeur' => null,
                'ancien_categorie' => null,
                'ancien_grade' => null,
                'ancien_corps' => null,
                'ancien_indice' => null,
                'date_debut' => null,
                'date_fin' => null,
                'motif_depart' => null,
                'commentaire_historique' => null,
            ]);
        }

        return response()->json([
            'ancien_poste' => $historique->ancien_poste,
            'ancien_direction' => $historique->ancien_direction,
            'ancien_service' => $historique->ancien_service,
            'ancien_employeur' => $historique->ancien_employeur,
            'ancien_categorie' => $historique->ancien_categorie,
            'ancien_grade' => $historique->ancien_grade,
            'ancien_corps' => $historique->ancien_corps,
            'ancien_indice' => $historique->ancien_indice,
            'date_debut' => $historique->date_debut,
            'date_fin' => $historique->date_fin,
            'motif_depart' => $historique->motif_depart,
            'commentaire_historique' => $historique->motif_changement,
        ]);
    } catch (\Exception $e) {
        logger()->error('Erreur récupération ancienneté', ['id' => $id, 'error' => $e->getMessage()]);
        return response()->json(['error' => $e->getMessage()], 500);
    }

}
public function mettreEnRetraite(Request $request)
{
    $request->validate([
        'ids'         => 'required|array',
        'ids.*'       => 'integer',
        'date_sortie' => 'required|date',
        'motif'       => 'required|string',
    ]);

    DB::beginTransaction();
    try {
        // Vérifier que tous ont bien ≥ 60 ans
        $invalides = DB::table('personnels')
            ->whereIn('id', $request->ids)
            ->whereRaw('TIMESTAMPDIFF(YEAR, date_naissance, CURDATE()) < 60')
            ->pluck('nom');

        if ($invalides->count() > 0) {
            return response()->json([
                'message' => 'Ces personnels n\'ont pas encore 60 ans : ' . $invalides->join(', ')
            ], 422);
        }

        DB::table('personnels')
            ->whereIn('id', $request->ids)
            ->where('statut', '!=', 'retraite')
            ->update([
                'statut'       => 'retraite',
                'etat'         => 'Inactif',
                'date_sortie'  => $request->date_sortie,
                'motif_sortie' => $request->motif,
                'updated_at'   => now(),
            ]);

        DB::commit();
        return response()->json([
            'message' => count($request->ids) . ' personnel(s) mis à la retraite avec succès'
        ]);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['message' => 'Erreur : ' . $e->getMessage()], 500);
    }
}

public function annulerRetraite($id)
{
    DB::beginTransaction();
    try {
        DB::table('personnels')
            ->where('id', $id)
            ->update([
                'statut'       => 'inactif',
                'etat'         => 'Actif',
                'date_sortie'  => null,
                'motif_sortie' => null,
                'updated_at'   => now(),
            ]);

        DB::commit();
        return response()->json(['message' => 'Retraite annulée avec succès']);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['message' => 'Erreur : ' . $e->getMessage()], 500);
    }
}
}