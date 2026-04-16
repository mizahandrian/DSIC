<?php

namespace App\Http\Controllers;

use App\Models\Etat;
use Illuminate\Http\Request;

class EtatController extends Controller
{
    // GET /etats
    public function index()
    {
        return response()->json(Etat::all());
    }

    // POST /etats
    public function store(Request $request)
    {
        $etat = Etat::create($request->all());
        return response()->json($etat, 201);
    }

    // PUT /etats/{id}
    public function update(Request $request, $id)
    {
        $etat = Etat::findOrFail($id);
        $etat->update($request->all());
        return response()->json($etat);
    }

    // DELETE /etats/{id}
    public function destroy($id)
    {
        $etat = Etat::findOrFail($id);
        $etat->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}
