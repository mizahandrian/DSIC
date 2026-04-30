<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    // ✅ LISTE TOUT LES SERVICES
    public function index()
    {
        return Service::with('direction')
            ->orderBy('nom_service')
            ->get()
            ->map(function ($service) {
                return [
                    'id_service' => $service->id_service,
                    'nom_service' => $service->nom_service,
                    'id_direction' => $service->id_direction,
                    'direction_nom' => $service->direction->nom_direction ?? null,
                ];
            });
    }

    // ✅ SERVICES PAR DIRECTION
    public function getByDirection($id)
    {
        return Service::where('id_direction', $id)
            ->with('direction')
            ->orderBy('nom_service')
            ->get()
            ->map(function ($service) {
                return [
                    'id_service' => $service->id_service,
                    'nom_service' => $service->nom_service,
                    'id_direction' => $service->id_direction,
                    'direction_nom' => $service->direction->nom_direction ?? null,
                ];
            });
    }

    // ✅ CREATE
    public function store(Request $request)
    {
        $request->validate([
            'nom_service' => 'required',
            'id_direction' => 'required|exists:directions,id_direction'
        ]);

        return Service::create($request->all());
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);
        $service->update($request->all());
        return $service;
    }

    // DELETE
    public function destroy($id)
{
    $service = Service::find($id);

    if (!$service) {
        return response()->json(['message' => 'Service introuvable'], 404);
    }

    try {
        $service->delete();
        return response()->json(['message' => 'Supprimé avec succès']);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur suppression',
            'error' => $e->getMessage()
        ], 500);
    }
}
}