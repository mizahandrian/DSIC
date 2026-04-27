<?php

namespace App\Http\Controllers;

use App\Models\Historique;
use Illuminate\Http\Request;

class HistoriqueController extends Controller
{
    // GET ALL (format compatible React)
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
    $historique = Historique::create([
        'id_personnel' => $request->id_personnel,
        'ancien_poste' => $request->ancien_poste,
        'ancien_direction' => $request->ancien_direction,
        'motif_changement' => $request->motif_changement,
        'date_changement' => $request->date_changement,
    ]);

    return response()->json($historique);
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