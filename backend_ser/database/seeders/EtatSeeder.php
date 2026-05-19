<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Etat;

class EtatSeeder extends Seeder
{
    public function run(): void
    {
        $etats = [
            ['nom_etat' => 'Actif'],
            ['nom_etat' => 'Inactif'],
            ['nom_etat' => 'En congé'],
            ['nom_etat' => 'Retraité'],
        ];

        foreach ($etats as $etat) {
            Etat::create($etat);
        }
    }
}
