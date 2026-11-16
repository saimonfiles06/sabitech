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
        return response()->json(['message' => 'No tienes permisos para esta acción.'], 404);
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

    
    public function reservasUsuario(Request $request, int $idUsuario): JsonResponse
    {
        $usuarioActual = $request->user();

        //Muestra si eres el user o admin
        if ($usuarioActual->id === $idUsuario || $usuarioActual->rol === 'administrador') {

            $reservas = DB::table('reservas')
                ->join('charlas', 'reserva.charla_id', '=', 'charlas.id')
                ->join('salas', 'charlas.sala_id', '=', 'sala_id')
                ->join('usuarios AS ponente', 'ponente_id', '=', 'charlas.ponente_id')
                ->join('usuarios AS supervisor', 'supervisor_id', '=', 'charlas.supervisor_id')
                ->select(
                'charlas.id',
                'charlas.titulo',
                'charlas.rama',
                'ponente.nombre AS nombre_ponente',
                'ponente.apellidos AS apellidos_ponente',
                'supervisor.nombre AS nombre_supervisor',
                'supervisor.apellidos AS apellidos_supervisor',
                'charlas.resumen_contenido',
                'charlas.contenido',
                'charlas.url_imagen',
                'salas.nombre AS nombre_sala',
                'charlas.fecha_hora_charla',
                'charlas.fecha_hora_entrada',
                'charlas.fecha_hora_fin',
                )
                ->where('usuario_id', $idUsuario)
                ->get();

                        return response()->json($reservas, 200);
        }

        //Si no eres el usuario o administrador, no muestra nada.
        return response()->json(['message' => 'No tienes permisos para esta acción.'], 403);
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