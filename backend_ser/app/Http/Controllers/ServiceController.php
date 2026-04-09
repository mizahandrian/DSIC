<?php
namespace App\Http\Controllers;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        return Service::with('direction')->get()->map(function ($service) {
            return [
                'id_service' => $service->id_service,
                'nom_service' => $service->nom_service,
                'id_direction' => $service->id_direction,
                'direction_nom' => $service->direction->nom_direction ?? null,
                'description' => $service->description,
                'nombre_personnels' => $service->nombre_personnels
            ];
        });
    }

    public function store(Request $request)
    {
        return Service::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);
        $service->update($request->all());
        return $service;
    }

    public function destroy($id)
    {
        Service::destroy($id);
        return response()->json(['message' => 'Supprimé']);
    }
}