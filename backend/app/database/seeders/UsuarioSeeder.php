<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    private string $contrasena;

    public function run(): void
    {
        // Misma contraseña para todas las cuentas de prueba: "password"
        $this->contrasena = Hash::make('password');

        $usuarios = [];

        // Cuentas de laboratorio con correo conocido, para probar el login
        $usuarios[] = $this->fila('Admin', 'Sabitech', 'admin@correo.es', 'administrador');
        $usuarios[] = $this->fila('Ponente', 'Pruebas', 'ponente@correo.es', 'ponente');
        $usuarios[] = $this->fila('Usuario', 'Pruebas', 'usuario@correo.es', 'usuario');

        // 9 ponentes más (10 en total)
        for ($i = 0; $i < 9; $i++) {
            $usuarios[] = $this->filaFicticia('ponente');
        }

        // 38 usuarios más (39 en total)
        for ($i = 0; $i < 38; $i++) {
            $usuarios[] = $this->filaFicticia('usuario');
        }

        DB::table('usuarios')->insert($usuarios);
    }

    // Crea una fila con los datos que le pases
    private function fila(string $nombre, string $apellidos, string $correo, string $rol): array
    {
        return [
            'nombre'             => $nombre,
            'apellidos'          => $apellidos,
            'correo_electronico' => $correo,
            'password'           => $this->contrasena,
            'rol'                => $rol,
            'correo_confirmado'  => now(),
            'created_at'         => now(),
            'updated_at'         => now(),
        ];
    }

    // Crea una fila con nombre, apellidos y correo inventados
    private function filaFicticia(string $rol): array
    {
        return $this->fila(
            fake()->firstName(),
            fake()->lastName() . ' ' . fake()->lastName(),
            fake()->unique()->safeEmail(),
            $rol,
        );
    }
}