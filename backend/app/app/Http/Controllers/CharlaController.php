<?php
namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CharlaController extends Controller
{
    public function index(): JsonResponse
    {
        $charlas = DB::table('charlas')
        ->join('usuarios', 'charlas.ponente_id', '=', 'usuarios.id')
        ->join('salas', 'charlas.sala_id', '=', 'salas.id')
        ->select(
            'charlas.id',
            'charlas.titulo',
            'charlas.rama',
            'usuarios.nombre AS nombre_ponente',
            'usuarios.apellidos AS apellidos_ponente',
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

        return response()->json(['data' => $charlas]);

        // Respuesta JSON
        // ==============
        // id
        // titulo
        // rama
        // nombre_ponente
        // apellidos_ponente
        // resumen_contenido
        // url_imagen
        // nombre_sala
        // fecha_charla
        // hora_entrada
        // hora_fin
    }
}