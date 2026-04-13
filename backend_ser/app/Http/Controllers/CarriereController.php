<?php

namespace App\Http\Controllers;

use App\Models\Carriere;
use Illuminate\Http\Request;

class CarriereController extends Controller
{
    // GET /api/carrieres
    public function index()
    {
        return response()->json(Carriere::all());
    }

    // POST /api/carrieres
    public function store(Request $request)
    {
        $request->validate([
            'categorie' => 'required',
            'indice' => 'required',
            'corps' => 'required',
            'grade' => 'required',
            'date_effet' => 'required|date',
        ]);

        $carriere = Carriere::create($request->all());

        return response()->json($carriere, 201);
    }

    // GET /api/carrieres/{id}
    public function show($id)
    {
        return Carriere::findOrFail($id);
    }

    // PUT /api/carrieres/{id}
    public function update(Request $request, $id)
    {
        $carriere = Carriere::findOrFail($id);
        $carriere->update($request->all());

        return response()->json($carriere);
    }

    // DELETE /api/carrieres/{id}
    public function destroy($id)
    {
        Carriere::destroy($id);

        return response()->json(['message' => 'Supprimé avec succès']);
    }
}