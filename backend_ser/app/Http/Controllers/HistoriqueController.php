<?php

namespace App\Http\Controllers;

use App\Models\Historique;
use Illuminate\Http\Request;

class HistoriqueController extends Controller
{
    // GET ALL (avec nom du personnel pour React)
    public function index()
    {
        $historiques = Historique::with('personnel')->get();

        return response()->json($historiques->map(function ($h) {
            return [
                'id_historique' => $h->id_historique,
                'id_personnel' => $h->id_personnel,
                'ancien_poste' => $h->ancien_poste,
                'ancien_direction' => $h->ancien_direction,
                'date_changement' => $h->date_changement,
                'motif_changement' => $h->motif_changement,

                // 👇 IMPORTANT pour React
                'personnel_nom' => $h->personnel->nom ?? null,
                'personnel_prenom' => $h->personnel->prenom ?? null,
            ];
        }));
    }

    // CREATE
    public function store(Request $request)
    {
        $request->validate([
            'id_personnel' => 'required',
            'ancien_poste' => 'required',
            'ancien_direction' => 'required',
        ]);

        // ❗ règle métier : 1 seul historique par personnel
        $exists = Historique::where('id_personnel', $request->id_personnel)->first();
        if ($exists) {
            return response()->json([
                'message' => 'Ce personnel a déjà un historique'
            ], 422);
        }

        $historique = Historique::create($request->all());

        return response()->json($historique, 201);
    }

    // SHOW
    public function show($id)
    {
        return Historique::with('personnel')->findOrFail($id);
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $historique = Historique::findOrFail($id);
        $historique->update($request->all());

        return response()->json($historique);
    }

    // DELETE
    public function destroy($id)
    {
        Historique::destroy($id);

        return response()->json([
            'message' => 'Historique supprimé'
        ]);
    }
}
