<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('services')->insert([

            // 🔵 DAAF (id_direction = 1)
            ['nom_service' => 'SGFBC', 'id_direction' => 1],
            ['nom_service' => 'SGLP', 'id_direction' => 1],
            ['nom_service' => 'SGRH', 'id_direction' => 1],
          

            // 🔵 DSIC (id_direction = 2)
            
            ['nom_service' => 'SEGIW', 'id_direction' => 2],
            ['nom_service' => 'SMRR', 'id_direction' => 2],
            ['nom_service' => 'SMRI', 'id_direction' => 2],

            // 🔵 DG (id_direction = 3)
           
            ['nom_service' => 'Protocole', 'id_direction' => 3],
             ['nom_service' => 'SEAJ', 'id_direction' => 3],

            // 🔵 AC (id_direction = 8)
            
            ['nom_service' => 'SERVICE AC 1', 'id_direction' => 8],
            ['nom_service' => 'SERVICE AC 2', 'id_direction' => 8],

            // 🔵 CGP (id_direction = 5)
           
            ['nom_service' => 'CAO', 'id_direction' => 5],
            ['nom_service' => 'UCGAI', 'id_direction' => 5],
            ['nom_service' => 'UCSS', 'id_direction' => 5],
            ['nom_service' => 'UGPM', 'id_direction' => 5],
            ['nom_service' => 'UPPB', 'id_direction' => 5],

            // 🔵 DCNM (id_direction = 6)
            
            ['nom_service' => 'SCN', 'id_direction' => 6],
            ['nom_service' => 'SCTB', 'id_direction' => 6],
            ['nom_service' => 'SMP', 'id_direction' => 6],
            ['nom_service' => 'SE', 'id_direction' => 6],
            ['nom_service' => 'SNC', 'id_direction' => 6],
    
            // 🔵 DDSS (id_direction = 7)
           
            ['nom_service' => 'SERD', 'id_direction' => 7],
            ['nom_service' => 'SSEC', 'id_direction' => 7],
            ['nom_service' => 'SSS', 'id_direction' => 7],

        ]);
    }
}