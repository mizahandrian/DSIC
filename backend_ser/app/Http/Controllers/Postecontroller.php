<?php
namespace App\Http\Controllers;

use App\Models\Poste;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PosteController extends Controller
{
    // GET /api/postes
    public function index(): JsonResponse
    {
        $postes = Poste::with(['direction', 'service'])
            ->orderBy('titre_poste')
            ->get()
            ->map(fn($p) => [
                'id_poste'      => $p->id_poste,
                'titre_poste'   => $p->titre_poste,
                'description'   => $p->description,
                'id_direction'  => $p->id_direction,
                'id_service'    => $p->id_service,
                'direction_nom' => $p->direction?->nom_direction,
                'service_nom'   => $p->service?->nom_service,
                'categorie'     => $p->categorie,
                'niveau'        => $p->niveau,
                'salaire_base'  => $p->salaire_base,
                'competences'   => $p->competences,
            ]);

        return response()->json($postes);
    }

    // POST /api/postes
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
    'titre_poste'  => 'required|string|max:255',
    'description'  => 'nullable|string',
    'id_service'   => 'required|exists:services,id_service',
    'indice'             => 'nullable|string',
    'id_carriere'        => 'nullable|exists:carrieres,id_carriere',
    'nombre_personnels'  => 'nullable|integer|min:0',
]);

        $poste = Poste::create($validated);
        $poste->load(['direction', 'service']);

        return response()->json($poste, 201);
    }

    // PUT /api/postes/{id}
    public function update(Request $request, int $id): JsonResponse
    {
        $poste = Poste::findOrFail($id);

        $validated = $request->validate([
            'titre_poste'  => 'sometimes|required|string|max:255',
            'description'  => 'nullable|string',
            'id_direction' => 'sometimes|required|exists:directions,id_direction',
            'id_service'   => 'sometimes|required|exists:services,id_service',
            'categorie'    => 'nullable|string|max:10',
            'niveau'       => 'nullable|string|max:50',
            'salaire_base' => 'nullable|numeric|min:0',
            'competences'  => 'nullable|string',
        ]);

        $poste->update($validated);
        $poste->load(['direction', 'service']);

        return response()->json($poste);
    }

    // DELETE /api/postes/{id}
    public function destroy(int $id): JsonResponse
    {
        Poste::findOrFail($id)->delete();
        return response()->json(['message' => 'Poste supprimé']);
    }
}