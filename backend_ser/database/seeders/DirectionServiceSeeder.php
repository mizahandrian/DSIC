<?php

namespace Database\Seeders;

//use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Direction;
use App\Models\Service;

class DirectionServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
{
    $data = [
        'DAAF' => ['SGFBC', 'SGLP', 'SGRH', 'SGBD'],
        'GR'   => ['GRS1', 'GRS2', 'GRS3', 'GRS4'],
    ];

    foreach ($data as $directionName => $services) {

        $direction = Direction::where('nom_direction', $directionName)->first();

        if (!$direction) continue;

        foreach ($services as $serviceName) {

            Service::create([
                'nom_service' => $serviceName,
                'id_direction' => $direction->id_direction
            ]);
        }
    }
}
}
