<?php

namespace App\Http\Controllers;

use App\Models\SituationAdmin;
use Illuminate\Http\Request;

class SituationAdminController extends Controller
{
    // GET
    public function index()
    {
        $situations = SituationAdmin::with('personnel')->get();

        return response()->json($situations);
    }

    // POST
    public function store(Request $request)
    {
        $situation = SituationAdmin::create($request->all());

        return response()->json($situation, 201);
    }

    // PUT
    public function update(Request $request, $id)
    {
        $situation = SituationAdmin::findOrFail($id);

        $situation->update($request->all());

        return response()->json($situation);
    }

    // DELETE
    public function destroy($id)
    {
        $situation = SituationAdmin::findOrFail($id);
        $situation->delete();

        return response()->json(['message' => 'Supprimé']);
    }
}
