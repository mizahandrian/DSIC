<?php

namespace App\Http\Controllers;

use App\Models\BaseRohi;
use Illuminate\Http\Request;

class BaseRohiController extends Controller
{
    // LISTE
    public function index()
    {
        return response()->json(
            BaseRohi::orderBy('id_rohi', 'desc')->get()
        );
    }

    // AJOUT
    public function store(Request $request)
    {
        $request->validate([
            'immatricule' => 'required|unique:base_rohis',
            'nom' => 'required',
            'prenom' => 'required',
            'direction' => 'required',
        ]);

        $data = BaseRohi::create($request->all());

        return response()->json([
            'message' => 'Ajout réussi',
            'data' => $data
        ], 201);
    }

    // AFFICHER 1
    public function show($id)
    {
        return BaseRohi::findOrFail($id);
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $rohi = BaseRohi::findOrFail($id);

        $request->validate([
            'immatricule' => 'required|unique:base_rohis,immatricule,' . $id . ',id_rohi',
            'nom' => 'required',
            'prenom' => 'required',
            'direction' => 'required',
        ]);

        $rohi->update($request->all());

        return response()->json([
            'message' => 'Modification réussie',
            'data' => $rohi
        ]);
    }

    // DELETE
    public function destroy($id)
    {
        $rohi = BaseRohi::findOrFail($id);
        $rohi->delete();

        return response()->json([
            'message' => 'Suppression réussie'
        ]);
    }
}