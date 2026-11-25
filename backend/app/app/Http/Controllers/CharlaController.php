<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class CharlaController extends Controller
{
    //Listado completo de charlas (todos los datos) Para todos los publicos.
    public function index(): JsonResponse
    {
        // Subconsulta: reservas confirmadas de cada charla
        $reservasConfirmadas = DB::table('reservas')
            ->selectRaw('COUNT(*)')
            ->whereColumn('reservas.charla_id', 'charlas.id')
            ->where('reservas.estado', 'confirmada');

        $charlas = DB::table('charlas')
            ->join('usuarios AS ponente', 'charlas.ponente_id', '=', 'ponente.id')
            ->join('usuarios AS supervisor', 'charlas.supervisor_id', '=', 'supervisor.id')
            ->join('salas', 'charlas.sala_id', '=', 'salas.id')
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
                'salas.aforo',
                'charlas.fecha_hora_charla',
                'charlas.fecha_hora_entrada',
                'charlas.fecha_hora_fin',
            )
            ->selectSub($reservasConfirmadas, 'plazas_ocupadas') //Añadimos el dato de plazas ocupadas de la Subconsulta.
            ->where('estado', 'activa')             
            ->orderBy('fecha_hora_charla')
            ->get();

        // Plazas libres de cada charla
        foreach ($charlas as $charla) {
            $charla->plazas_libres   = max(0, $charla->aforo - $charla->plazas_ocupadas);
        }

        return response()->json($charlas, 200);

        // Respuesta JSON
        // ==============
        // id
        // titulo
        // rama
        // nombre_ponente
        // apellidos_ponente
        // nombre_supervisor
        // apellidos_supervisor
        // resumen_contenido
        // contenido
        // url_imagen
        // nombre_sala
        // fecha_charla
        // hora_entrada
        // hora_fin
    }
    
    //Obtener charla por id
    public function idCharla(int $idCharla): JsonResponse
    {
        // TODO
        // $charlas = DB::table('charlas')->select('id')->where('id', $idCharla)->get();
        // if ($charlas) {
        //     return response()->json($charlas->id, 200);
        // }
        // return response()->json('Charla no encontrada', 404);
        return response()->json(['message' => 'Pendiente de implementar.'], 501);
    }

    //Crear nueva charla
    public function creaCharla(Request $peticion): JsonResponse
    {
        // TODO
        return response()->json(['message' => 'Pendiente de implementar.'], 501);
    }

    //Modifica charla
    public function modificaCharla(int $idCharla): JsonResponse
    {
        // TODO
        return response()->json(['message' => 'Pendiente de implementar.'], 501);
    }

    //Elimina charla
    public function borraCharla(int $idCharla): JsonResponse
    {
        // TODO
        return response()->json(['message' => 'Pendiente de implementar.'], 501);
    }
}
