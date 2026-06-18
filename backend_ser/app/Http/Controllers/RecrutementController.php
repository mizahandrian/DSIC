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
            'date_naissance' => 'required|date',
            'date_entree'    => 'required|date',
        ]);

        // ✅ Helper pour nettoyer toutes les dates → format Y-m-d
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

            // Si l'utilisateur a sélectionné un poste par son id, on récupère son intitulé
            $posteTitre = null;
            if ($request->filled('id_poste')) {
                $poste = \App\Models\Poste::find($request->id_poste);
                $posteTitre = $poste?->titre_poste;
            }

            $etatValue = $request->filled('etat') ? trim($request->etat) : null;
            if ($etatValue === null && $request->filled('statut')) {
                $etatValue = trim($request->statut);
            }

            if ($request->filled('id_etat')) {
                $etatModel = \App\Models\Etat::find($request->id_etat);
                $etatValue = $etatModel?->nom_etat ?? $etatValue;
            }

            if ($etatValue === null || $etatValue === '') {
                $etatValue = 'Actif';
            } else {
                $lower = strtolower($etatValue);
                if ($lower === 'actif') {
                    $etatValue = 'Actif';
                } elseif ($lower === 'inactif') {
                    $etatValue = 'Inactif';
                }
            }

            // ✅ 1. Créer le PERSONNEL
            $personnel = Personnel::create([
                'matricule'              => $request->matricule ?? null,
                'nom'                    => $request->nom,
                'prenom'                 => $request->prenom,
                'genre'                  => $request->genre ?? null,
                'numero_cin'             => $request->numero_cin,
                'tel'                    => $request->tel ?? null,
                'date_naissance'         => $parseDate($request->date_naissance),      // ✅
                'date_entree'            => $parseDate($request->date_entree),          // ✅
                'motif_entree'           => $request->motif_entree ?? null,

                'id_direction'           => $request->id_direction ?: null,
                'id_service'             => $request->id_service ?: null,
                'id_poste'               => $request->id_poste ?: null,
                'id_carriere'            => null,
                'id_etat'                => $request->id_etat ?: null,
                'id_statut'              => $request->id_statut ?: null,

                'poste'                  => $posteTitre ?? $request->poste ?? null,
                'service'                => $request->service ?? null,
                'direction'              => $request->direction ?? null,

                'categorie'              => $request->categorie ?? null,
                'indice'                 => $request->indice ?? null,
                'corps'                  => $request->corps ?? null,
                'grade'                  => $request->grade ?? null,
                'date_effet_carriere'    => $parseDate($request->date_effet_carriere),  // ✅

                'statut'                 => $request->statut ?? null,
                'etat'                   => ucfirst(strtolower($etatValue ?? 'actif')),

                'situation'              => $request->situation ?? null,
                'date_situation'         => $parseDate($request->date_situation),       // ✅
                'destination'            => $request->destination ?? null,
                'commentaire_situation'  => $request->commentaire_situation ?? null,

                'ancien_poste'           => $request->ancien_poste ?? null,
                'ancien_direction'       => $request->ancien_direction ?? null,
                'commentaire_historique' => $request->commentaire_historique ?? null,
            ]);

            // ✅ 2. Créer la CARRIÈRE
            if ($request->filled('categorie') && $request->filled('corps') && $request->filled('grade')) {
                $carriere = Carriere::create([
                    'personnel_id' => $personnel->id,
                    'categorie'    => $request->categorie,
                    'indice'       => $request->indice ?? '-',
                    'corps'        => $request->corps,
                    'grade'        => $request->grade,
                    'date_effet'   => $parseDate($request->date_effet_carriere) ?? now()->format('Y-m-d'), // ✅
                ]);

                $personnel->update(['id_carriere' => $carriere->id_carriere]);
            }

            // ✅ 3. Créer l'HISTORIQUE
if ($request->filled('ancien_poste') || $request->filled('ancien_direction') || $request->filled('ancien_employeur')) {
    Historique::create([
        'id_personnel'     => $personnel->id,
        'ancien_poste'     => $request->ancien_poste ?? null,
        'ancien_direction' => $request->ancien_direction ?? null,
        'ancien_service'   => $request->ancien_service ?? null,
        'ancien_employeur' => $request->ancien_employeur ?? null,
        'ancien_categorie' => $request->ancien_categorie ?? null,
        'ancien_grade'     => $request->ancien_grade ?? null,
        'ancien_corps'     => $request->ancien_corps ?? null,
        'ancien_indice'    => $request->ancien_indice ?? null,
        'date_debut'       => $parseDate($request->date_debut_ancien),
        'date_fin'         => $parseDate($request->date_fin_ancien),
        'motif_depart'     => $request->motif_depart ?? null,
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