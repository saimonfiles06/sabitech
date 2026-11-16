<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class CharlaController extends Controller
{
    //Listado charlas para rol administrador (todos los datos)
    public function index(): JsonResponse
    {
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
                'charlas.fecha_hora_charla',
                'charlas.fecha_hora_entrada',
                'charlas.fecha_hora_fin',
            )

            ->orderBy('charlas.id')
            ->get();

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
    public function idCharla(Request $idCharla): JsonResponse
    {
        $charlas = DB::table('charlas')->select('id')->where('id', $idCharla)->get();
        if ($charlas) {
            return response()->json($charlas->id, 200);
        }
        return response()->json('Charla no encontrada', 404);
    }
}
