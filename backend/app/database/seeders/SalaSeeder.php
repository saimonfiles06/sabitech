<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SalaSeeder extends Seeder
{
    public function run(): void
    {
        $salas = [
            ['nombre' => 'Auditorio',            'aforo' => 120],
            ['nombre' => 'Sala de conferencias', 'aforo' => 60],
            ['nombre' => 'Aula 1',               'aforo' => 30],
            ['nombre' => 'Aula 2',               'aforo' => 30],
            ['nombre' => 'Sala de reuniones',    'aforo' => 5],
        ];

        // Añade las fechas de creación y modificación a cada sala
        foreach ($salas as $indice => $sala) {
            $salas[$indice]['created_at'] = now();
            $salas[$indice]['updated_at'] = now();
        }

        DB::table('salas')->insert($salas);
    }
}