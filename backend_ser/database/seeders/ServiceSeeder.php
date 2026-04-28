<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('services')->insert([

            // 🔵 DAAF (id_direction = 5)
            ['nom_service' => 'SGFBC', 'id_direction' => 5],
            ['nom_service' => 'SGLP', 'id_direction' => 5],
            ['nom_service' => 'SGRH', 'id_direction' => 5],
          

            // 🔵 DSIC (id_direction = 20)
            
            ['nom_service' => 'SEGIW', 'id_direction' => 20],
            ['nom_service' => 'SMRR', 'id_direction' => 20],
            ['nom_service' => 'SMRI', 'id_direction' => 20],

            // 🔵 DG (id_direction = 13)
           
            ['nom_service' => 'Protocole', 'id_direction' => 13],
             ['nom_service' => 'SEAJ', 'id_direction' => 13],

            // 🔵 AC (id_direction = 1)
           

            // 🔵 CGP (id_direction = 3)
           
            ['nom_service' => 'CAO', 'id_direction' => 3],
            ['nom_service' => 'UCGAI', 'id_direction' => 3],
            ['nom_service' => 'UCSS', 'id_direction' => 3],
            ['nom_service' => 'UGPM', 'id_direction' => 3],
            ['nom_service' => 'UPPB', 'id_direction' => 3],

            // 🔵 DCNM (id_direction = 7)
            
            ['nom_service' => 'SCN', 'id_direction' => 7],
            ['nom_service' => 'SCTB', 'id_direction' => 7],
            ['nom_service' => 'SMP', 'id_direction' => 7],
            ['nom_service' => 'SE', 'id_direction' => 7],
            ['nom_service' => 'SNC', 'id_direction' => 7],
    
            // 🔵 DDSS (id_direction = 9)
           
            ['nom_service' => 'SERD', 'id_direction' => 9],
            ['nom_service' => 'SSEC', 'id_direction' => 9],
            ['nom_service' => 'SSS', 'id_direction' => 9],

            // 🔵 DFRS (id_direction = 11)
            
            ['nom_service' => 'SDP', 'id_direction' => 11],
            ['nom_service' => 'SER', 'id_direction' => 11],
            ['nom_service' => 'SFS', 'id_direction' => 11],

            // 🔵 DSCVM (id_direction = 15)
            
            ['nom_service' => 'SSPC', 'id_direction' => 15],
            ['nom_service' => 'SSRE', 'id_direction' => 15],
            ['nom_service' => 'SSPCVM', 'id_direction' => 15],

            // 🔵 DSE (id_direction = 17)
            
            ['nom_service' => 'SSE', 'id_direction' => 17],
            ['nom_service' => 'SSES', 'id_direction' => 17],
            ['nom_service' => 'SSPB', 'id_direction' => 17],


        ]);
    }
}