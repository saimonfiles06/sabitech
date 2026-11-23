<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    // Muestra listado de todos
    public function index(Request $request): JsonResponse
    {
        $usuarioActual = $request->user();
        if ($usuarioActual->rol === 'administrador'){
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
        //Si no eres administrador, no muestra nada.
        return response()->json(['message' => 'No tienes permisos para esta acción.'], 403);
    }


    // Manda los datos del usuario {id}
    public function idUsuario(Request $request, int $idUsuario): JsonResponse
    {
        $usuarioActual = $request->user();

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
                ->first();

            if ($usuario === null) {
                return response()->json(['message' => 'Usuario no encontrado.'], 404);
            }

            return response()->json($usuario, 200);
        }

        //Si no eres el usuario o administrador, no muestra nada.
        return response()->json(['message' => 'No tienes permisos para esta acción.'], 403);
    }

    // Actualiza los datos del usuario {id}
    public function actualizaUsuario(Request $request, int $idUsuario): JsonResponse
    {
        // TODO
        return response()->json(['message' => 'Pendiente de implementar.'], 501);
    } 

    // Borra los datos del usuario {id}
    public function borraUsuario(Request $request, int $idUsuario): JsonResponse
    {
        // TODO
        return response()->json(['message' => 'Pendiente de implementar.'], 501);
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
}