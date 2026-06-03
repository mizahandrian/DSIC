<?php

namespace App\Http\Controllers;

use App\Models\Personnel;
use App\Models\Carriere;
use App\Models\Historique;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RecrutementController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nom'            => 'required|string',
            'prenom'         => 'required|string',
            'numero_cin'     => 'required|unique:personnels,numero_cin',
            'matricule'      => 'nullable|string|unique:personnels,matricule',
            'date_naissance' => 'required|date',
            'date_entree'    => 'required|date',
        ]);

        $parseDate = function(?string $date): ?string {
            if (!$date || trim($date) === '') return null;
            try {
                return Carbon::parse($date)->format('Y-m-d');
            } catch (\Exception $e) {
                return null;
            }
        };

        try {
            DB::beginTransaction();

            // 1. Créer le PERSONNEL
            $personnel = Personnel::create([
                'matricule'              => $request->matricule ?? null,
                'nom'                    => $request->nom,
                'prenom'                 => $request->prenom,
                'genre'                  => $request->genre ?? null,
                'numero_cin'             => $request->numero_cin,
                'tel'                    => $request->tel ?? null,
                'date_naissance'         => $parseDate($request->date_naissance),
                'date_entree'            => $parseDate($request->date_entree),
                'motif_entree'           => $request->motif_entree ?? null,

                'id_direction'           => $request->id_direction ?: null,
                'id_service'             => $request->id_service ?: null,
                'id_poste'               => $request->id_poste ?: null,
                'id_carriere'            => null,
                'id_etat'                => $request->id_etat ?: null,
                'id_statut'              => $request->id_statut ?: null,

                'poste'                  => $request->poste ?? null,
                'service'                => $request->service ?? null,
                'direction'              => $request->direction ?? null,

                'categorie'              => $request->categorie ?? null,
                'indice'                 => $request->indice ?? null,
                'corps'                  => $request->corps ?? null,
                'grade'                  => $request->grade ?? null,
                'date_effet_carriere'    => $parseDate($request->date_effet_carriere),

                'statut'                 => $request->statut ?? null,
                'etat'                   => $request->id_etat == 1 ? 'Actif' : 'Inactif',

                'situation'              => $request->situation ?? null,
                'date_situation'         => $parseDate($request->date_situation),
                'destination'            => $request->destination ?? null,
                'commentaire_situation'  => $request->commentaire_situation ?? null,
            ]);

            // 2. Créer la CARRIÈRE
            if ($request->filled('categorie') && $request->filled('corps') && $request->filled('grade')) {
                $carriere = Carriere::create([
                    'personnel_id' => $personnel->id,
                    'categorie'    => $request->categorie,
                    'indice'       => $request->indice ?? '-',
                    'corps'        => $request->corps,
                    'grade'        => $request->grade,
                    'date_effet'   => $parseDate($request->date_effet_carriere) ?? now()->format('Y-m-d'),
                ]);

                $personnel->update(['id_carriere' => $carriere->id_carriere]);
            }

            // 3. Créer l'HISTORIQUE  ✅ corrigé : personnel_id → id_personnel
            if ($request->filled('ancien_poste') || $request->filled('ancien_direction')) {
                Historique::create([
                    'id_personnel'     => $personnel->id,  // ✅ corrigé
                    'ancien_poste'     => $request->ancien_poste ?? null,
                    'ancien_direction' => $request->ancien_direction ?? null,
                    'motif_changement' => $request->commentaire_historique ?? null,
                    'date_changement'  => now()->format('Y-m-d'),
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Personnel recruté avec succès',
                'data'    => $personnel->fresh(),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur serveur',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}