<?php

namespace App\Http\Controllers;

use App\Models\Poste;
use Illuminate\Http\Request;

class PosteController extends Controller
{
    // GET /postes
    public function index()
    {
        $postes = Poste::with(['service', 'carriere'])->get();

        // Adapter pour le frontend
        return $postes->map(function ($p) {
            return [
                'id_poste' => $p->id_poste,
                'titre_poste' => $p->titre_poste,
                'indice' => $p->indice,
                'id_service' => $p->id_service,
                'id_carriere' => $p->id_carriere,
                'service_nom' => $p->service->nom_service ?? null,
                'carriere_categorie' => $p->carriere->categorie ?? null,
                'carriere_corps' => $p->carriere->corps ?? null,
                'carriere_grade' => $p->carriere->grade ?? null,
                'description' => $p->description,
                'nombre_personnels' => 0 // tu peux modifier plus tard
            ];
        });
    }

    // POST /postes
    public function store(Request $request)
    {
        $request->validate([
            'titre_poste' => 'required|string',
            'id_service' => 'required|exists:services,id_service',
            'id_carriere' => 'required|exists:carrieres,id_carriere',
        ]);

        $poste = Poste::create($request->all());

        return response()->json($poste, 201);
    }

    // PUT /postes/{id}
    public function update(Request $request, $id)
    {
        $poste = Poste::findOrFail($id);

        $poste->update($request->all());

        return response()->json($poste);
    }

    // DELETE /postes/{id}
    public function destroy($id)
    {
        $poste = Poste::findOrFail($id);
        $poste->delete();

        return response()->json(['message' => 'Supprimé avec succès']);
    }
}