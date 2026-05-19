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
            BaseAugure::orderBy('id_augure', 'desc')->get()
        );
    }

    // AJOUT
    public function store(Request $request)
    {
        $validated = $request->validate([

            'agentMatricule' => 'required|unique:base_augures',
            'agentNom' => 'required',

            'structureRattachement' => 'required',
        ]);

        $data = BaseAugure::create($request->all());

        return response()->json([
            'message' => 'Ajout réussi',
            'data' => $data
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

            'agentMatricule' => 'required|unique:base_augures,agentMatricule,' . $id . ',id_augure',

            'agentNom' => 'required',

            'structureRattachement' => 'required',
        ]);

        $data->update($request->all());

        return response()->json([
            'message' => 'Modification réussie',
            'data' => $data
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