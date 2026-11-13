<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    public function index(): JsonResponse
    {
        $usuarios = DB::table('usuarios')
            ->select(
                'id',
                'nombre',
                'apellidos',
                'correo_electronico',
                'rol',
                'correo_confirmado',
                'created_at'
            )

            ->orderBy('id')
            ->get();

        return response()->json($usuarios, 200);
    }



    public function idUsuario(Request $peticion, int $idUsuario): JsonResponse
    {
        $usuarioActual = $peticion->user();

        //Datos comunes a mostrar
        $columnas = ['id', 'nombre', 'apellidos', 'correo_electronico', 'correo_confirmado', 'created_at'];

        //Si eres admin añade campo rol
        if ($usuarioActual->rol === 'administrador') {
            $columnas = [...$columnas, 'rol'];
        }

        //Muestra si eres el user o admin
        if ($usuarioActual->id === $idUsuario || $usuarioActual->rol === 'administrador') {

            $usuario = DB::table('usuarios')
                ->select($columnas)
                ->where('id', $idUsuario)
                ->get();

            if ($usuario === null) {
                return response()->json(['message' => 'Usuario no encontrado.'], 404);
            }

            return response()->json($usuario, 200);
        }

        //Si no eres el usuario o administrador, no muestra nada.
        return response()->json(['message' => 'No tienes permisos para esta acción.'], 404);
    }
} 

// Respuesta JSON
        // ==============
        // id
        // nombre
        // apellidos
        // correo_electronico
        // rol
        // correo_confirmado
        // fecha_alta