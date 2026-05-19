<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Create superadmin user
        User::firstOrCreate(
            ['email' => 'admin@instat.mg'],
            [
                'name' => 'Super Admin',
                'password' => \Illuminate\Support\Facades\Hash::make('Admin123!'),
                'role' => 'superadmin',
                'is_initialized' => true,
            ]
        );

        // Create test user if not exists
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'user',
            ]
        );

        // Appeler les seeders dans le bon ordre
        $this->call([
            DirectionSeeder::class,
            EtatSeeder::class,
            DirectionServiceSeeder::class,
            ServiceSeeder::class,
        ]);
    }
}
