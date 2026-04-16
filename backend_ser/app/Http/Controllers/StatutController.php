<?php

namespace App\Http\Controllers;

use App\Models\Statut;
use Illuminate\Http\Request;

class StatutController extends Controller
{
    // GET
    public function index()
    {
        return response()->json(Statut::all());
    }

    // POST
    public function store(Request $request)
    {
        $statut = Statut::create($request->all());
        return response()->json($statut, 201);
    }

    // PUT
    public function update(Request $request, $id)
    {
        $statut = Statut::findOrFail($id);
        $statut->update($request->all());
        return response()->json($statut);
    }

    // DELETE
    public function destroy($id)
    {
        $statut = Statut::findOrFail($id);
        $statut->delete();

        return response()->json(['message' => 'Supprimé']);
    }
}