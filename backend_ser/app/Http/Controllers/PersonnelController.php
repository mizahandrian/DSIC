<?php

namespace App\Http\Controllers;

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
        'id_poste' => $request->id_poste,
        'id_carriere' => $request->id_carriere,
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
        $personnel = Personnel::findOrFail($id);
        $personnel->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}