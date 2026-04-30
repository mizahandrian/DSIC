<?php

namespace App\Http\Controllers;

use App\Models\Direction;
use Illuminate\Http\Request;

class DirectionController extends Controller
{
    // 🔹 GET all directions
    public function index()
    {
        return Direction::withCount('services')
            ->get()
            ->map(function ($direction) {
                return [
                    'id_direction' => $direction->id_direction,
                    'nom_direction' => $direction->nom_direction,
                    'type' => $direction->type,
                    'description' => $direction->description,
                    'nombre_services' => $direction->services_count,
                    'nombre_personnels' => 0 // tu peux améliorer après
                ];
            });
    }

    // 🔹 ADD direction
    public function store(Request $request)
    {
        $request->validate([
            'nom_direction' => 'required|string|max:255',
            'type' => 'required|in:centrale,regionale,provinciale',
            'description' => 'nullable|string'
        ]);

        $direction = Direction::create($request->all());

        return response()->json($direction, 201);
    }

    // 🔹 UPDATE direction
    public function update(Request $request, $id)
    {
        $direction = Direction::findOrFail($id);

        $direction->update($request->all());

        return response()->json($direction);
    }

    // 🔹 DELETE direction
    public function destroy($id)
    {
        Direction::destroy($id);

        return response()->json(['message' => 'Supprimé']);
    }
}