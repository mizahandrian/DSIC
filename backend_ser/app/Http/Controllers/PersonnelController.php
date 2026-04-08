<?php

namespace App\Http\Controllers;

use App\Models\Personnel;
use Illuminate\Http\Request;

class PersonnelController extends Controller
{
    public function index()
    {
        return Personnel::all();
    }

    public function store(Request $request)
    {
        $personnel = Personnel::create($request->all());
        return response()->json($personnel, 201);
    }

    public function show($id)
    {
        return Personnel::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $personnel = Personnel::findOrFail($id);
        $personnel->update($request->all());
        return response()->json($personnel);
    }

    public function destroy($id)
    {
        $personnel = Personnel::findOrFail($id);
        $personnel->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}