<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Direction;

class DirectionController extends Controller
{
    // GET /directions
    public function index()
    {
        return response()->json(Direction::all());
    }

    // POST /directions
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom_direction' => 'required|string',
            'type' => 'required|in:centrale,regionale,provinciale',
            'description' => 'nullable|string',
        ]);

        $direction = Direction::create($validated);

        return response()->json($direction, 201);
    }

    // PUT /directions/{id}
    public function update(Request $request, $id)
    {
        $direction = Direction::findOrFail($id);

        $direction->update($request->all());

        return response()->json($direction);
    }

    // DELETE /directions/{id}
    public function destroy($id)
    {
        $direction = Direction::findOrFail($id);
        $direction->delete();

        return response()->json(['message' => 'Supprimé']);
    }
}