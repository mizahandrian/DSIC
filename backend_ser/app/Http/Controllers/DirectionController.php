<?php

namespace App\Http\Controllers;

use App\Models\Direction;
use Illuminate\Http\Request;

class DirectionController extends Controller
{
    public function index()
    {
        return Direction::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom_direction' => 'required',
            'type' => 'required|in:centrale,regionale,provinciale'
        ]);

        $direction = Direction::create([
            'nom_direction' => $request->nom_direction,
            'type' => $request->type,
            'parent_id' => $request->parent_id ?? null,
            'nombre_services' => 0,
            'nombre_personnels' => 0
        ]);

        return response()->json($direction, 201);
    }

    public function show($id)
    {
        return Direction::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $direction = Direction::findOrFail($id);

        $direction->update($request->only([
            'nom_direction',
            'type',
            'parent_id',
            'nombre_services',
            'nombre_personnels'
        ]));

        return response()->json($direction);
    }

    public function destroy($id)
    {
        $direction = Direction::findOrFail($id);
        $direction->delete();

        return response()->json(['message' => 'Direction supprimée']);
    }
}