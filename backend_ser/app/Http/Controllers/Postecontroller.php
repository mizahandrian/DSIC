<?php

namespace App\Http\Controllers;

use App\Models\Poste;
use Illuminate\Http\Request;

class PosteController extends Controller
{
    // GET ALL (avec relations comme ton React attend)
    public function index()
    {
        $postes = Poste::with(['service', 'carriere'])->get();

        // format EXACT pour React
        return response()->json($postes->map(function ($p) {
            return [
                'id_poste' => $p->id_poste,
                'titre_poste' => $p->titre_poste,
                'indice' => $p->indice,
                'id_service' => $p->id_service,
                'id_carriere' => $p->id_carriere,
                'description' => $p->description,
                'nombre_personnels' => $p->nombre_personnels,

                // 👇 IMPORTANT pour React
                'service_nom' => $p->service->nom_service ?? null,
                'carriere_categorie' => $p->carriere->categorie ?? null,
                'carriere_corps' => $p->carriere->corps ?? null,
                'carriere_grade' => $p->carriere->grade ?? null,
            ];
        }));
    }

    // CREATE
    public function store(Request $request)
    {
        $request->validate([
            'titre_poste' => 'required',
            'id_service' => 'required',
            'id_carriere' => 'required'
        ]);

        return Poste::create($request->all());
    }

    // SHOW
    public function show($id)
    {
        return Poste::with(['service', 'carriere'])->findOrFail($id);
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $poste = Poste::findOrFail($id);
        $poste->update($request->all());

        return response()->json($poste);
    }

    // DELETE
    public function destroy($id)
    {
        Poste::destroy($id);
        return response()->json(['message' => 'Poste supprimé']);
    }
}