<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Direction;

class DirectionSeeder extends Seeder
{
    public function run(): void
    {
        $directions = [
            ['nom_direction' => 'DAAF'],
            ['nom_direction' => 'DSIC'],
            ['nom_direction' => 'DG'],
            ['nom_direction' => 'GR'],
            ['nom_direction' => 'CGP'],
            ['nom_direction' => 'DCNM'],
            ['nom_direction' => 'DDSS'],
            ['nom_direction' => 'AC'],
        ];

        foreach ($directions as $direction) {
            Direction::create($direction);
        }
    }
}
