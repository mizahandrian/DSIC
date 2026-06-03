<?php

namespace App\Http\Controllers;

use App\Models\BaseAugure;
use Illuminate\Http\Request;

class BaseAugureController extends Controller
{

    // LISTE
    public function index()
{
    return response()->json(
        BaseAugure::orderBy('id', 'desc')->get()
    );
}

    // AJOUT
    public function store(Request $request)
{
    $validated = $request->validate([
        'agentMatricule' => 'required|unique:base_augures',
        'agentNom'       => 'required',
        'structureRattachement' => 'required',
    ]);

    // Convertir les chaînes vides en null pour les dates
    $data = $request->merge([
        'agentDateNais' => $request->agentDateNais ?: null,
        'dateEffet'     => $request->dateEffet ?: null,
    ])->all();

    $created = BaseAugure::create($data);

    return response()->json([
        'message' => 'Ajout réussi',
        'data'    => $created
    ], 201);
}

    // AFFICHER 1
    public function show(string $id)
    {
        $data = BaseAugure::findOrFail($id);

        return response()->json($data);
    }

    // MODIFIER
    public function update(Request $request, string $id)
{
    $data = BaseAugure::findOrFail($id);

    $request->validate([
        'agentMatricule'        => 'required|unique:base_augures,agentMatricule,' . $id . ',id_augure',
        'agentNom'              => 'required',
        'structureRattachement' => 'required',
    ]);

    $payload = $request->merge([
        'agentDateNais' => $request->agentDateNais ?: null,
        'dateEffet'     => $request->dateEffet ?: null,
    ])->all();

    $data->update($payload);

    return response()->json([
        'message' => 'Modification réussie',
        'data'    => $data
    ]);
}

    // SUPPRIMER
    public function destroy(string $id)
    {
        $data = BaseAugure::findOrFail($id);

        $data->delete();

        return response()->json([
            'message' => 'Suppression réussie'
        ]);
    }
}