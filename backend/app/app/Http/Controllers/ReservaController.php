<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReservaController extends Controller
{
    public function index(): JsonResponse
    {
        $reservas = DB::table('reservas')
            ->join('usuarios', 'reservas.usuario_id', '=', 'usuarios.id')
            ->join('charlas', 'reservas.charla_id', '=', 'charlas.id')
            ->join('salas', 'charlas.sala_id', '=', 'salas.id')
            ->select(
                'reservas.id',
                'reservas.usuario_id',
                'usuarios.nombre AS nombre_usuario',
                'usuarios.apellidos AS apellidos_usuario',
                'reservas.charla_id',
                'charlas.titulo AS titulo_charla',
                'salas.nombre AS nombre_sala',
                'charlas.fecha_hora_charla',
                'reservas.estado',
                'reservas.correo_enviado_en',
                'reservas.hora_entrada',
                'reservas.created_at'
            )

            ->orderBy('reservas.id')
            ->get();

        return response()->json(['data' => $reservas]);

        // Respuesta JSON
        // ==============
        // id
        // usuario_id
        // nombre_usuario
        // apellidos_usuario
        // charla_id
        // titulo_charla
        // nombre_sala
        // fecha_hora_charla
        // estado
        // correo_enviado_en
        // hora_entrada
        // created_at
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'usuario_id' => 'required|integer|exists:usuarios,id',
            'charla_id'  => 'required|integer|exists:charlas,id',
        ]);

        $charla = DB::table('charlas')
            ->join('salas', 'charlas.sala_id', '=', 'salas.id')
            ->where('charlas.id', $datos['charla_id'])
            ->select('charlas.estado', 'salas.aforo')
            ->first();

        // Solo se puede reservar en charlas activas
        if ($charla->estado !== 'activa') {
            return response()->json(
                ['message' => 'La charla no admite reservas.'],
                422
            );
        }

        // Un usuario solo puede reservar una vez la charla
        $yaReservada = DB::table('reservas')
            ->where('usuario_id', $datos['usuario_id'])
            ->where('charla_id', $datos['charla_id'])
            ->exists();

        if ($yaReservada) {
            return response()->json(
                ['message' => 'El usuario ya tiene una reserva para esta charla.'],
                409
            );
        }

        // Control de aforo de la sala (solo cuentan las reservas confirmadas)
        $confirmadas = DB::table('reservas')
            ->where('charla_id', $datos['charla_id'])
            ->where('estado', 'confirmada')
            ->count();

        if ($confirmadas >= $charla->aforo) {
            return response()->json(
                ['message' => 'No quedan plazas disponibles.'],
                409
            );
        }

        $id = DB::table('reservas')->insertGetId([
            'usuario_id' => $datos['usuario_id'],
            'charla_id'  => $datos['charla_id'],
            'estado'     => 'confirmada',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['data' => ['id' => $id]], 201);
    }

    public function reservasUsuario(Request $request, int $idUsuario): JsonResponse
    {
        $usuarioActual = $request->user();

        //Muestra si eres el user o admin
        if ($usuarioActual->id === $idUsuario || $usuarioActual->rol === 'administrador') {

            $reservas = DB::table('reservas')
                ->join('charlas', 'reservas.charla_id', '=', 'charlas.id')
                ->join('salas', 'charlas.sala_id', '=', 'salas.id')
                ->join('usuarios AS ponente', 'charlas.ponente_id', '=', 'ponente.id')
                ->join('usuarios AS supervisor', 'charlas.supervisor_id', '=', 'supervisor.id')
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
                ->where('reservas.usuario_id', $idUsuario)
                ->orderBy('charlas.fecha_hora_charla')
                ->get();

                        return response()->json($reservas, 200);
        }

        //Si no eres el usuario o administrador, no muestra nada.
        return response()->json(['message' => 'No tienes permisos para esta acción.'], 403);
    }
}

