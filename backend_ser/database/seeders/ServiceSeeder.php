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

            // 🔵 DGT/DBIFA (id_direction = 26)
            
            // 🔵 DRH/MEF (id_direction = 17)
            
            // 🔵 DR/Antsiranana (id_direction = 30)
            
            ['nom_service' => 'SR/DIANA', 'id_direction' => 30],
            ['nom_service' => 'SR/SAVA', 'id_direction' => 30],
            
            // 🔵 DR/Fianar (id_direction = 32)
            
            ['nom_service' => 'DIR Fianar', 'id_direction' => 32],
            ['nom_service' => 'SR AMORONY MANIA', 'id_direction' => 32],
            ['nom_service' => 'SR ATSIMO ANTSINANANA', 'id_direction' => 32],
            ['nom_service' => 'SR HAUTE MATSIATRA', 'id_direction' => 32],
            ['nom_service' => 'SR IHOROMBE', 'id_direction' => 32],
            ['nom_service' => 'SR V7V', 'id_direction' => 32],

            // 🔵 DR/Mahajanga (id_direction = 34)
            
            ['nom_service' => 'DIR INTER ADJ BOENY', 'id_direction' => 34],
            ['nom_service' => 'SR BETSIBOKA', 'id_direction' => 34],
            ['nom_service' => 'SR BOENY', 'id_direction' => 34],
            ['nom_service' => 'SR MELAKY', 'id_direction' => 34],
            ['nom_service' => 'SR SOFIA', 'id_direction' => 34],
            
            // 🔵 DR/Tana (id_direction = 36)
            
            ['nom_service' => 'SRSTAT/ANALAMANGA', 'id_direction' => 36],
            ['nom_service' => 'SRSTAT/BONGOLAVA', 'id_direction' => 36],
            ['nom_service' => 'SRSTAT/ITASY', 'id_direction' => 36],
            ['nom_service' => 'SRSTAT/VAKINA', 'id_direction' => 36],

            // 🔵 DR/Toamasina (id_direction = 38)
            
            ['nom_service' => 'DIR ANTSINANANA', 'id_direction' => 38],
            ['nom_service' => 'SR ANALANJOROFO', 'id_direction' => 38],
            ['nom_service' => 'SR ANTSINANA', 'id_direction' => 38],
            ['nom_service' => 'SR ALAOTRA', 'id_direction' => 38],
            ['nom_service' => 'SR MANGORO', 'id_direction' => 38],

            // 🔵 DR/Toliara (id_direction = 40)
            
            ['nom_service' => 'SR/ANDROY', 'id_direction' => 40],
            ['nom_service' => 'SR/ANOSY', 'id_direction' => 40],
            ['nom_service' => 'SR/ATSIMO ANDREFANA', 'id_direction' => 40],
            ['nom_service' => 'SR MENABE', 'id_direction' => 40],
           
             // 🔵 CRM DIANA (id_direction = 42)
            
             // 🔵 CRM VAKINAKARATRA (id_direction = 44)
            
            

        ]);
    }
}