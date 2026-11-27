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

   // POST /api/reservas (requiere token)
    // El usuario que hace la petición reserva una plaza en una charla
    public function reservar(Request $peticion): JsonResponse
    {
        $datos = $peticion->validate(
            ['charla_id' => ['required', 'integer', 'exists:charlas,id']],
            [
                'charla_id.required' => 'Falta indicar la charla.',
                'charla_id.integer'  => 'La charla indicada no es válida.',
                'charla_id.exists'   => 'La charla no existe.',
            ]
        );

        // El usuario sale del token, nunca de los datos enviados
        $idUsuario = $peticion->user()->id;
        $idCharla  = $datos['charla_id'];

        // Todo dentro de una transacción: o se hace entero o no se hace nada
        return DB::transaction(function () use ($idUsuario, $idCharla) {

            // Bloquea la charla hasta terminar: si llegan dos reservas a la vez,
            // la segunda espera a que acabe la primera antes de contar plazas
            $charla = DB::table('charlas')
                ->join('salas', 'charlas.sala_id', '=', 'salas.id')
                ->where('charlas.id', $idCharla)
                ->select('charlas.estado', 'charlas.fecha_hora_charla', 'salas.aforo')
                ->lockForUpdate()
                ->first();

            // Solo se puede reservar en charlas activas
            if ($charla->estado !== 'activa') {
                return response()->json(['message' => 'Esta charla no admite reservas.'], 422);
            }

            // No se puede reservar una charla que ya ha empezado
            if (now()->greaterThanOrEqualTo($charla->fecha_hora_charla)) {
                return response()->json(['message' => 'La charla ya ha empezado.'], 422);
            }

            // ¿Tenía ya una reserva de esta charla (confirmada o cancelada)?
            $reservaPrevia = DB::table('reservas')
                ->where('usuario_id', $idUsuario)
                ->where('charla_id', $idCharla)
                ->first();

            if ($reservaPrevia && $reservaPrevia->estado === 'confirmada') {
                return response()->json(['message' => 'Ya tienes una plaza reservada en esta charla.'], 409);
            }

            // Control de aforo: solo cuentan las reservas confirmadas
            $plazasOcupadas = DB::table('reservas')
                ->where('charla_id', $idCharla)
                ->where('estado', 'confirmada')
                ->count();

            if ($plazasOcupadas >= $charla->aforo) {
                return response()->json(['message' => 'No quedan plazas disponibles.'], 409);
            }

            if ($reservaPrevia) {
                // La había cancelado: se vuelve a confirmar la misma reserva
                DB::table('reservas')
                    ->where('id', $reservaPrevia->id)
                    ->update([
                        'estado'     => 'confirmada',
                        'updated_at' => now(),
                    ]);

                $idReserva = $reservaPrevia->id;
            } else {
                $idReserva = DB::table('reservas')->insertGetId([
                    'usuario_id' => $idUsuario,
                    'charla_id'  => $idCharla,
                    'estado'     => 'confirmada',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            return response()->json([
                'message' => 'Plaza reservada correctamente.',
                'data'    => ['id' => $idReserva],
            ], 201);
        });
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

     public function reservasCharla(Request $request,Request $peticion, int $idCharla): JsonResponse
    {
        $usuarioActual = $request->user();
        
        
        //Muestra si eres admin o supervisor
        if ($usuarioActual->rol === 'administrador' || $usuarioActual->rol == 'supervisor') {
            
            // Filtro opcional por estado: /api/reserva?estado=cancelada
            $datos = $peticion->validate(
                ['estado' => ['nullable', 'in:activa, cancelada']],
                ['estado.in' => 'El estado ha de ser activa o cancelada.']
            );
            $estado = $datos['estado'] ?? null;

            $reservas = DB::table('reservas')
                ->join('usuarios', 'usuario_id', '=', 'usuario.id')
                ->select(
                'reservas.id',
                'usuarios.nombre',
                'usuarios.apellidos',
                'created_at',
                'updated_at'
                )
                ->where('charlas.id', $idCharla)
                ->when($estado, function ($consulta) use ($estado) {
                $consulta->where('charlas.rama', $estado);
            })
                ->orderBy('reservas.id')
                ->get();

                        return response()->json($reservas, 200);
        }

        //Si no eres el administrador o supervisor, no muestra nada.
        return response()->json(['message' => 'No tienes permisos para esta acción.'], 403);
    }

    public function modificaReserva(Request $request, int $idReserva): JsonResponse
    {
        // TODO
        return response()->json(['message' => 'Pendiente de implementar.'], 501);
    }

    public function borraReserva(Request $request, int $idReserva): JsonResponse
    {
        // TODO
        return response()->json(['message' => 'Pendiente de implementar.'], 501);
    }
}

