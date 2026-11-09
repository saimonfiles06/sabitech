<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    // Seeder principal: llama a los demás en orden
    public function run(): void
    {
        $this->call([
            UsuarioSeeder::class,
            SalaSeeder::class,
            CharlaSeeder::class,
        ]);
    }
}
